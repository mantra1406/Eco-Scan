import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { PageWrapper } from './components/layout/PageWrapper';
import { Landing } from './pages/Landing';
import { Scanner } from './pages/Scanner';
import { Dashboard } from './pages/Dashboard';
import { Leaderboard } from './pages/Leaderboard';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';

/**
 * Animated routes component
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Landing />
            </PageWrapper>
          }
        />
        <Route
          path="/scanner"
          element={
            <PageWrapper>
              <Scanner />
            </PageWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PageWrapper>
              <Leaderboard />
            </PageWrapper>
          }
        />
        <Route
          path="/admin"
          element={
            <PageWrapper>
              <Admin />
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Main App component
 */
function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-eco-bg text-eco-text">
            <Navbar />
            <main>
              <AnimatedRoutes />
            </main>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
