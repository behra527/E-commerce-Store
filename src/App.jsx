import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useCleanRouting } from './hooks/useCleanRouting';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Catalogue from './Pages/Catalogue';
import Contact from './Pages/Contect';
import Payment from './Pages/Payment';
import Login from './Pages/Login';
import Orders from './Pages/Order';
import Cart from './Pages/Cart';
import Loader from './components/Loader';
import CollectionItems from './components/CollectionItems';
import ItemDetail from './components/ItemDetail';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Shipping from './components/Shipping';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

//const stripePromise = loadStripe("pk_test_51RhtrbBZVZGNmacL7gCt8T80Jsjkwz8Ix6WqSGWritja33t30OLZ9cSyfijqZj6Ijti93AWOMLFh8PqAVmTUAYNY00GDrBRu3U")
 const stripePromise = loadStripe("pk_live_51RhtrbBZVZGNmacL8qJR4lihiI7QrmZPrbxi372lTy4I8wkqen1hwwsAOcXUjOwD8saSS2CziA11asDJBH8FWGJw00tt5ExAP7"); // Replace with your live key

function AppContent() {
  useCleanRouting(); // This handles clean URL display

  return (
    <Routes>
      {/* Public routes - ensure these are accessible */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} /> {/* Alternative route for compatibility */}

      {/* Layout-wrapped routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/catalogue" element={<Layout><Catalogue /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/collection/:categoryName" element={<Layout><CollectionItems /><Loader /></Layout>} />
      <Route path="/item/:itemId" element={<Layout><ItemDetail /></Layout>} />
      <Route path="/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/orders" element={<Layout><Orders /></Layout>} />

      {/* Protected payment route */}
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Elements stripe={stripePromise}>
              <Layout>
                <Payment />
              </Layout>
            </Elements>
          </ProtectedRoute>
        }
      />

      <Route
        path="/shipping"
        element={
          <ProtectedRoute>
            <Layout>
              <Shipping />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route for any unmatched paths */}
      <Route path="*" element={<Layout><Home /></Layout>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/4407308218767"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </Router>
  );
}

export default App;
