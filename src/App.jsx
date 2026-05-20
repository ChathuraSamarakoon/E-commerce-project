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

  useEffect (() =>{
      const fetchAppData = async() => {
        const response =await axios.get ('/api/cart-items?expand=product')
        
        setCart(response.data)
        
      }
      fetchAppData();
      
  },[])



 
  return (
    <Routes>
      <Route index element={<HomePage cart={cart}/>}/>
      <Route path='Checkout' element={<CheckoutPage cart={cart}/>}/>
      <Route path='orders' element={<OrdersPage cart={cart}/>}/>
      <Route path='tracking' element={<TrackingPage cart={cart}/>}/>

      
    </Routes>
    
  )
}

export default App
