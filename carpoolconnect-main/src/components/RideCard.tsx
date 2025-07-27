
import { Link } from "react-router-dom";
import { Ride } from "@/lib/types";
import { formatDate, formatTime, formatPrice, getAvatarUrl, formatRating } from "@/lib/utils";
import { Calendar, Clock, MapPin, User, Car, ArrowRight, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface RideCardProps {
  ride: Ride;
  featured?: boolean;
}

const RideCard = ({ ride, featured = false }: RideCardProps) => {
  const { driver, startLocation, endLocation, date, time, availableSeats, price, carInfo } = ride;
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { 
      y: -5,
      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`glass-card rounded-xl overflow-hidden ${
        featured ? "border-primary/30" : "border-transparent"
      }`}
    >
      <div className="p-6">
        {/* Origin and Destination */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">{startLocation.city} to {endLocation.city}</h3>
          <p className="text-sm text-muted-foreground">{formatDate(date)} at {formatTime(time)}</p>
        </div>

        {/* Date, Time and Price */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              Date
            </div>
            <p className="font-medium">{formatDate(date)}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Clock className="h-3 w-3 mr-1" />
              Time
            </div>
            <p className="font-medium">{formatTime(time)}</p>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <User className="h-3 w-3 mr-1" />
              Seats
            </div>
            <p className="font-medium">{availableSeats} available</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4"></div>

        {/* Driver Info and Car */}
        <div className="flex justify-between items-center">
          <Link to={`/profile/${driver.id}`} className="flex items-center space-x-3 group hover:opacity-90 transition-opacity">
            <Avatar className="h-10 w-10 border border-border group-hover:border-primary/50">
              <AvatarImage src={getAvatarUrl(driver)} alt={driver.name} />
              <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <p className="font-medium group-hover:text-primary transition-colors">{driver.name}</p>
                {driver.verifiedDriver && (
                  <Badge variant="outline" className="ml-2 text-xs bg-green-100 text-green-800 border-green-200">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-amber-500">
                <Star className="h-3 w-3 fill-amber-500 mr-1" />
                <span className="text-sm">{formatRating(driver.rating || 5.0)}</span>
                {driver.reviewCount && (
                  <span className="text-xs text-muted-foreground ml-1">({driver.reviewCount} reviews)</span>
                )}
              </div>
            </div>
          </Link>
          <div className="text-right">
            <p className="text-xl font-semibold text-primary">{formatPrice(price)}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Car className="h-3 w-3 mr-1" />
              <span>{carInfo?.make} {carInfo?.model}</span>
            </div>
          </div>
        </div>

        {/* Book Button */}
        <div className="mt-4">
          <Button className="w-full" asChild>
            <Link to={`/ride/${ride.id}`}>
              Book this ride <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RideCard;
