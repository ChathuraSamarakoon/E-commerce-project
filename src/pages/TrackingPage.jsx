import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Header } from '../components/Header';
import './TrackingPage.css';

export function TrackingPage({ cart }) {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');

    const [orderProduct, setOrderProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orderId || !productId) {
            setError('Order information not found.');
            setLoading(false);
            return;
        }

        axios.get(`/api/orders/${orderId}?expand=products`)
            .then((response) => {
                const order = response.data;
                const found = order.products.find(
                    (p) => p.productId === productId
                );
                if (!found) {
                    setError('Product not found in this order.');
                } else {
                    setOrderProduct(found);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load tracking information.');
                setLoading(false);
            });
    }, [orderId, productId]);

    // Determine delivery status based on estimated delivery time
    function getDeliveryStatus(estimatedDeliveryTimeMs) {
        const now = Date.now();
        if (now < estimatedDeliveryTimeMs - 2 * 24 * 60 * 60 * 1000) {
            return 'preparing';
        } else if (now < estimatedDeliveryTimeMs) {
            return 'shipped';
        } else {
            return 'delivered';
        }
    }

    function getProgressWidth(status) {
        if (status === 'preparing') return '0%';
        if (status === 'shipped') return '50%';
        return '100%';
    }

    return (
        <>
            <title>Tracking</title>

            <Header cart={cart} />

            <div className="tracking-page">
                <div className="order-tracking">
                    <a className="back-to-orders-link link-primary" href="/orders">
                        View all orders
                    </a>

                    {loading && (
                        <div className="tracking-loading">Loading tracking information...</div>
                    )}

                    {error && (
                        <div className="tracking-error">{error}</div>
                    )}

                    {!loading && !error && orderProduct && (
                        <>
                            <div className="delivery-date">
                                {Date.now() >= orderProduct.estimatedDeliveryTimeMs
                                    ? `Delivered on ${dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}`
                                    : `Arriving on ${dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}`
                                }
                            </div>

                            <div className="product-info">
                                {orderProduct.product.name}
                            </div>

                            <div className="product-info">
                                Quantity: {orderProduct.quantity}
                            </div>

                            <img
                                className="product-image"
                                src={orderProduct.product.image}
                                alt={orderProduct.product.name}
                            />

                            {(() => {
                                const status = getDeliveryStatus(orderProduct.estimatedDeliveryTimeMs);
                                return (
                                    <>
                                        <div className="progress-labels-container">
                                            <div className={`progress-label${status === 'preparing' ? ' current-status' : ''}`}>
                                                Preparing
                                            </div>
                                            <div className={`progress-label${status === 'shipped' ? ' current-status' : ''}`}>
                                                Shipped
                                            </div>
                                            <div className={`progress-label${status === 'delivered' ? ' current-status' : ''}`}>
                                                Delivered
                                            </div>
                                        </div>

                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar"
                                                style={{ width: getProgressWidth(status) }}
                                            ></div>
                                        </div>
                                    </>
                                );
                            })()}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}