import { motion } from "framer-motion";
import MultiStepRideForm from "@/components/MultiStepRideForm";
import { Car, Lightbulb, CreditCard, Users, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RideOffer = () => {
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
              Offer a <span className="text-primary">Ride</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Offer your empty seats to travelers going your way and split the cost of your journey
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
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Earn Money</h3>
              <p className="text-muted-foreground">
                Set your own prices and offset your travel costs by sharing your ride.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Meet New People</h3>
              <p className="text-muted-foreground">
                Connect with like-minded travelers and make your journey more enjoyable.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Help the Environment</h3>
              <p className="text-muted-foreground">
                Reduce carbon emissions by sharing your vehicle with others going the same way.
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
                <MultiStepRideForm type="offer" />
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
                <h4 className="font-medium mb-3">Tips for successful ride offers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary text-sm font-medium">1</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Be precise with locations</h5>
                      <p className="text-xs text-muted-foreground">Provide exact pickup and dropoff points to help passengers find you easily.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary text-sm font-medium">2</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Set fair prices</h5>
                      <p className="text-xs text-muted-foreground">Competitive pricing helps you find passengers faster and fill your empty seats.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary text-sm font-medium">3</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Be punctual</h5>
                      <p className="text-xs text-muted-foreground">Arrive on time and communicate any delays to maintain a high rating.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-primary text-sm font-medium">4</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Keep information updated</h5>
                      <p className="text-xs text-muted-foreground">Regularly update your profile and vehicle details for better passenger trust.</p>
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

export default RideOffer;
