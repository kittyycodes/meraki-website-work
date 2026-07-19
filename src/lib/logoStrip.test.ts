import { describe, it, expect } from 'vitest'
import { duplicateForLoop } from './logoStrip'

describe('duplicateForLoop', () => {
  it('doubles the list for a seamless scroll loop', () => {
    expect(duplicateForLoop([1, 2, 3])).toEqual([1, 2, 3, 1, 2, 3])
  })

  it('handles an empty list', () => {
    expect(duplicateForLoop([])).toEqual([])
  })
})
