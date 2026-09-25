import InteractiveProcess from '@/components/InteractiveProcess/InteractiveProcess'

function Home() {
  return (
    <main>
      <InteractiveProcess />
      <section
        id="contacto"
        className="bg-[var(--color-surface)] px-6 py-24 text-stone-900 sm:px-10 lg:px-[7.4vw] lg:py-32"
        aria-labelledby="contacto-title"
      >
        <div className="mx-auto max-w-5xl">
          <h2 id="contacto-title" className="text-3xl font-light tracking-[-0.04em] sm:text-4xl">
            Contacto
          </h2>
          <ul className="mt-8 grid gap-4 text-lg sm:grid-cols-2 sm:text-xl lg:grid-cols-5">
            <li>Joaquín</li>
            <li>Yoel</li>
            <li>Martín</li>
            <li>Valentino</li>
            <li>Bruno</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Home
