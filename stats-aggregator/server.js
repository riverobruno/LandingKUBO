const http = require('node:http');

const port = Number(process.env.PORT || 3000);
const dockerSocket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const allowedNodes = /^(backend|frontend)-[1-3]$/;

function dockerRequest(pathname) {
  return new Promise((resolve, reject) => {
    const request = http.request({ socketPath: dockerSocket, path: pathname, method: 'GET' }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Docker API returned ${response.statusCode}`));
          return;
        }

        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error('Docker API returned invalid JSON'));
        }
      });
    });

    request.setTimeout(2500, () => request.destroy(new Error('Docker API timeout')));
    request.on('error', reject);
    request.end();
  });
}

function json(response, statusCode, body) {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function cpuPercent(stats) {
  const cpuDelta = (stats.cpu_stats?.cpu_usage?.total_usage || 0)
    - (stats.precpu_stats?.cpu_usage?.total_usage || 0);
  const systemDelta = (stats.cpu_stats?.system_cpu_usage || 0)
    - (stats.precpu_stats?.system_cpu_usage || 0);
  const cpuCount = stats.cpu_stats?.online_cpus
    || stats.cpu_stats?.cpu_usage?.percpu_usage?.length
    || 1;

  if (cpuDelta <= 0 || systemDelta <= 0) return 0;
  return Number(((cpuDelta / systemDelta) * cpuCount * 100).toFixed(2));
}

function memoryStats(stats) {
  const usage = Number(stats.memory_stats?.usage || 0);
  const cache = Number(stats.memory_stats?.stats?.cache || 0);
  const workingSet = Math.max(usage - cache, 0);
  const limit = Number(stats.memory_stats?.limit || 0);

  return {
    usageBytes: workingSet,
    limitBytes: limit,
    percent: limit > 0 ? Number(((workingSet / limit) * 100).toFixed(2)) : null,
  };
}

async function getNodeStats(nodeName) {
  const filters = encodeURIComponent(JSON.stringify({
    label: [`com.docker.compose.service=${nodeName}`],
  }));
  const containers = await dockerRequest(`/containers/json?all=1&filters=${filters}`);
  const container = containers[0];

  if (!container) {
    return { nodeName, status: 'down', health: 'unknown', cpu: null, memory: null };
  }

  const inspect = await dockerRequest(`/containers/${encodeURIComponent(container.Id)}/json`);
  const running = inspect.State?.Status === 'running';
  const result = {
    nodeName,
    status: running ? 'up' : 'down',
    health: inspect.State?.Health?.Status || 'none',
    cpu: null,
    memory: null,
  };

  if (!running) return result;

  const stats = await dockerRequest(`/containers/${encodeURIComponent(container.Id)}/stats?stream=false`);
  result.cpu = { percent: cpuPercent(stats) };
  result.memory = memoryStats(stats);
  return result;
}

async function handleStats(response, nodeName) {
  if (!allowedNodes.test(nodeName)) {
    json(response, 404, { error: 'Unknown node' });
    return;
  }

  try {
    json(response, 200, await getNodeStats(nodeName));
  } catch (error) {
    json(response, 503, {
      error: 'Docker API unavailable',
      detail: error instanceof Error ? error.message : 'Unknown Docker API error',
    });
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', 'http://localhost');

  if (request.method !== 'GET') {
    json(response, 405, { error: 'Method not allowed' });
    return;
  }

  if (url.pathname === '/health') {
    json(response, 200, { status: 'ok' });
    return;
  }

  const match = url.pathname.match(/^\/stats\/([^/]+)$/);
  if (match) {
    handleStats(response, decodeURIComponent(match[1]));
    return;
  }

  json(response, 404, { error: 'Not found' });
});

server.listen(port, '0.0.0.0');
