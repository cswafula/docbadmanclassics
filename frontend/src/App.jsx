import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Crafts from './pages/Crafts';
import CraftDetail from './pages/CraftDetail';
import Painting from './pages/Painting';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Museum from './pages/Museum';
import Coffee from './pages/Coffee';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPaintings from './pages/admin/Paintings';
import PaintingForm from './pages/admin/PaintingForm';
import AdminCrafts from './pages/admin/AdminCrafts';
import CraftForm from './pages/admin/CraftForm';
import AdminOrders from './pages/admin/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDeliveryRegions from './pages/admin/DeliveryRegions';
import AdminUsers from './pages/admin/Users';
import Locations from './pages/Locations';
import Donate from './pages/Donate';

function App() {
  const path = window.location.pathname;

  // ── Admin routes ──────────────────────────
  if (path === '/admin' || path === '/admin/')          return <AdminLogin />;
  if (path === '/admin/dashboard')                      return <AdminDashboard />;
  if (path === '/admin/paintings/new')                  return <PaintingForm />;
  if (path.match(/^\/admin\/paintings\/\d+\/edit$/))    return <PaintingForm />;
  if (path === '/admin/paintings')                      return <AdminPaintings />;
  if (path === '/admin/crafts/new')                     return <CraftForm />;
  if (path.match(/^\/admin\/crafts\/\d+\/edit$/))       return <CraftForm />;
  if (path === '/admin/crafts')                         return <AdminCrafts />;
  if (path === '/admin/orders')                         return <AdminOrders />;
  if (path === '/admin/delivery-regions')               return <AdminDeliveryRegions />;
  if (path === '/admin/users')                          return <AdminUsers />;


  // ── Customer routes ───────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {path === '/'                          && <Home />}
        {path === '/gallery'                   && <Gallery />}
        {path === '/crafts'                    && <Crafts />}
        {path.match(/^\/crafts\/\d+$/)         && <CraftDetail />}
        {path.match(/^\/paintings\/\d+$/)      && <Painting />}
        {path === '/cart'                      && <Cart />}
        {path === '/checkout'                  && <Checkout />}
        {path === '/about'                     && <About />}
        {path === '/museum'                    && <Museum />}
        {path === '/coffee'                    && <Coffee />}
        {path === '/locations'                 && <Locations />}
        {path === '/order-confirmation'        && <OrderConfirmation />}
        {path === '/donate'                    && <Donate />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
