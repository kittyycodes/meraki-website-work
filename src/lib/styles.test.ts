import { describe, it, expect } from 'vitest'
import { LINK_CLASS } from './styles'

describe('LINK_CLASS', () => {
  it('always includes a visible underline treatment', () => {
    expect(LINK_CLASS).toContain('underline')
  })
})
