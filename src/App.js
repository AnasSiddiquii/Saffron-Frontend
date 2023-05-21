import './App.css';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './components/Login'

import Protected from './components/Protected'
import Home from './components/Home'

import AddCustomer from './components/Customer/AddCustomer'
import EditCustomer from './components/Customer/EditCustomer'

import AddOrder from './components/Order/AddOrder'
import EditOrder from './components/Order/EditOrder'

import AddPayment from './components/Payment/AddPayment'
import EditPayment from './components/Payment/EditPayment'
import Payments from './components/Payment/Payments'

function App() {
  return (
    <HashRouter>
      <div className="center">
        <Routes>
        
          <Route path='/' element={<Login />} />

          <Route element={<Protected />}>
            <Route path='/home' element={<Home />} />

            <Route path='/addCustomer' element={<AddCustomer />} />
            <Route path='/editCustomer/:id' element={<EditCustomer />} />
            
            <Route path='/addOrder/:id' element={<AddOrder />} />
            <Route path='/editOrder/:id/:id2' element={<EditOrder />} />
            
            <Route path='/addPayment/:id' element={<AddPayment />} />
            <Route path='/editPayment/:id/:id2' element={<EditPayment />} />
            <Route path='/payments/:id' element={<Payments />} />
          </Route>
          
          <Route path="/*" element={<Navigate to='/' />} />

        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
