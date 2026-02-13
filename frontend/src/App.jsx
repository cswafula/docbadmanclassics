import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
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

function App() {
  const path = window.location.pathname;

  // ── Admin routes ──────────────────────────
  if (path === '/admin' || path === '/admin/')          return <AdminLogin />;
  if (path === '/admin/dashboard')                      return <AdminDashboard />;
  if (path === '/admin/paintings/new')                  return <PaintingForm />;
  if (path.match(/^\/admin\/paintings\/\d+\/edit$/))    return <PaintingForm />;
  if (path === '/admin/paintings')                      return <AdminPaintings />;

  // ── Customer routes ───────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {path === '/'                          && <Home />}
        {path === '/gallery'                   && <Gallery />}
        {path.match(/^\/paintings\/\d+$/)      && <Painting />}
        {path === '/cart'                      && <Cart />}
        {path === '/checkout'                  && <Checkout />}
        {path === '/about'                     && <About />}
        {path === '/museum'                    && <Museum />}
        {path === '/coffee'                    && <Coffee />}
      </main>
      <Footer />
    </div>
  );
}

export default App;