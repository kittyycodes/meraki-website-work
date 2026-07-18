import type { EquipmentItem } from '@/lib/sanity/types'

export function EquipmentCard({ item }: { item: EquipmentItem }) {
  return (
    <div className="bg-cream-alt dark:bg-charcoal-alt rounded-lg p-4" data-testid={`equipment-${item._id}`}>
      <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />
      <h3 className="text-espresso dark:text-ivory font-semibold text-sm">{item.name}</h3>
      <p className="text-text-muted-light dark:text-text-muted-dark text-xs">{item.specLine}</p>
    </div>
  )
}
