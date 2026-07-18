import { describe, it, expect } from 'vitest'
import config from './tailwind.config'

describe('tailwind design tokens', () => {
  it('locks the exact palette from the design spec', () => {
    const colors = config.theme?.extend?.colors as Record<string, string>
    expect(colors.cream).toBe('#FAF6EC')
    expect(colors['cream-alt']).toBe('#F3ECDC')
    expect(colors.charcoal).toBe('#211511')
    expect(colors['charcoal-alt']).toBe('#2E1F18')
    expect(colors.espresso).toBe('#2F1B12')
    expect(colors.ivory).toBe('#F1E9D6')
    expect(colors['ivory-soft']).toBe('#EFDCC4')
    expect(colors['text-muted-light']).toBe('#5c5750')
    expect(colors['text-muted-dark']).toBe('#c9bfae')
    expect(colors.amber).toBe('#C98B52')
    expect(colors['amber-cta']).toBe('#E0952F')
    expect(colors['sofa-blue']).toBe('#7C93A8')
    expect(colors['sofa-blue-dark']).toBe('#8FA8BA')
  })
})
