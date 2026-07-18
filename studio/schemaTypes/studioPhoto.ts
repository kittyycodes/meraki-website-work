import { defineField, defineType } from 'sanity'

export const studioPhoto = defineType({
  name: 'studioPhoto',
  title: 'Studio Photo',
  type: 'document',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (rule) => rule.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
})
