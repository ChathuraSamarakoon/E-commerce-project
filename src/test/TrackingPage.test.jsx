import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'
import { TrackingPage } from '../pages/TrackingPage'

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}))

import axios from 'axios'


const futureDelivery = new Date('2026-12-01').getTime()


const pastDelivery = new Date('2026-01-01').getTime()

const mockOrderProduct = {
  productId: 'product-1',
  quantity: 2,
  estimatedDeliveryTimeMs: futureDelivery,
  product: {
    id: 'product-1',
    name: 'Test Product',
    image: 'test.jpg'
  }
}


const renderWithParams = (orderId, productId) => {
  return render(
    <MemoryRouter initialEntries={[`/tracking?orderId=${orderId}&productId=${productId}`]}>
      <Routes>
        <Route path="/tracking" element={<TrackingPage cart={[]} />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('TrackingPage', () => {

  it('Show Loading state ', () => {
    axios.get.mockReturnValue(new Promise(() => {}))
    renderWithParams('order-1', 'product-1')
    expect(screen.getByText('Loading tracking information...')).toBeInTheDocument()
  })

  it('Error Checking for orderId ', async () => {
    render(
      <MemoryRouter initialEntries={['/tracking']}>
        <Routes>
          <Route path="/tracking" element={<TrackingPage cart={[]} />} />
        </Routes>
      </MemoryRouter>
    )
    await screen.findByText('Order information not found.')
  })

  it('Show Product name ', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 'order-1',
        products: [mockOrderProduct]
      }
    })
    renderWithParams('order-1', 'product-1')
    await screen.findByText('Test Product')
  })

  it('Show Quantity ', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 'order-1',
        products: [mockOrderProduct]
      }
    })
    renderWithParams('order-1', 'product-1')
    await screen.findByText('Quantity: 2')
  })

  it('Future delivery - "Arriving on"', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 'order-1',
        products: [mockOrderProduct]
      }
    })
    renderWithParams('order-1', 'product-1')
    const arriving = await screen.findByText(/Arriving on/i)
    expect(arriving).toBeInTheDocument()
  })

  it('Past delivery - "Delivered on" ', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 'order-1',
        products: [{ ...mockOrderProduct, estimatedDeliveryTimeMs: pastDelivery }]
      }
    })
    renderWithParams('order-1', 'product-1')
    const delivered = await screen.findByText(/Delivered on/i)
    expect(delivered).toBeInTheDocument()
  })

  it('Preparing status - correct label highlight ', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 'order-1',
        products: [mockOrderProduct]
      }
    })
    renderWithParams('order-1', 'product-1')
    await waitFor(() => {
      const preparingLabel = screen.getByText('Preparing')
      expect(preparingLabel.className).toContain('current-status')
    })
  })

  it('Delivered status - correct label highlight ', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 'order-1',
        products: [{ ...mockOrderProduct, estimatedDeliveryTimeMs: pastDelivery }]
      }
    })
    renderWithParams('order-1', 'product-1')
    await waitFor(() => {
      const deliveredLabel = screen.getByText('Delivered')
      expect(deliveredLabel.className).toContain('current-status')
    })
  })

  it('Product not found error show ', async () => {
    axios.get.mockResolvedValue({
      data: {
        id: 'order-1',
        products: []
      }
    })
    renderWithParams('order-1', 'wrong-product-id')
    await screen.findByText('Product not found in this order.')
  })

  it('API fail - error show ', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'))
    renderWithParams('order-1', 'product-1')
    await screen.findByText('Failed to load tracking information.')
  })

  it('View all orders link ', () => {
    axios.get.mockReturnValue(new Promise(() => {}))
    renderWithParams('order-1', 'product-1')
    const link = screen.getByText('View all orders')
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/orders')
  })

})