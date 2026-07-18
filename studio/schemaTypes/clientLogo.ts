import { defineField, defineType } from 'sanity'

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Client Logo',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Client Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', validation: (rule) => rule.required() }),
  ],
})
