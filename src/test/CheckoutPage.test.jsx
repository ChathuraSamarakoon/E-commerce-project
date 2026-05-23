import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { CheckoutPage } from '../pages/CheckoutPage'

vi.mock('axios', () => ({
  default: {
    get: vi.fn((url) => {
      if (url.includes('delivery-options')) {
        return Promise.resolve({
          data: [
            {
              id: 'delivery-1',
              priceCents: 0,
              estimatedDeliveryTimeMs: new Date('2026-06-01').getTime()
            },
            {
              id: 'delivery-2',
              priceCents: 499,
              estimatedDeliveryTimeMs: new Date('2026-05-28').getTime()
            }
          ]
        })
      }
      if (url.includes('payment-summary')) {
        return Promise.resolve({
          data: {
            totalItems: 2,
            productCostCents: 2000,
            shippingCostCents: 0,
            totalCostBeforeTaxCents: 2000,
            taxCents: 200,
            totalCostCents: 2200
          }
        })
      }
      return Promise.resolve({ data: [] })
    }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} })
  }
}))

const mockCart = [
  {
    productId: 'product-1',
    quantity: 2,
    deliveryOptionId: 'delivery-1',
    product: {
      id: 'product-1',
      name: 'Test Product',
      image: 'test.jpg',
      priceCents: 1000,
      rating: { stars: 4, count: 100 }
    }
  }
]

describe('CheckoutPage', () => {

  it('Show Cart items count in  header ', async () => {
    render(
      <MemoryRouter>
        <CheckoutPage cart={mockCart} loadCart={vi.fn()} />
      </MemoryRouter>
    )
    const itemCount = await screen.findByText(/1 items/i)
    expect(itemCount).toBeInTheDocument()
  })

  it('Show Product name ', async () => {
    render(
      <MemoryRouter>
        <CheckoutPage cart={mockCart} loadCart={vi.fn()} />
      </MemoryRouter>
    )
    const productName = await screen.findByText('Test Product')
    expect(productName).toBeInTheDocument()
  })

  it('Show Payment summary ', async () => {
    render(
      <MemoryRouter>
        <CheckoutPage cart={mockCart} loadCart={vi.fn()} />
      </MemoryRouter>
    )
    const orderTotal = await screen.findByText('Order total:')
    expect(orderTotal).toBeInTheDocument()
  })

  it('Delete button ', async () => {
    const mockLoadCart = vi.fn()
    render(
      <MemoryRouter>
        <CheckoutPage cart={mockCart} loadCart={mockLoadCart} />
      </MemoryRouter>
    )
    const deleteBtn = await screen.findByText('Delete')
    fireEvent.click(deleteBtn)
    await waitFor(() => {
      expect(mockLoadCart).toHaveBeenCalled()
    })
  })

  it('Update button click ', async () => {
    render(
      <MemoryRouter>
        <CheckoutPage cart={mockCart} loadCart={vi.fn()} />
      </MemoryRouter>
    )
    const updateBtn = await screen.findByText('Update')
    fireEvent.click(updateBtn)
    const saveBtn = await screen.findByText('Save')
    expect(saveBtn).toBeInTheDocument()
  })

  it('Show Place your order button ', async () => {
    render(
      <MemoryRouter>
        <CheckoutPage cart={mockCart} loadCart={vi.fn()} />
      </MemoryRouter>
    )
    const placeOrderBtn = await screen.findByText('Place your order')
    expect(placeOrderBtn).toBeInTheDocument()
  })

  it('api call for Place your order click ', async () => {
    const mockLoadCart = vi.fn()
    render(
      <MemoryRouter>
        <CheckoutPage cart={mockCart} loadCart={mockLoadCart} />
      </MemoryRouter>
    )
    const placeOrderBtn = await screen.findByText('Place your order')
    fireEvent.click(placeOrderBtn)
    await waitFor(() => {
      expect(mockLoadCart).toHaveBeenCalled()
    })
  })

})