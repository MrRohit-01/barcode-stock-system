import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify
import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import SuspenseWrapper from './components/common/SuspenseWrapper';

// Lazy load components
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const BarcodeScanner = lazy(() => import('./components/scanner/BarcodeScanner'));
const Cart = lazy(() => import('./components/billing/Cart'));
const Checkout = lazy(() => import('./components/billing/Checkout'));
const InventoryMovements = lazy(() => import('./components/inventory/InventoryMovements'));
const Products = lazy(() => import('./pages/Products/Products'));
const EditProduct = lazy(() => import('./components/products/EditProduct'));
const ProductDetails = lazy(() => import('./components/products/ProductDetails'));
const TransactionList = lazy(() => import('./pages/Transactions/TransactionList'));
const AddProduct = lazy(() => import('./pages/Products/AddProduct'));

function App() {
  return (
  
      <MantineProvider
        theme={{
          colorScheme: 'light',
          primaryColor: 'indigo',
        }}
      >
        {/* ToastContainer for react-toastify */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <BrowserRouter>
          <SuspenseWrapper>
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="scan" element={<BarcodeScanner />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="inventory" element={<InventoryMovements />} />
                <Route path="products" element={<Products />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="transactions" element={<TransactionList />} />
              </Route>
            </Routes>
          </SuspenseWrapper>
        </BrowserRouter>
      </MantineProvider>
  
  );
}

export default App;
