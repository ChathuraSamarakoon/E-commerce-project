import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { OrdersPage } from '../pages/OrdersPage'

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [
        {
          id: 'order-1',
          orderTimeMs: new Date('2026-05-01').getTime(),
          totalCostCents: 2200,
          products: [
            {
              productId: 'product-1',
              quantity: 2,
              estimatedDeliveryTimeMs: new Date('2026-06-01').getTime(),
              product: {
                id: 'product-1',
                name: 'Test Product',
                image: 'test.jpg',
                priceCents: 1000,
                rating: { stars: 4, count: 100 }
              }
            }
          ]
        }
      ]
    })
  }
}))

describe('OrdersPage', () => {

  it('Your Orders title show වෙනවාද', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} />
      </MemoryRouter>
    )
    const title = await screen.findByText('Your Orders')
    expect(title).toBeInTheDocument()
  })

  it('Order ID show වෙනවාද', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} />
      </MemoryRouter>
    )
    const orderId = await screen.findByText('order-1')
    expect(orderId).toBeInTheDocument()
  })

  it('Product name show වෙනවාද', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} />
      </MemoryRouter>
    )
    const productName = await screen.findByText('Test Product')
    expect(productName).toBeInTheDocument()
  })

  it('Order placed date show වෙනවාද', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} />
      </MemoryRouter>
    )
    const orderDate = await screen.findByText('May 1')
    expect(orderDate).toBeInTheDocument()
  })

  it('Quantity show වෙනවාද', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} />
      </MemoryRouter>
    )
    const quantity = await screen.findByText('Quantity: 2')
    expect(quantity).toBeInTheDocument()
  })

  it('Track package button show වෙනවාද', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} />
      </MemoryRouter>
    )
    const trackBtn = await screen.findByText('Track package')
    expect(trackBtn).toBeInTheDocument()
  })

  it('Track package button correct link එකට යනවාද', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} />
      </MemoryRouter>
    )
    const trackLink = await screen.findByRole('link', { name: /track package/i })
    expect(trackLink.getAttribute('href')).toContain('order-1')
    expect(trackLink.getAttribute('href')).toContain('product-1')
  })

  it('Add to Cart button show වෙනවාද', async () => {
    render(
      <MemoryRouter>
        <OrdersPage cart={[]} />
      </MemoryRouter>
    )
    const addToCartBtn = await screen.findByText('Add to Cart')
    expect(addToCartBtn).toBeInTheDocument()
  })

})