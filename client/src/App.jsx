import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth components (direct import for critical path)
import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load all components
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const Products = lazy(() => import('./pages/Products/Products'));
const Transactions = lazy(() => import('./pages/Transactions/TransactionList'));
const Cart = lazy(() => import('./components/billing/Cart'));
const Checkout = lazy(() => import('./components/billing/Checkout'));
const Invoice = lazy(() => import('./components/billing/Invoice'));
const InventoryMovements = lazy(() => import('./components/inventory/InventoryMovements'));
const BarcodeScanner = lazy(() => import('./components/scanner/BarcodeScanner'));
const AddProduct = lazy(() => import('./pages/Products/AddProduct'));
const EditProduct = lazy(() => import('./components/products/EditProduct'));
const ProductDetails = lazy(() => import('./components/products/ProductDetails'));
const BarcodeResult = lazy(() => import('./components/scanner/BarcodeResult'));

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        }>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="products" element={<Products />} />
              <Route path="transactions" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Transactions />
                </Suspense>
              } />
              <Route path="inventory" element={<InventoryMovements />} />
              <Route path="scanner" element={<BarcodeScanner />} />
              <Route path="scan-result" element={<BarcodeResult />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="invoice/:id" element={<Invoice />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;

