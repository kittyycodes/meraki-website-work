import { SERVICES } from '@/content/services'
import { ServiceCard } from './ServiceCard'

export function Services() {
  return (
    <section id="services" className="bg-cream dark:bg-charcoal py-16 px-6">
      <h2 className="font-heading text-espresso dark:text-ivory text-2xl font-bold mb-8">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </section>
  )
}
