#!/bin/sh
set -eu

html_dir=/usr/share/nginx/html
node_name=${NODE_NAME:-$(hostname)}

# Compose names are controlled values. Strip anything else so the inline
# JavaScript remains a safe string without requiring a runtime dependency.
node_name=$(printf '%s' "$node_name" | tr -cd 'A-Za-z0-9._-')
[ -n "$node_name" ] || node_name=$(hostname)

printf 'window.__NODE_NAME__ = "%s";\n' "$node_name" > "$html_dir/env-config.js"

# The generated script is inline in index.html, so the SPA knows its identity
# while parsing the document and never needs a discovery request. Vite places
# the module bundle in the head, so insert this immediately before that bundle.
# Remove the previous marked line first so a container restart cannot duplicate it.
sed '/data-runtime-node/d' "$html_dir/index.html" > "$html_dir/index.html.clean"
sed "s#<script type=\"module\"#<script data-runtime-node>window.__NODE_NAME__ = \"$node_name\";</script>\\
  <script type=\"module\"#" \
  "$html_dir/index.html.clean" > "$html_dir/index.html.tmp"
rm "$html_dir/index.html.clean"
mv "$html_dir/index.html.tmp" "$html_dir/index.html"

exec nginx -g 'daemon off;'
