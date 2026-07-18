import { defineField, defineType } from 'sanity'

export const workSample = defineType({
  name: 'workSample',
  title: 'Work Sample',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'category',
      title: 'Service Category',
      type: 'string',
      options: {
        list: [
          'Recording',
          'Music Production',
          'Mixing & Mastering',
          'Audiobook Productions',
          'Music Distribution & Publishing',
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
  ],
})
