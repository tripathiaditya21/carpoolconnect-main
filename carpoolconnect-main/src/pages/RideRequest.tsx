
import { motion } from "framer-motion";
import MultiStepRideForm from "@/components/MultiStepRideForm";
import { Search, Users, Bell, Lightbulb, Info, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RideForm from "@/components/RideForm";

const RideRequest = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background gradient and animated circles similar to Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white pointer-events-none" />
      
      {/* Animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/4 h-96 w-96 rounded-full bg-blue-100/20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Request a <span className="text-primary">Ride</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let drivers know about your travel plans and find someone going your way
            </p>
          </motion.div>
        </div>
        
        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Find Your Ride</h3>
              <p className="text-muted-foreground">
                Share your travel needs and get matched with drivers going your way.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Travel Safely</h3>
              <p className="text-muted-foreground">
                Connect with verified drivers and travel with peace of mind.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Save Time & Money</h3>
              <p className="text-muted-foreground">
                Find affordable rides that match your schedule and budget.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <MultiStepRideForm type="request" />
              </motion.div>
            </CardContent>
          </Card>
          
          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-start">
              <Info className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-3">Tips for successful ride requests</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary text-sm font-medium">1</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Be precise with locations</h5>
                      <p className="text-xs text-muted-foreground">Provide exact pickup and dropoff points to help drivers find you easily.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary text-sm font-medium">2</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Request in advance</h5>
                      <p className="text-xs text-muted-foreground">Plan ahead and request rides at least 24 hours in advance when possible.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary text-sm font-medium">3</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Set reasonable budget</h5>
                      <p className="text-xs text-muted-foreground">Offer a fair price that's attractive to drivers while staying within your budget.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary text-sm font-medium">4</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Complete your profile</h5>
                      <p className="text-xs text-muted-foreground">Keep your profile updated with a photo and details so drivers can learn about you.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RideRequest;
