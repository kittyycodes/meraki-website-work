export function Hero() {
  return (
    <section id="hero" className="bg-cream-alt dark:bg-charcoal-alt py-24 px-6 text-center">
      <h1 className="font-heading text-espresso dark:text-ivory text-4xl font-bold mb-4">
        Where your sound comes to life.
      </h1>
      <p className="text-text-muted-light dark:text-text-muted-dark mb-8">
        Recording · Mixing &amp; Mastering · Music Production
      </p>
      <div className="flex justify-center gap-4">
        <a
          href="#contact"
          className="bg-espresso dark:bg-amber-cta text-cream dark:text-charcoal px-6 py-3 rounded-lg font-semibold"
        >
          Book Now
        </a>
        <a
          href="/our-works"
          className="border-2 border-sofa-blue dark:border-sofa-blue-dark text-sofa-blue dark:text-sofa-blue-dark px-6 py-3 rounded-lg font-semibold"
        >
          Our Works
        </a>
      </div>
    </section>
  )
}
