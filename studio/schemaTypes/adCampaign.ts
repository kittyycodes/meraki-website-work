import { defineField, defineType } from 'sanity'

export const adCampaign = defineType({
  name: 'adCampaign',
  title: 'Ad Campaign',
  type: 'document',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', validation: (rule) => rule.required() }),
    defineField({ name: 'link', title: 'Link URL', type: 'url', validation: (rule) => rule.required() }),
    defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: false }),
  ],
})
