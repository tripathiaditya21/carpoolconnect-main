import React, { useState, useEffect } from "react";
import SearchForm from "@/components/SearchForm";
import { fetchRides } from "@/lib/utils";
import { Ride } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Filter, RefreshCw, Calendar, FileText, Check, Wifi, Power, Cigarette, PawPrint, Bus, AirVent, Clock, ShieldCheck, Accessibility, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import RideDetailsModal from "@/components/RideDetailsModal";
import RideCard from "@/components/Search/RideCard";

const Search = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState({
    from: "",
    to: "",
    date: undefined as Date | undefined,
    seats: "1"
  });
  const [sortOption, setSortOption] = useState("price-asc");
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    maxTwoInBack: false,
    instantBooking: false,
    smokingAllowed: false,
    petsAllowed: false,
    powerOutlets: false,
    wifi: false,
    toilets: false,
    airConditioning: false,
    accessible: false,
    verifiedProfile: false,
    directOnly: false,
    maxOneChange: false
  });
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  useEffect(() => {
    const loadRides = async () => {
      try {
        setIsLoading(true);
        const fetchedRides = await fetchRides();
        setRides(fetchedRides);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRides();
  }, []);

  const handleSearch = (criteria: {
    from: string;
    to: string;
    date: Date | undefined;
    seats: string;
  }) => {
    setIsLoading(true);
    setSearchCriteria(criteria);
    setHasSearched(true);
    
    // Reload rides when searching to ensure we have fresh data
    const searchRides = async () => {
      try {
        const fetchedRides = await fetchRides();
        setRides(fetchedRides);
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchRides();
  };

  const handleSort = (value: string) => {
    setSortOption(value);
    
    const sortedRides = [...rides];
    switch (value) {
      case "price-asc":
        sortedRides.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedRides.sort((a, b) => b.price - a.price);
        break;
      case "date-asc":
        sortedRides.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "date-desc":
        sortedRides.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "seats-desc":
        sortedRides.sort((a, b) => b.availableSeats - a.availableSeats);
        break;
      default:
        break;
    }
    
    setRides(sortedRides);
  };

  const handleFilterChange = (filterName: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: checked
    }));
  };

  const filteredRides = rides.filter(ride => {
    // Search criteria filters - only apply if hasSearched is true
    let fromMatch = true;
    let toMatch = true;
    let dateMatch = true;
    let seatsMatch = true;
    
    if (hasSearched) {
      fromMatch = searchCriteria.from 
        ? ride.startLocation.city.toLowerCase().includes(searchCriteria.from.toLowerCase())
        : true;
      
      toMatch = searchCriteria.to
        ? ride.endLocation.city.toLowerCase().includes(searchCriteria.to.toLowerCase())
        : true;
      
      dateMatch = searchCriteria.date
        ? new Date(ride.date).toDateString() === searchCriteria.date.toDateString()
        : true;
      
      seatsMatch = Number(searchCriteria.seats) <= ride.availableSeats;
    }
    
    // Amenity filters - apply these regardless of search status
    // Apply amenity filters using the actual amenities properties from the ride object
    const verifiedProfileMatch = filters.verifiedProfile ? ride.driver.verifiedDriver === true : true;
    
    // Check if ride has amenities property, if not, consider all amenities as false
    const amenities = ride.amenities || {};
    
    const maxTwoInBackMatch = filters.maxTwoInBack ? amenities.maxTwoInBack === true : true;
    const instantBookingMatch = filters.instantBooking ? amenities.instantBooking === true : true;
    const smokingAllowedMatch = filters.smokingAllowed ? amenities.smokingAllowed === true : true;
    const petsAllowedMatch = filters.petsAllowed ? amenities.petsAllowed === true : true;
    const powerOutletsMatch = filters.powerOutlets ? amenities.powerOutlets === true : true;
    const wifiMatch = filters.wifi ? amenities.wifi === true : true;
    const toiletsMatch = filters.toilets ? amenities.toilets === true : true;
    const airConditioningMatch = filters.airConditioning ? amenities.airConditioning === true : true;
    const accessibleMatch = filters.accessible ? amenities.accessible === true : true;
    
    // Connection filters
    const connections = ride.connections || 0;
    const directOnlyMatch = filters.directOnly ? connections === 0 : true;
    const maxOneChangeMatch = filters.maxOneChange ? connections <= 1 : true;
    
    return fromMatch && toMatch && dateMatch && seatsMatch && 
           verifiedProfileMatch && maxTwoInBackMatch && instantBookingMatch && 
           smokingAllowedMatch && petsAllowedMatch && powerOutletsMatch && 
           wifiMatch && toiletsMatch && airConditioningMatch && accessibleMatch &&
           directOnlyMatch && maxOneChangeMatch;
  });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Find Available Rides</h1>
            <p className="text-muted-foreground text-lg">
              Search for rides based on your travel plans and preferences
            </p>
          </motion.div>
          
          <SearchForm onSearch={handleSearch} loading={isLoading} />
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="md:col-span-1">
              <Card className="sticky top-24 shadow-sm border-gray-200 transition-all duration-300 ease-in-out">
                <CardHeader className="bg-gray-50 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center"><Filter className="h-4 w-4 mr-2 text-primary" />Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Trust and Safety Section */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h3 className="font-medium mb-3 flex items-center text-blue-800">
                      <ShieldCheck className="h-5 w-5 mr-2 text-blue-500" />
                      Trust and safety
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm">
                        <Checkbox 
                          id="verified-profile" 
                          checked={filters.verifiedProfile}
                          onCheckedChange={(checked) => 
                            handleFilterChange('verifiedProfile', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="verified-profile" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>Verified profile</span>
                          <ShieldCheck className="h-4 w-4 ml-auto text-blue-500" />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Amenities Section */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-blue-600">
                      <Bus className="h-5 w-5 mr-2 text-blue-500" />
                      Amenities
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="max-two-back" 
                          checked={filters.maxTwoInBack}
                          onCheckedChange={(checked) => 
                            handleFilterChange('maxTwoInBack', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="max-two-back" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>Max. 2 in the back</span>
                          <User className="h-4 w-4 ml-auto text-gray-600" />
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="instant-booking" 
                          checked={filters.instantBooking}
                          onCheckedChange={(checked) => 
                            handleFilterChange('instantBooking', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="instant-booking" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>Instant Booking</span>
                          <Clock className="h-4 w-4 ml-auto text-green-600" />
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="smoking-allowed" 
                          checked={filters.smokingAllowed}
                          onCheckedChange={(checked) => 
                            handleFilterChange('smokingAllowed', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="smoking-allowed" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>Smoking allowed</span>
                          <Cigarette className="h-4 w-4 ml-auto text-gray-600" />
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="pets-allowed" 
                          checked={filters.petsAllowed}
                          onCheckedChange={(checked) => 
                            handleFilterChange('petsAllowed', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="pets-allowed" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>Pets allowed</span>
                          <PawPrint className="h-4 w-4 ml-auto text-amber-600" />
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="power-outlets" 
                          checked={filters.powerOutlets}
                          onCheckedChange={(checked) => 
                            handleFilterChange('powerOutlets', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="power-outlets" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>Power outlets</span>
                          <Power className="h-4 w-4 ml-auto text-red-600" />
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="wifi" 
                          checked={filters.wifi}
                          onCheckedChange={(checked) => 
                            handleFilterChange('wifi', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="wifi" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>WiFi</span>
                          <Wifi className="h-4 w-4 ml-auto text-blue-600" />
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="toilets" 
                          checked={filters.toilets}
                          onCheckedChange={(checked) => 
                            handleFilterChange('toilets', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="toilets" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>Toilets</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-auto text-gray-600"><path d="M8 2v2"/><path d="M16 2v2"/><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M12 10v8"/><path d="M8 10h8"/></svg>
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="air-conditioning" 
                          checked={filters.airConditioning}
                          onCheckedChange={(checked) => 
                            handleFilterChange('airConditioning', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="air-conditioning" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <span>Air conditioning</span>
                          <AirVent className="h-4 w-4 ml-auto text-cyan-600" />
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="accessible" 
                          checked={filters.accessible}
                          onCheckedChange={(checked) => 
                            handleFilterChange('accessible', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="accessible" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <div className="flex-1 pr-2">Accessible for passengers with disabilities</div>
                          <Accessibility className="h-4 w-4 flex-shrink-0 text-blue-600" />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Number of connections Section */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-blue-500">
                        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"/>
                        <path d="M17 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1"/>
                        <path d="M12 3v10"/>
                        <path d="M12 18v3"/>
                        <path d="M8 21h8"/>
                      </svg>
                      Number of connections
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="direct-only" 
                          checked={filters.directOnly}
                          onCheckedChange={(checked) => 
                            handleFilterChange('directOnly', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="direct-only" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <div className="flex-1 pr-2">Direct only</div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0 text-blue-600"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </label>
                      </div>
                      
                      <div className="flex items-center bg-white rounded-full py-2 px-4 shadow-sm">
                        <Checkbox 
                          id="max-one-change" 
                          checked={filters.maxOneChange}
                          onCheckedChange={(checked) => 
                            handleFilterChange('maxOneChange', checked === true)
                          }
                          className="text-blue-500 border-blue-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="max-one-change" 
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between w-full pl-2"
                        >
                          <div className="flex-1 pr-2">Max. 1 change</div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0 text-blue-600"><path d="M17 3v18"></path><path d="M10 8l-7 6 7 6"></path><path d="M7 14h13"></path></svg>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Search Results */}
            <div className="md:col-span-3">
              {hasSearched && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="mb-8 p-4 bg-secondary/70 rounded-lg shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium">Search Results:</div>
                    
                    {searchCriteria.from && (
                      <Badge variant="secondary" className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        From: {searchCriteria.from}
                      </Badge>
                    )}
                    
                    {searchCriteria.to && (
                      <Badge variant="secondary" className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        To: {searchCriteria.to}
                      </Badge>
                    )}
                    
                    {searchCriteria.date && (
                      <Badge variant="secondary" className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Date: {searchCriteria.date.toLocaleDateString()}
                      </Badge>
                    )}
                    
                    <Badge variant="secondary" className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      Seats: {searchCriteria.seats}
                    </Badge>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => setHasSearched(false)}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Reset
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {filteredRides.length > 0 && (
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-muted-foreground">
                    {filteredRides.length} {filteredRides.length === 1 ? "ride" : "rides"} found
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground mr-2">Sort by:</span>
                    <Select value={sortOption} onValueChange={handleSort}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="date-asc">Date: Earliest First</SelectItem>
                        <SelectItem value="date-desc">Date: Latest First</SelectItem>
                        <SelectItem value="seats-desc">Available Seats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <AnimatePresence>
                {isLoading ? (
                  <div className="space-y-6">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="border rounded-xl p-6">
                        <div className="flex items-start space-x-2 mb-4">
                          <div className="min-w-8 flex flex-col items-center">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-10 w-1 my-1" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </div>
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-4 w-48 mb-4" />
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-4 w-48" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                        <Skeleton className="h-px w-full my-4" />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-24 mb-2" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                          <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    ))}
                  </div>
                ) : filteredRides.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {filteredRides.map((ride, index) => (
                      <motion.div 
                        key={ride.id} 
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                      >
                        <RideCard ride={ride} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-8"
                  >
                    <div className="bg-secondary/50 rounded-xl p-8 max-w-md mx-auto">
                      <h3 className="text-xl font-medium mb-3">No rides found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search criteria or check back later for new rides.
                      </p>
                      <Button onClick={() => setHasSearched(false)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset Search
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
