import type { WorkSample } from '@/lib/sanity/types'

export function WorkSampleCard({ work }: { work: WorkSample }) {
  return (
    <div className="bg-cream-alt dark:bg-charcoal-alt rounded-lg overflow-hidden" data-testid={`work-${work._id}`}>
      <img src={work.imageUrl} alt={work.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="font-heading text-espresso dark:text-ivory font-semibold">{work.title}</h3>
        <p className="text-text-muted-light dark:text-text-muted-dark text-sm">{work.description}</p>
      </div>
    </div>
  )
}
