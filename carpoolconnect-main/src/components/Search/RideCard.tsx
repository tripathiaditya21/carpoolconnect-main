import { Ride } from "@/lib/types";
import { formatDate, formatTime, formatPrice, getAvatarUrl, formatRating } from "@/lib/utils";
import { Calendar, Clock, MapPin, User, Car, ArrowRight, Star, Bus, Zap, Heart, Shield, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { format, addMinutes } from 'date-fns';

interface RideCardProps {
  ride: Ride;
  featured?: boolean;
}

const RideCard = ({ ride, featured = false }: RideCardProps) => {
  const { driver, startLocation, endLocation, date, time, availableSeats, price, carInfo, amenities, connections = 0, driverDetails } = ride;
  const navigate = useNavigate();
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { 
      y: -5,
      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
      scale: 1.01,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Open in new tab instead of navigating
    window.open(`/ride/${ride.id}`, '_blank', 'noopener,noreferrer');
    e.preventDefault();
  };
  
  // Extract hours and minutes from time string (e.g., "9:30 AM" -> "9:30")
  const departureTimeFormatted = time.split(' ')[0];
  
  // Calculate arrival time (add 2-3 hours to departure time)
  const [hours, minutes] = departureTimeFormatted.split(':').map(Number);
  const departureDate = new Date();
  departureDate.setHours(hours, minutes, 0);
  
  // Add duration based on connections (more connections = longer journey)
  const durationMinutes = 120 + (connections * 30) + Math.floor(Math.random() * 30);
  const arrivalDate = addMinutes(departureDate, durationMinutes);
  const arrivalTimeFormatted = format(arrivalDate, 'HH:mm');
  
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onClick={(e) => handleCardClick(e)}
      className="border-b border-gray-200 py-4 cursor-pointer hover:bg-gray-50 hover:border hover:border-blue-400 hover:rounded-lg transition-all will-change-transform"
    >
      <div className="px-4">
        <div className="flex justify-between">
          {/* Left side - Journey details */}
          <div className="flex-1 pr-4">
            {/* Time and journey line */}
            <div className="flex items-center">
              {/* Departure time */}
              <div className="text-[#054752] font-medium text-sm mr-1">{departureTimeFormatted}</div>
              
              {/* Left circle */}
              <div className="w-2.5 h-2.5 rounded-full border border-[#054752] bg-white relative z-10"></div>
              
              {/* Line with duration */}
              <div className="relative mx-1 flex-grow" style={{ maxWidth: '130px' }}>
                {/* Line */}
                <div className="h-0.5 bg-[#054752] w-full"></div>
                
                {/* Duration */}
                <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 text-[10px] text-[#5e6d72] bg-white px-1">
                  {Math.floor(durationMinutes / 60)}h{durationMinutes % 60 > 0 ? durationMinutes % 60 : ''}
                </div>
              </div>
              
              {/* Right circle */}
              <div className="w-2.5 h-2.5 rounded-full border border-[#054752] bg-white relative z-10"></div>
              
              {/* Arrival time */}
              <div className="text-[#054752] font-medium text-sm ml-1">{arrivalTimeFormatted}</div>
            </div>
            
            {/* Cities and stations */}
            <div className="flex justify-between mt-1 px-2" style={{ maxWidth: '220px' }}>
              <div>
                <div className="text-[#054752] font-medium text-sm">{startLocation.city}</div>
                <div className="text-[10px] text-gray-500 truncate max-w-[80px]">{startLocation.address}</div>
              </div>
              
              <div className="text-right">
                <div className="text-[#054752] font-medium text-sm">{endLocation.city}</div>
                <div className="text-[10px] text-gray-500 truncate max-w-[80px]">{endLocation.address}</div>
              </div>
            </div>
            
            {/* Bus info and connections */}
            <div className="flex items-center mt-2 space-x-2">
              <Bus className="h-4 w-4 text-gray-600" />
              <span className="text-[#F44336] bg-[#FFEBEE] rounded-full px-2 py-0.5 text-[10px] font-medium">national express</span>
              <span className="text-gray-600 text-[10px]">
                {connections === 0 ? 'Direct' : 
                 connections === 1 ? '1 connection' : 
                 `${connections} connections`}
              </span>
            </div>
            
            {/* Driver info row - Part of the ride details, styled like BlaBlaCar */}
            <div className="flex items-center mt-3 pt-3 border-t border-[#054752]">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={getAvatarUrl(driver)} alt={driver.name} />
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-[#054752] font-medium text-sm">{driver.name}</div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-0.5" />
                    <span className="text-xs font-medium">{driver.rating ? formatRating(driver.rating) : '4.5'}</span>
                    <span className="text-xs text-gray-500 ml-1">- {driver.reviewCount || 1} rating{(driver.reviewCount || 1) > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Price */}
          <div className="flex flex-col justify-center items-end">
            <div className="text-xl font-bold text-[#054752]">{formatPrice(price)}</div>
            <div className="text-xs text-gray-500">1 passenger</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

};

export default RideCard;
