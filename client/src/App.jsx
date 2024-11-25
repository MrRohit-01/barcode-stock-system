import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
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

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <MantineProvider
        theme={{
          colorScheme: 'light',
          primaryColor: 'indigo',
        }}
      >
        <ToastContainer />
        <BrowserRouter>
          <SuspenseWrapper>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <PublicRoute>
                  <SuspenseWrapper>
                    <Login />
                  </SuspenseWrapper>
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <SuspenseWrapper>
                    <Login />
                  </SuspenseWrapper>
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <SuspenseWrapper>
                    <Register />
                  </SuspenseWrapper>
                </PublicRoute>
              } />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={
                  <SuspenseWrapper>
                    <Dashboard />
                  </SuspenseWrapper>
                } />
                <Route path="scan" element={
                  <SuspenseWrapper>
                    <BarcodeScanner />
                  </SuspenseWrapper>
                } />
                <Route path="cart" element={
                  <SuspenseWrapper>
                    <Cart />
                  </SuspenseWrapper>
                } />
                <Route path="checkout" element={
                  <SuspenseWrapper>
                    <Checkout />
                  </SuspenseWrapper>
                } />
                <Route path="inventory" element={
                  <SuspenseWrapper>
                    <InventoryMovements />
                  </SuspenseWrapper>
                } />
                <Route path="products" element={
                  <SuspenseWrapper>
                    <Products />
                  </SuspenseWrapper>
                } />
                <Route path="products/edit/:id" element={
                  <SuspenseWrapper>
                    <EditProduct />
                  </SuspenseWrapper>
                } />
                <Route path="products/:id" element={
                  <SuspenseWrapper>
                    <ProductDetails />
                  </SuspenseWrapper>
                } />
                <Route path="transactions" element={
                  <SuspenseWrapper>
                    <TransactionList />
                  </SuspenseWrapper>
                } />
              </Route>
            </Routes>
          </SuspenseWrapper>
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}

export default App;
