import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const ErrorPage = () => {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Something went wrong</h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              We're having trouble loading this page. Please try refreshing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/">
                  <Home className="h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => window.location.reload()}>
                <RefreshCw className="h-5 w-5" />
                Refresh Page
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
