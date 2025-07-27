import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Ride, BookingFormData } from "@/lib/types";
import { fetchRides, formatDate, formatTime, formatPrice, getAvatarUrl, calculateDistance, calculateDuration, bookRide, formatRating } from "@/lib/utils";
import { Loader2, Calendar, Clock, MapPin, Users, IndianRupee, Route, ShieldCheck, Car, ArrowLeft, Zap, Cigarette, PawPrint, MessageCircle, Wifi, Power, Flag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BookRideModal from "@/components/BookRideModal";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";

const RideDetails = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const loadRideDetails = async () => {
      try {
        setIsLoading(true);
        const rides = await fetchRides();
        const foundRide = rides.find(r => r.id === rideId);
        
        if (foundRide) {
          setRide(foundRide);
        } else {
          // If ride not found, navigate to not found page
          navigate("/not-found", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching ride details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRideDetails();
  }, [rideId, navigate]);

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book a ride");
      navigate("/auth");
      return;
    }
    
    setIsBookingModalOpen(true);
  };

  const handleBookRide = async (formData: BookingFormData) => {
    if (!user || !ride) return false;
    
    const success = await bookRide(ride.id, user.id, formData.seats);
    
    if (success) {
      setIsBookingModalOpen(false);
      toast.success("Ride booked successfully! It will appear in your profile.");
      setTimeout(() => {
        navigate("/search");
      }, 1500);
    }
    
    return success;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ride) {
    return null; // Will redirect to not found via useEffect
  }

  const distance = calculateDistance(ride.startLocation, ride.endLocation);
  const duration = calculateDuration(distance);
  
  // Calculate arrival time using the same logic as in RideCard
  const getArrivalTime = () => {
    // Extract hours and minutes from time string (e.g., "9:30 AM" -> "9:30")
    const departureTimeFormatted = ride.time.split(' ')[0];
    
    // Calculate arrival time (add 2-3 hours to departure time)
    const [hours, minutes] = departureTimeFormatted.split(':').map(Number);
    const departureDate = new Date();
    departureDate.setHours(hours, minutes, 0);
    
    // Add duration based on connections (more connections = longer journey)
    const connections = ride.connections || 0;
    const durationMinutes = 120 + (connections * 30) + Math.floor(Math.random() * 30);
    
    const arrivalDate = new Date(departureDate.getTime() + durationMinutes * 60000);
    return formatTime(`${arrivalDate.getHours().toString().padStart(2, '0')}:${arrivalDate.getMinutes().toString().padStart(2, '0')}`);
  };

  return (
    <div className="min-h-screen pt-16 pb-20 bg-[#f4f8fb]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with journey title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#054752] mb-1">
              {ride.startLocation.city} to {ride.endLocation.city}
            </h1>
            <p className="text-gray-500">
              {formatDate(ride.date)}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="lg:w-2/3">
              {/* Ride Details Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">

                {/* Journey line with locations */}
                <div className="p-5">
                  <div className="pl-6 pb-2">
                    {/* Start Location */}
                    <div className="relative pl-6 mb-10">
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="absolute left-[7px] top-6 bottom-[-30px] border-l border-dashed border-blue-200"></div>
                      <div className="text-[#054752] font-medium text-base">{formatTime(ride.time)}</div>
                      <div className="text-[#054752] font-medium text-lg">{ride.startLocation.city}</div>
                      <div className="text-[#5e6d77] text-sm mt-1">{ride.startLocation.address || '100 MG Road'}</div>
                      <div className="text-[#5e6d77] text-sm mt-1">Mumbai, Maharashtra</div>
                    </div>
                    
                    {/* End Location */}
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="text-[#054752] font-medium text-base">{getArrivalTime()}</div>
                      <div className="text-[#054752] font-medium text-lg">{ride.endLocation.city}</div>
                      <div className="text-[#5e6d77] text-sm mt-1">{ride.endLocation.address || '200 Bandra'}</div>
                      <div className="text-[#5e6d77] text-sm mt-1">Pune, Maharashtra</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="flex items-center p-4">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={getAvatarUrl(ride.driver)} alt={ride.driver.name} />
                    <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{ride.driver.name}</div>
                    <div className="flex items-center text-amber-500 text-sm">
                      ★ {(ride.driver.rating || 5.0).toFixed(1)} · {ride.driver.reviewCount || 3} ratings
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-0 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified Profile
                    </Badge>
                  </div>
                </div>

                {/* Car Info */}
                <div className="border-t border-gray-100 px-4 py-3">
                  <div className="text-sm font-medium">Very Comfortable {ride.carInfo?.make} {ride.carInfo?.model}</div>
                </div>

                {/* Amenities */}
                <div className="border-t border-gray-100 px-4 py-3">
                  {ride.amenities?.instantBooking && (
                    <div className="flex items-center text-sm py-1">
                      <Zap className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Your booking will be confirmed instantly</span>
                    </div>
                  )}
                  {ride.amenities?.smokingAllowed && (
                    <div className="flex items-center text-sm py-1">
                      <Cigarette className="h-4 w-4 mr-2 text-gray-500" />
                      <span>I'm fine with smoking</span>
                    </div>
                  )}
                  {ride.amenities?.maxTwoInBack && (
                    <div className="flex items-center text-sm py-1">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Max. 2 in the back</span>
                    </div>
                  )}
                  {ride.carInfo && (
                    <div className="flex items-center text-sm py-1">
                      <Car className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{ride.carInfo.make} {ride.carInfo.model}</span>
                    </div>
                  )}
                  {ride.amenities?.petsAllowed && (
                    <div className="flex items-center text-sm py-1">
                      <PawPrint className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Pets allowed</span>
                    </div>
                  )}
                  {ride.amenities?.wifi && (
                    <div className="flex items-center text-sm py-1">
                      <Wifi className="h-4 w-4 mr-2 text-gray-500" />
                      <span>WiFi available</span>
                    </div>
                  )}
                  {ride.amenities?.powerOutlets && (
                    <div className="flex items-center text-sm py-1">
                      <Power className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Power outlets</span>
                    </div>
                  )}
                </div>

                {/* Contact Button */}
                <div className="border-t border-gray-100 px-4 py-3">
                  <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact {ride.driver.name}
                  </Button>
                </div>
              </div>
              
              {/* Report Ride Button */}
              <div className="mt-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3">
                    <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                      <Flag className="h-4 w-4 mr-2" />
                      Report a ride
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="mt-0 lg:pl-4">
                {/* Journey Card with Timeline - Blue Dots Style */}
                <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <div className="text-[#054752] font-medium mb-4">
                    {formatDate(ride.date)}
                  </div>
                  
                  <div className="pl-6 pb-2">
                    {/* Start Location */}
                    <div className="relative pl-6 mb-10">
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="absolute left-[7px] top-6 bottom-[-30px] border-l border-dashed border-blue-200"></div>
                      <div className="text-[#054752] font-medium text-base">{formatTime(ride.time)}</div>
                      <div className="text-[#054752] font-medium text-lg">{ride.startLocation.city}</div>
                      <div className="text-[#5e6d77] text-sm mt-1">{ride.startLocation.address || '100 MG Road'}</div>
                      <div className="text-[#5e6d77] text-sm mt-1">Mumbai, Maharashtra</div>
                    </div>
                    
                    {/* End Location */}
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="text-[#054752] font-medium text-base">{getArrivalTime()}</div>
                      <div className="text-[#054752] font-medium text-lg">{ride.endLocation.city}</div>
                      <div className="text-[#5e6d77] text-sm mt-1">{ride.endLocation.address || '200 Bandra'}</div>
                      <div className="text-[#5e6d77] text-sm mt-1">Pune, Maharashtra</div>
                    </div>
                  </div>
                </div>
                
                {/* Driver Card - BlaBlaCar Style */}
                <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={getAvatarUrl(ride.driver)} alt={ride.driver.name} />
                        <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-[#054752] font-medium text-lg">{ride.driver.name}</div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{ride.driver.rating ? formatRating(ride.driver.rating) : '4.5'}</span>
                          <span className="text-gray-500 ml-1">- {ride.driver.reviewCount || 1} rating{(ride.driver.reviewCount || 1) > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-[#054752] font-medium mb-2">Very Comfortable {ride.carInfo?.make || 'Maruti'} {ride.carInfo?.model || 'Suzuki Swift'}</div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Zap className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm">Your booking will be confirmed instantly</span>
                        </div>
                        
                        {ride.amenities?.smokingAllowed ? (
                          <div className="flex items-center text-gray-600">
                            <Cigarette className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">I'm fine with smoking</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-600">
                            <Cigarette className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">No smoking, please</span>
                          </div>
                        )}
                        
                        {ride.amenities?.petsAllowed ? (
                          <div className="flex items-center text-gray-600">
                            <PawPrint className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">Pets are welcome</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-600">
                            <PawPrint className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">I'd prefer not to travel with pets</span>
                          </div>
                        )}
                        
                        {ride.amenities?.maxTwoInBack && (
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">Max. 2 in the back</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Passenger and Price Card - BlaBlaCar Style */}
                <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm font-medium">1 passenger</div>
                      <div className="text-2xl font-bold text-[#054752]">{formatPrice(ride.price)}</div>
                    </div>
                    
                    {/* Book Button */}
                    <Button 
                      className="w-full bg-[#00AFF5] hover:bg-[#008FC7] text-white py-3 rounded-lg shadow-sm text-base font-medium flex items-center justify-center" 
                      onClick={handleOpenBooking}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookRideModal
        ride={ride}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBook={handleBookRide}
      />
    </div>
  );
};

export default RideDetails;
