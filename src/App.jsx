import axios from 'axios'
import { Route, Routes } from 'react-router'
import { useEffect, useState } from 'react'
import { HomePage } from './pages/HomePage'
import { CheckoutPage } from './pages/CheckoutPage' 
import { OrdersPage } from './pages/OrdersPage'
import { TrackingPage } from './pages/TrackingPage'
import './App.css'




function App() {

  const [cart, setCart] = useState ([]);

    const loadCart = async() => {
    const response =await axios.get ('/api/cart-items?expand=product')
    
    setCart(response.data)
    
    }

  useEffect (() =>{

      loadCart();
      
  },[])



 
  return (
    <Routes>
      <Route index element={<HomePage cart={cart} loadCart={loadCart}/>}/>
      <Route path='/checkout' element={<CheckoutPage cart={cart} loadCart={loadCart}/>}/>
      <Route path='orders' element={<OrdersPage cart={cart}/>}/>
      <Route path='tracking' element={<TrackingPage cart={cart}/>}/>

      
    </Routes>
    
  )
}

export default App
