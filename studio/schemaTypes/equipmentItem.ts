import { defineField, defineType } from 'sanity'

export const equipmentItem = defineType({
  name: 'equipmentItem',
  title: 'Equipment Item',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'specLine', title: 'Spec Line', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image' }),
  ],
})
