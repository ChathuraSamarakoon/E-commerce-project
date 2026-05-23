import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { HomePage } from '../pages/HomePage'

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [
        {
          id: 'product-1',
          name: 'Test Product',
          image: 'test.jpg',
          priceCents: 1000,
          rating: { stars: 4, count: 100 }
        }
      ]
    }),
    post: vi.fn().mockResolvedValue({ data: {} })
  }
}))

describe('HomePage', () => {

  it('render Add to Cart button ', async () => {
    render(
      <MemoryRouter>
        <HomePage cart={[]} loadCart={vi.fn()} />
      </MemoryRouter>
    )
    const buttons = await screen.findAllByText('Add to Cart')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('show Product name ', async () => {
    render(
      <MemoryRouter>
        <HomePage cart={[]} loadCart={vi.fn()} />
      </MemoryRouter>
    )
    const productName = await screen.findByText('Test Product')
    expect(productName).toBeInTheDocument()
  })

  it('Quantity select default value 1 ', async () => {
    render(
      <MemoryRouter>
        <HomePage cart={[]} loadCart={vi.fn()} />
      </MemoryRouter>
    )
    const select = await screen.findByRole('combobox')
    expect(select.value).toBe('1')
  })

})