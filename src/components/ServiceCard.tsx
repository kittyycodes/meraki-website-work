import type { Service } from '@/content/services'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-cream-alt dark:bg-charcoal-alt rounded-lg p-6" data-testid={`service-${service.name}`}>
      <h3 className="font-heading text-espresso dark:text-ivory font-semibold mb-2">{service.name}</h3>
      <p className="text-text-muted-light dark:text-text-muted-dark text-sm">{service.description}</p>
    </div>
  )
}
