
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "@/lib/context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Index from "./pages/Index";
import Search from "./pages/Search";
import RideOffer from "./pages/RideOffer";
import RideRequest from "./pages/RideRequest";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import RideDetails from "./pages/RideDetails";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-[calc(100vh-4rem)]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(true); // Set to true by default to avoid blank screen

  useEffect(() => {
    // Initialize any required data in localStorage if not present
    try {
      if (!localStorage.getItem('userRideRequests')) {
        localStorage.setItem('userRideRequests', '[]');
      }
      
      if (!localStorage.getItem('userRideHistory')) {
        localStorage.setItem('userRideHistory', '[]');
      }
      
      if (!localStorage.getItem('userRideOffers')) {
        localStorage.setItem('userRideOffers', '[]');
      }
    } catch (error) {
      console.error('Error initializing localStorage:', error);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <ErrorBoundary fallback={<div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-4">We're having trouble loading this page. Please try refreshing.</p>
        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      </div>}>
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/offer" element={<RideOffer />} />
            <Route path="/request" element={<RideRequest />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/ride/:rideId" element={<RideDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </ErrorBoundary>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
