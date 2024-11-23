import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import BarcodeScanner from './components/scanner/BarcodeScanner';
import ProductDetails from './components/products/ProductDetails';
import InventoryMovements from './components/inventory/inventoryMovements';
import ProductList from './components/inventory/ProductList';
import Cart from './components/billing/Cart';
import Checkout from './components/billing/Checkout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProduct from './pages/Products/AddProduct';
import EditProduct from './components/products/EditProduct';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Toaster } from 'react-hot-toast';
import Products from './pages/Products/Products';
import TransactionList from './pages/Transactions/TransactionList.jsx';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <MantineProvider
        theme={{
          colorScheme: 'light',
          primaryColor: 'indigo',
          // other theme customizations
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="scan" element={<BarcodeScanner />} />
              </Route>
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="inventory" element={<InventoryMovements />} />
              <Route path="edit/:id" element={<EditProduct />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="transactions" element={<TransactionList />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}

export default App;
