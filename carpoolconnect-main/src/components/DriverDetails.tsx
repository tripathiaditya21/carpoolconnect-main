
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Ride } from "@/lib/types";
import { getAvatarUrl, formatRating } from "@/lib/utils";
import { Star, Phone, Mail, Shield, Award, Calendar, Languages, Car, Wifi, Power, Cigarette, PawPrint, AirVent, ShieldCheck, Accessibility, User as UserIcon, Zap, Bus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DriverDetailsProps {
  driver: User;
  ride?: Ride;
}

const DriverDetails = ({ driver, ride }: DriverDetailsProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex justify-between items-center">
          <div>Driver Information</div>
          {driver.verifiedDriver && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <Shield className="h-3 w-3 mr-1" />
              Verified Driver
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={getAvatarUrl(driver)} alt={driver.name} />
            <AvatarFallback className="text-xl">{driver.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="text-lg font-medium">{driver.name}</h3>
            <div className="flex items-center mt-1 space-x-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span>{formatRating(driver.rating || 5.0)}</span>
              <span className="text-muted-foreground text-sm">
                ({driver.reviewCount || 0} reviews)
              </span>
            </div>
            
            {driver.username && (
              <div className="text-muted-foreground mt-1">
                @{driver.username}
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          {driver.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{driver.phone}</span>
            </div>
          )}
          
          {driver.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{driver.email}</span>
            </div>
          )}
          
          {driver.createdAt && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Member since {new Date(driver.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {ride?.driverDetails && (
          <>
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Experience: {ride.driverDetails.experience}</span>
              </div>
              
              <div className="flex items-start">
                <Languages className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <span>Languages: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ride.driverDetails.languages.map((language, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Status: {ride.driverDetails.verificationStatus}</span>
              </div>
            </div>
            
            {ride.carInfo && (
              <>
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Vehicle Information
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm pl-6">
                    <div>
                      <span className="text-muted-foreground">Make & Model:</span>
                      <p>{ride.carInfo.make} {ride.carInfo.model}</p>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Year:</span>
                      <p>{ride.carInfo.year}</p>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Color:</span>
                      <p>{ride.carInfo.color}</p>
                    </div>
                    
                    {ride.carInfo.licensePlate && (
                      <div>
                        <span className="text-muted-foreground">License Plate:</span>
                        <p>{ride.carInfo.licensePlate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {ride?.amenities && (
              <>
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center">
                    <Bus className="h-4 w-4 mr-2 text-green-700" />
                    Amenities & Features
                  </h4>
                  
                  <div className="flex flex-wrap gap-2 pl-6">
                    <TooltipProvider>
                      {driver.verifiedDriver && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Verified</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified profile</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.instantBooking && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                              <Zap className="h-3 w-3" />
                              <span>Instant</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Your booking will be confirmed instantly</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.maxTwoInBack && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200">
                              <UserIcon className="h-3 w-3" />
                              <span>Max 2 back</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum 2 passengers in the back</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.smokingAllowed && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200">
                              <Cigarette className="h-3 w-3" />
                              <span>Smoking</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Smoking is allowed</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.petsAllowed && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                              <PawPrint className="h-3 w-3" />
                              <span>Pets</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pets are allowed</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.powerOutlets && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
                              <Power className="h-3 w-3" />
                              <span>Power</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Power outlets available</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.wifi && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                              <Wifi className="h-3 w-3" />
                              <span>WiFi</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>WiFi available</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.toilets && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                <path d="M8 2v2"/><path d="M16 2v2"/><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M12 10v8"/><path d="M8 10h8"/>
                              </svg>
                              <span>Toilets</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Toilets available</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.airConditioning && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-cyan-50 text-cyan-700 border-cyan-200">
                              <AirVent className="h-3 w-3" />
                              <span>A/C</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Air conditioning available</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {ride.amenities?.accessible && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
                              <Accessibility className="h-3 w-3" />
                              <span>Accessible</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Accessible for passengers with disabilities</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverDetails;
