import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Car, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ClipboardCheck, 
  CreditCard, 
  Info, 
  Luggage, 
  MapPin, 
  Shield, 
  User, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

export type RideFormType = "offer" | "request";

interface MultiStepRideFormProps {
  type: RideFormType;
}

const MultiStepRideForm = ({ type }: MultiStepRideFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Form state
  const [startLocation, setStartLocation] = useState("");
  const [startCity, setStartCity] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [endCity, setEndCity] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("Additional details about my ride"); // Set a default value
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carColor, setCarColor] = useState("");
  const [luggageSize, setLuggageSize] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Preferences
  const [allowSmoking, setAllowSmoking] = useState(false);
  const [allowPets, setAllowPets] = useState(false);
  const [maxTwoInBack, setMaxTwoInBack] = useState(false);
  const [instantBooking, setInstantBooking] = useState(false);
  const [maxLuggageSize, setMaxLuggageSize] = useState("medium");
  const [musicPreference, setMusicPreference] = useState("any");
  const [chatPreference, setChatPreference] = useState("friendly");

  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const nextStep = () => {
    // Validate current step
    if (currentStep === 1 && (!startLocation || !startCity || !endLocation || !endCity)) {
      toast({
        title: "Missing information",
        description: "Please fill out all location fields",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 2 && (!date || !time)) {
      toast({
        title: "Missing information",
        description: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 3) {
      if (type === "offer" && (!seats || !price)) {
        toast({
          title: "Missing information",
          description: "Please specify seats and price",
          variant: "destructive",
        });
        return;
      } else if (type === "request" && !seats) {
        toast({
          title: "Missing information",
          description: "Please specify how many seats you need",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep === 4) {
      if (type === "offer" && (!carMake || !carModel || !carYear || !carColor)) {
        toast({
          title: "Missing information",
          description: "Please fill out all vehicle information",
          variant: "destructive",
        });
        return;
      }
      // For request type, preferences are optional
    }
    
    // Debug log before moving to review step
    if (currentStep === 4) {
      console.log('Moving to review with all info:', { 
        carMake, carModel, carYear, carColor,
        description, // Log description value
        type
      });
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a ride",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a unique ID for the ride
      const rideId = `ride-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create ride object
      const rideData = {
        id: rideId,
        type,
        startLocation: {
          address: startLocation,
          city: startCity,
          coordinates: { lat: 0, lng: 0 } // Would be set by geocoding in a real app
        },
        endLocation: {
          address: endLocation,
          city: endCity,
          coordinates: { lat: 0, lng: 0 } // Would be set by geocoding in a real app
        },
        date: date ? format(date, "yyyy-MM-dd") : "",
        time,
        seats: parseInt(seats),
        price: type === "offer" ? parseFloat(price) : undefined,
        description,
        driver: type === "offer" ? {
          id: user?.id || "user-1",
          name: user?.name || "John Doe",
          rating: user?.rating || 4.8,
          reviewCount: user?.reviewCount || 42,
          avatar: user?.avatar || "",
          verifiedDriver: true
        } : undefined,
        carInfo: type === "offer" ? {
          make: carMake,
          model: carModel,
          year: carYear,
          color: carColor
        } : undefined,
        preferences: {
          smoking: allowSmoking,
          pets: allowPets,
          maxTwoInBack,
          instantBooking,
          luggageSize: maxLuggageSize,
          music: musicPreference,
          chatLevel: chatPreference
        },
        status: "active",
        availableSeats: parseInt(seats),
        createdAt: new Date().toISOString()
      };
      
      console.log("Submitted ride:", rideData);
      
      // Store the ride data in localStorage
      try {
        if (type === "request") {
          // For ride requests, use the storeUserRideRequest function
          const { storeUserRideRequest } = await import("@/lib/utils");
          storeUserRideRequest(rideId, user?.id || "user-1", parseInt(seats));
        } else {
          // For ride offers, store in userRideOffers
          const existingOffersJSON = localStorage.getItem('userRideOffers') || '[]';
          const existingOffers = JSON.parse(existingOffersJSON);
          existingOffers.push(rideData);
          localStorage.setItem('userRideOffers', JSON.stringify(existingOffers));
        }
      } catch (storageError) {
        console.error("Error storing ride data:", storageError);
        // Continue anyway for demo purposes
      }
      // Simulate API call
      console.log('Simulating API call...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: `${type === "offer" ? "Ride offered" : "Ride requested"} successfully!`,
        description: `Your ${type === "offer" ? "ride offer" : "request"} has been posted and is now visible in Find Rides.`,
      });
      console.log('Showed success toast');
      
      // Reset form state
      setStartLocation('');
      setStartCity('');
      setEndLocation('');
      setEndCity('');
      setDate(undefined);
      setTime('');
      setSeats('');
      setPrice('');
      setDescription('');
      setCarMake('');
      setCarModel('');
      setCarYear('');
      setCarColor('');
      setCurrentStep(1);
      console.log('Reset form state');
      
      // Show success message and then navigate to home page
      console.log('Form submitted successfully');
      
      // Wait for the success message to be visible
      setTimeout(() => {
        // Navigate to the home page instead
        console.log('Navigating to home page');
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log('Set isSubmitting back to false');
    }
  };
  
  // Function to handle step navigation
  const goToStep = (step: number) => {
    // Validate current step before allowing navigation to later steps
    if (step > currentStep) {
      // Check if we can move forward (simple validation)
      if (currentStep === 1 && (!startLocation || !startCity || !endLocation || !endCity)) {
        toast({
          title: "Missing information",
          description: "Please fill out all location fields before proceeding",
          variant: "destructive",
        });
        return;
      }
      
      if (currentStep === 2 && (!date || !time)) {
        toast({
          title: "Missing information",
          description: "Please select a date and time before proceeding",
          variant: "destructive",
        });
        return;
      }
      
      if (currentStep === 3 && (!seats || !price)) {
        toast({
          title: "Missing information",
          description: "Please specify seats and price before proceeding",
          variant: "destructive",
        });
        return;
      }
    }
    
    // If validation passes or going to a previous step, update the current step
    setCurrentStep(step);
  };
  
  // Step indicator component
  const StepIndicator = () => {
    return (
      <div className="mb-8 select-none">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <button 
              key={step} 
              onClick={() => goToStep(step)}
              className="flex flex-col items-center bg-transparent border-none cursor-pointer focus:outline-none focus:ring-0 group"
              aria-label={`Go to step ${step}`}
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 transform",
                  step < currentStep 
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md group-hover:shadow-lg group-hover:from-green-600 group-hover:to-green-700 group-hover:-translate-y-1" 
                    : step === currentStep 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-2 ring-blue-100 shadow-md group-hover:shadow-lg group-hover:from-blue-600 group-hover:to-blue-700 group-hover:-translate-y-1" 
                      : "bg-white border-2 border-gray-300 text-gray-500 group-hover:border-blue-300 group-hover:text-blue-500 group-hover:-translate-y-1 group-hover:shadow-sm"
                )}
              >
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              <span 
                className={cn(
                  "text-sm mt-2 font-medium transition-colors duration-200",
                  step < currentStep ? "text-green-600" : 
                  step === currentStep ? "text-blue-700" : "text-gray-500 group-hover:text-blue-600"
                )}
              >
                {step === 1 ? "Route" : 
                 step === 2 ? "Date & Time" : 
                 step === 3 ? "Details" : 
                 step === 4 ? "Vehicle" :
                 "Review"}
              </span>
            </button>
          ))}
        </div>
        
        <div className="relative mt-6">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full shadow-inner" />
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-in-out shadow-sm" 
            style={{ width: `${(currentStep - 1) / (totalSteps - 1) * 100}%` }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <StepIndicator />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Step 1: Route */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg flex items-start mb-6">
                  <Info className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {type === "offer" 
                      ? "Enter the exact pickup and dropoff locations to help passengers find your meeting points easily." 
                      : "Enter the exact pickup and dropoff locations to help drivers find you easily."}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium text-gray-800">Pickup Location</h3>
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="startCity" className="text-sm text-gray-600">City</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="startCity"
                            placeholder="Enter city"
                            value={startCity}
                            onChange={(e) => setStartCity(e.target.value)}
                            className="pl-10 h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startLocation" className="text-sm text-gray-600">Exact Address</Label>
                        <Input
                          id="startLocation"
                          placeholder="Enter pickup address"
                          value={startLocation}
                          onChange={(e) => setStartLocation(e.target.value)}
                          className="h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2 border-t border-gray-100"></div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-medium text-gray-800">Dropoff Location</h3>
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="endCity" className="text-sm text-gray-600">City</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="endCity"
                            placeholder="Enter city"
                            value={endCity}
                            onChange={(e) => setEndCity(e.target.value)}
                            className="pl-10 h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endLocation" className="text-sm text-gray-600">Exact Address</Label>
                        <Input
                          id="endLocation"
                          placeholder="Enter dropoff address"
                          value={endLocation}
                          onChange={(e) => setEndLocation(e.target.value)}
                          className="h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg flex items-start mb-6">
                  <Info className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {type === "offer" 
                      ? "Choose the date and time of your departure. Being punctual helps maintain a good rating." 
                      : "Choose the date and time of your desired trip. Being flexible with timing may help find more ride options."}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-primary" /> 
                      Departure Date
                    </h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => {
                            // Allow today and future dates, disable past dates
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const compareDate = new Date(date);
                            compareDate.setHours(0, 0, 0, 0);
                            return compareDate < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" /> 
                      Departure Time
                    </h3>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start mb-6">
                  <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    {type === "offer" 
                      ? "Specify how many passengers you can take and set a fair price per seat." 
                      : "Specify how many seats you need and your budget for the ride."}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium flex items-center text-gray-800">
                      <Users className="h-4 w-4 mr-2 text-blue-500" /> 
                      {type === "offer" ? "Available Seats" : "Seats Needed"}
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setSeats(num.toString())}
                          className={cn(
                            "h-10 border rounded-full flex items-center justify-center font-medium transition-colors",
                            seats === num.toString()
                              ? "bg-blue-500 text-white border-blue-500"
                              : "border-gray-300 hover:border-blue-400 text-gray-700"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {type === "offer" ? (
                    <div className="space-y-2">
                      <h3 className="text-base font-medium flex items-center text-gray-800">
                        <CreditCard className="h-4 w-4 mr-2 text-blue-500" /> 
                        Price per Seat
                      </h3>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="1"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="pl-10 h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                        />
                      </div>
                      <p className="text-sm text-gray-500 ml-1">
                        Recommended price: ₹500-1500. Setting a competitive price helps fill your seats faster.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-base font-medium flex items-center text-gray-800">
                        <CreditCard className="h-4 w-4 mr-2 text-blue-500" /> 
                        Your Budget
                      </h3>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="1"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="pl-10 h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                      <p className="text-sm text-gray-500 ml-1">
                        Optional: Set your maximum budget per seat to help find rides within your price range.
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-medium flex items-center text-gray-800">
                      <Luggage className="h-4 w-4 mr-2 text-blue-500" /> 
                      {type === "offer" ? "Luggage Size" : "Your Luggage Size"}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "small", label: "Small" },
                        { value: "medium", label: "Medium" },
                        { value: "large", label: "Large" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setMaxLuggageSize(option.value)}
                          className={cn(
                            "h-10 border rounded-full flex items-center justify-center font-medium transition-colors",
                            maxLuggageSize === option.value
                              ? "bg-blue-500 text-white border-blue-500"
                              : "border-gray-300 hover:border-blue-400 text-gray-700"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm text-gray-600">Additional Information</Label>
                    <Textarea
                      id="description"
                      placeholder={type === "offer" 
                        ? "Enter any additional information or details about the ride" 
                        : "Share any special requirements or details about your trip"}
                      value={description}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        console.log('Description changed:', newValue);
                        setDescription(newValue);
                        // Force a re-render by using setTimeout
                        setTimeout(() => {
                          console.log('Description after update:', description);
                        }, 0);
                      }}
                      rows={3}
                      className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Vehicle or Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg flex items-start mb-6">
                  <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    {type === "offer" 
                      ? "Provide details about your vehicle to help passengers identify it easily." 
                      : "Let drivers know about your preferences to find the most comfortable ride."}
                  </p>
                </div>
                
                {type === "offer" ? (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-base font-medium flex items-center text-gray-800">
                        <Car className="h-4 w-4 mr-2 text-blue-500" /> 
                        Vehicle Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="carMake" className="text-sm text-gray-600">Car Make</Label>
                          <Input
                            id="carMake"
                            placeholder="e.g., Toyota"
                            value={carMake}
                            onChange={(e) => setCarMake(e.target.value)}
                            className="h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carModel" className="text-sm text-gray-600">Car Model</Label>
                          <Input
                            id="carModel"
                            placeholder="e.g., Prius"
                            value={carModel}
                            onChange={(e) => setCarModel(e.target.value)}
                            className="h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="carYear" className="text-sm text-gray-600">Year</Label>
                          <Input
                            id="carYear"
                            type="number"
                            min="1990"
                            max={new Date().getFullYear()}
                            placeholder="e.g., 2020"
                            value={carYear}
                            onChange={(e) => setCarYear(e.target.value)}
                            className="h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carColor" className="text-sm text-gray-600">Color</Label>
                          <Input
                            id="carColor"
                            placeholder="e.g., Silver"
                            value={carColor}
                            onChange={(e) => setCarColor(e.target.value)}
                            className="h-12 rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-base font-medium flex items-center text-gray-800">
                        <Shield className="h-4 w-4 mr-2 text-blue-500" /> 
                        Amenities & Comfort
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="maxTwoInBack"
                            checked={maxTwoInBack}
                            onChange={(e) => setMaxTwoInBack(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <Label htmlFor="maxTwoInBack" className="text-sm text-gray-700">Max. 2 in the back</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="instantBooking"
                            checked={instantBooking}
                            onChange={(e) => setInstantBooking(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <Label htmlFor="instantBooking" className="text-sm text-gray-700">Instant Booking</Label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="chatPreference" className="text-sm text-gray-600">Chat Preference</Label>
                          <select
                            id="chatPreference"
                            value={chatPreference}
                            onChange={(e) => setChatPreference(e.target.value)}
                            className="w-full h-10 rounded-full border-gray-300 px-4 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          >
                            <option value="quiet">I prefer quiet</option>
                            <option value="friendly">I'm friendly</option>
                            <option value="chatty">I'm chatty</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="musicPreference" className="text-sm text-gray-600">Music Preference</Label>
                          <select
                            id="musicPreference"
                            value={musicPreference}
                            onChange={(e) => setMusicPreference(e.target.value)}
                            className="w-full h-10 rounded-full border-gray-300 px-4 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          >
                            <option value="none">No music</option>
                            <option value="any">Any music</option>
                            <option value="driver">Driver's choice</option>
                            <option value="passenger">Passenger's choice</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h3 className="text-base font-medium flex items-center text-gray-800">
                        <Users className="h-4 w-4 mr-2 text-blue-500" /> 
                        Ride Environment
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="allowSmoking"
                            checked={allowSmoking}
                            onChange={(e) => setAllowSmoking(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <Label htmlFor="allowSmoking" className="text-sm text-gray-700">Smoking allowed</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="allowPets"
                            checked={allowPets}
                            onChange={(e) => setAllowPets(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <Label htmlFor="allowPets" className="text-sm text-gray-700">Pets allowed</Label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="airConditioning"
                            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <Label htmlFor="airConditioning" className="text-sm text-gray-700">Air conditioning</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            id="powerOutlets"
                            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <Label htmlFor="powerOutlets" className="text-sm text-gray-700">Power outlets</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {type === "offer" && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-base font-medium text-gray-800">Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="allowSmoking"
                          checked={allowSmoking}
                          onChange={(e) => setAllowSmoking(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <Label htmlFor="allowSmoking" className="text-sm text-gray-600">Allow smoking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="allowPets"
                          checked={allowPets}
                          onChange={(e) => setAllowPets(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <Label htmlFor="allowPets" className="text-sm text-gray-600">Allow pets</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chatPreference" className="text-sm text-gray-600">Chat Preference</Label>
                      <select
                        id="chatPreference"
                        value={chatPreference}
                        onChange={(e) => setChatPreference(e.target.value)}
                        className="w-full h-10 rounded-full border-gray-300 px-4 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      >
                        <option value="quiet">I prefer quiet</option>
                        <option value="friendly">I'm friendly</option>
                        <option value="chatty">I'm chatty</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="musicPreference" className="text-sm text-gray-600">Music Preference</Label>
                      <select
                        id="musicPreference"
                        value={musicPreference}
                        onChange={(e) => setMusicPreference(e.target.value)}
                        className="w-full h-10 rounded-full border-gray-300 px-4 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      >
                        <option value="none">No music</option>
                        <option value="any">Any music</option>
                        <option value="driver">Driver's choice</option>
                        <option value="passenger">Passenger's choice</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 5: Review */}
            {currentStep === 5 && (
              console.log('Review section rendering with description:', description),
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 p-2 rounded-md shadow-sm mr-3">
                    <ClipboardCheck className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Review & Confirm</h2>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex items-center">
                        <div className="w-32 text-gray-600">Pickup Location</div>
                        <div className="font-medium text-gray-800">{startCity || 'Not set'}</div>
                      </div>
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex items-center">
                        <div className="w-32 text-gray-600">Dropoff Location</div>
                        <div className="font-medium text-gray-800">{endCity || 'Not set'}</div>
                      </div>
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex items-center">
                        <div className="w-32 text-gray-600">Date</div>
                        <div className="font-medium text-gray-800">
                          {date ? format(new Date(date), 'yyyy-MM-dd') : 'Not set'}
                        </div>
                      </div>
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex items-center">
                        <div className="w-32 text-gray-600">Time</div>
                        <div className="font-medium text-gray-800">{time || 'Not set'}</div>
                      </div>
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex items-center">
                        <div className="w-32 text-gray-600">Price</div>
                        <div className="font-medium text-gray-800">
                          ${price || '0'}
                        </div>
                      </div>
                      <button 
                        onClick={() => setCurrentStep(4)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex items-center">
                        <div className="w-32 text-gray-600">
                          {type === "offer" ? "Available Seats" : "Seats Needed"}
                        </div>
                        <div className="font-medium text-gray-800">{seats || '0'}</div>
                      </div>
                      <button 
                        onClick={() => setCurrentStep(4)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                      <div className="flex items-center">
                        <div className="w-32 text-gray-600">Additional Info</div>
                        <div className="font-medium text-gray-800 max-w-md">
                          {description}
                        </div>
                      </div>
                      <button 
                        onClick={() => setCurrentStep(4)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                    </div>
                    
                    {/* Vehicle Information Section - Always show for Ride Offers */}
                    {type === "offer" && (
                      <>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                          <div className="flex items-center">
                            <div className="w-32 text-gray-600">Vehicle</div>
                            <div className="font-medium text-gray-800">
                              {carMake || carModel || carYear ? 
                                [carYear, carMake, carModel].filter(Boolean).join(' ') : 
                                'Not specified'}
                            </div>
                          </div>
                          <button 
                            onClick={() => setCurrentStep(4)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-32 text-gray-600">Car Color</div>
                            <div className="font-medium text-gray-800">{carColor || 'Not specified'}</div>
                          </div>
                          <button 
                            onClick={() => setCurrentStep(4)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button 
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded border border-gray-300 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  
                  <Button 
                    type="submit" 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-8 rounded disabled:opacity-70"
                  >
                    {isSubmitting ? "Processing..." : type === "offer" ? "Publish Ride Offer" : "Submit Request"}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            {currentStep !== 5 && (
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`${currentStep === 1 ? 'invisible' : ''} bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow flex items-center`}
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow flex items-center"
                >
                  {currentStep === 4 ? 'Review' : 'Continue'}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MultiStepRideForm;
