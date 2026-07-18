import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EquipmentCard } from './EquipmentCard'

describe('EquipmentCard', () => {
  it('renders the equipment name and spec line', () => {
    render(<EquipmentCard item={{ _id: '1', name: 'Neumann U87', specLine: 'Large-diaphragm condenser', imageUrl: 'mic.jpg' }} />)
    expect(screen.getByText('Neumann U87')).toBeInTheDocument()
    expect(screen.getByText('Large-diaphragm condenser')).toBeInTheDocument()
    expect(screen.getByAltText('Neumann U87')).toHaveAttribute('src', 'mic.jpg')
  })
})
