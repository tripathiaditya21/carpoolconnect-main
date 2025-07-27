import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Ride } from "@/lib/types";
import { getDriverDetails, fetchRides, formatRating, getAvatarUrl } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Shield, Check, Calendar, MapPin, Clock, Car, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const DriverProfile = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const [driver, setDriver] = useState<User | null>(null);
  const [driverRides, setDriverRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const loadDriverDetails = async () => {
      if (!driverId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch driver details
        const driverData = await getDriverDetails(driverId);
        if (driverData) {
          setDriver(driverData);
        }
        
        // Fetch rides offered by this driver
        const allRides = await fetchRides();
        const driverRides = allRides.filter(ride => ride.driver.id === driverId);
        setDriverRides(driverRides);
      } catch (error) {
        console.error("Error fetching driver details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDriverDetails();
  }, [driverId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Driver not found</h2>
          <p className="mt-2 text-gray-600">The driver profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 bg-[#f4f8fb]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Driver Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
          >
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            
            {/* Profile Info */}
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col items-center sm:items-start sm:flex-row">
                {/* Avatar */}
                <div className="-mt-12 relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage src={getAvatarUrl(driver)} alt={driver.name} />
                    <AvatarFallback className="text-2xl">{driver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {driver.verifiedDriver && (
                    <Badge className="absolute bottom-0 right-0 bg-blue-500 text-white border-2 border-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </Badge>
                  )}
                </div>
                
                {/* Name and Details */}
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start">
                    <h1 className="text-2xl font-bold text-[#054752]">{driver.name}</h1>
                    {driver.verifiedDriver && (
                      <Badge variant="outline" className="ml-2 border-blue-400">
                        <Check className="h-3 w-3 text-blue-500 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-1 justify-center sm:justify-start">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">
                      {driver.rating ? formatRating(driver.rating) : '4.8'}
                    </span>
                    {driver.reviewCount && (
                      <span className="text-gray-500 ml-1">({driver.reviewCount} reviews)</span>
                    )}
                  </div>
                  
                  <div className="mt-2 text-gray-600">
                    <p>Member since {driver.createdAt ? new Date(driver.createdAt).getFullYear() : '2022'}</p>
                  </div>
                </div>
              </div>
              
              {/* Driver Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Rides</p>
                  <p className="text-xl font-bold text-[#054752]">{driverRides.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="text-xl font-bold text-[#054752] flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    {driver.rating ? formatRating(driver.rating) : '4.8'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Response Rate</p>
                  <p className="text-xl font-bold text-[#054752]">98%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Response Time</p>
                  <p className="text-xl font-bold text-[#054752]">~1h</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 p-6"
          >
            <h2 className="text-xl font-bold text-[#054752] mb-4">About {driver.name}</h2>
            <p className="text-gray-600">
              Hi there! I'm {driver.name.split(' ')[0]}, a friendly and reliable driver. 
              I enjoy meeting new people and making journeys comfortable and enjoyable. 
              I'm punctual and prioritize safety above all else. Looking forward to sharing a ride with you!
            </p>
            
            {driver.verifiedDriver && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-[#054752]">Verified Driver</span>
                </div>
                <p className="text-gray-600 mt-1 ml-7">
                  This driver has completed our verification process, including identity and document verification.
                </p>
              </div>
            )}
          </motion.div>
          
          {/* Rides Offered */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden p-6"
          >
            <h2 className="text-xl font-bold text-[#054752] mb-4">Rides by {driver.name}</h2>
            
            {driverRides.length > 0 ? (
              <div className="space-y-4">
                {driverRides.map((ride) => (
                  <div key={ride.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-[#054752] font-medium">{new Date(ride.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        
                        <div className="mt-2 flex">
                          <div className="flex flex-col items-center mr-3">
                            <div className="w-2.5 h-2.5 rounded-full border border-[#054752] bg-white"></div>
                            <div className="h-10 w-0.5 bg-gray-200 my-1"></div>
                            <div className="w-2.5 h-2.5 rounded-full border border-[#054752] bg-white"></div>
                          </div>
                          
                          <div>
                            <div>
                              <p className="text-[#054752] font-medium">{ride.startLocation.city}</p>
                              <p className="text-xs text-gray-500">{ride.time}</p>
                            </div>
                            <div className="mt-4">
                              <p className="text-[#054752] font-medium">{ride.endLocation.city}</p>
                              <p className="text-xs text-gray-500">Arrival time</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#054752]">
                          ₹{ride.price}
                        </p>
                        <p className="text-xs text-gray-500">per passenger</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          {ride.carInfo?.make} {ride.carInfo?.model}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                          View details
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Car className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No rides available at the moment</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
