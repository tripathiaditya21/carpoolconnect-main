import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getAvatarUrl, formatRating, fetchRides, getUserRideRequests } from "@/lib/utils";
import { Ride } from "@/lib/types";
import RideCard from "@/components/RideCard";
import { 
  Star, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Car, 
  Loader2,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
  LogOut,
  Save,
  AtSign,
  UserCircle
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, isAuthenticated, isLoading, logout, updateUsername } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [upcomingRides, setUpcomingRides] = useState<Ride[]>([]);
  const [pastRides, setPastRides] = useState<Ride[]>([]);
  const [offerHistory, setOfferHistory] = useState<Ride[]>([]);
  const [requestHistory, setRequestHistory] = useState<Ride[]>([]);
  const [isLoadingRides, setIsLoadingRides] = useState(true);

  // Profile form state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
      toast.error("Please sign in to view your profile");
    } else if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setUsername(user.username || "");
    }
  }, [isLoading, isAuthenticated, navigate, user]);

  // Load rides
  useEffect(() => {
    const loadRides = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoadingRides(true);
        const rides = await fetchRides();
        
        // Get current date for comparison
        const now = new Date();
        
        // Get upcoming rides (future dates)
        const upcomingRides = rides.filter(ride => {
          try {
            const rideDate = new Date(`${ride.date}T${ride.time}`);
            return rideDate > now;
          } catch (e) {
            console.error('Error parsing ride date:', e);
            return false; // Skip invalid dates
          }
        });
        
        // Get past rides (past dates)
        const pastRides = rides.filter(ride => {
          try {
            const rideDate = new Date(`${ride.date}T${ride.time}`);
            return rideDate < now;
          } catch (e) {
            console.error('Error parsing ride date:', e);
            return false; // Skip invalid dates
          }
        });
        
        // Get user ride requests from local storage with error handling
        let userRequests = [];
        try {
          userRequests = getUserRideRequests();
          console.log('User ride requests:', userRequests);
        } catch (error) {
          console.error('Error getting user ride requests:', error);
          userRequests = []; // Default to empty array on error
        }
        
        // Process ride requests
        if (userRequests && userRequests.length > 0) {
          // For each request, find the corresponding ride
          const requestedRides = [];
          
          for (const request of userRequests) {
            if (!request || !request.rideId) continue; // Skip invalid requests
            
            // Find the ride in our rides array
            const ride = rides.find(r => r.id === request.rideId);
            if (ride) {
              requestedRides.push({
                ...ride,
                requestStatus: request.status || 'pending',
                requestDate: request.date || new Date().toISOString(),
              });
            }
          }
          
          setRequestHistory(requestedRides);
        }
        
        // Set the rides to state
        setUpcomingRides(upcomingRides);
        setPastRides(pastRides);
        
        // For demo purposes, use the same rides as offer history
        // In a real app, this would come from a different API endpoint
        setOfferHistory(rides.slice(0, 3));
      } catch (error) {
        console.error('Error loading rides:', error);
        toast.error('Failed to load rides');
        
        // Set default empty states to prevent blank pages
        setUpcomingRides([]);
        setPastRides([]);
        setRequestHistory([]);
        setOfferHistory([]);
      } finally {
        setIsLoadingRides(false);
      }
    };
    
    loadRides();
  }, [isAuthenticated]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSavingProfile(true);
      
      // Update username if it has changed
      if (username !== user.username) {
        await updateUsername(username);
      }
      
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setUsername(user.username || "");
      setBio("");
    }
    setIsEditingProfile(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-xl p-6 sticky top-24"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={getAvatarUrl(user)} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  {!isEditingProfile && (
                    <div className="text-center">
                      <h2 className="text-xl font-medium">{user?.name}</h2>
                      <p className="text-muted-foreground flex items-center justify-center mt-1">
                        <AtSign className="h-3 w-3 mr-1" />
                        {user?.username || "username"}
                      </p>
                      
                      <div className="flex items-center justify-center mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{formatRating(user?.rating || 0)}</span>
                        <span className="text-muted-foreground text-sm ml-1">({user?.reviewCount || 0} reviews)</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {!isEditingProfile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {!isEditingProfile ? (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member since</p>
                      <p>May 29, 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Car className="h-4 w-4 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rides taken</p>
                      <p>{pastRides.length}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 text-destructive hover:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell others about yourself..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      onClick={handleSaveProfile} 
                      className="flex-1"
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {!isSavingProfile && <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      className="flex-1"
                      disabled={isSavingProfile}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Rides Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
                <TabsTrigger value="past">Past Rides</TabsTrigger>
                <TabsTrigger value="offers">Your Offers</TabsTrigger>
                <TabsTrigger value="requests">Your Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-6">
                {isLoadingRides ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : upcomingRides.length > 0 ? (
                  upcomingRides.map(ride => (
                    <RideCard key={ride.id} ride={ride} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-secondary/50 rounded-xl">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No upcoming rides</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      You don't have any upcoming rides scheduled. 
                      Find a ride now or check back later.
                    </p>
                    <Button asChild className="mt-6">
                      <a href="/search">Find a Ride</a>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-6">
                {isLoadingRides ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : pastRides.length > 0 ? (
                  <>
                    {pastRides.map(ride => (
                      <div key={ride.id} className="glass-card rounded-xl p-6">
                        <div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">
                                  {ride.startLocation.city} to {ride.endLocation.city}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  {new Date(ride.date).toLocaleDateString()} at {ride.time}
                                </p>
                              </div>
                              <Badge variant="outline" className="h-6">Completed</Badge>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={getAvatarUrl(ride.driver)} alt={ride.driver.name} />
                                  <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{ride.driver.name}</p>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                                    <p className="text-xs">{ride.driver.rating?.toFixed(1)} ({ride.driver.reviewCount || 0})</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-blue-500">₹{ride.price}</p>
                                <p className="text-xs text-gray-500">{ride.carInfo?.make} {ride.carInfo?.model}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12 bg-secondary/50 rounded-xl">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No past rides</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      You haven't taken any rides yet. 
                      Once you complete a ride, it will appear here.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="offers" className="space-y-6">
                {isLoadingRides ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : offerHistory.length > 0 ? (
                  offerHistory.map(ride => (
                    <div key={ride.id} className="glass-card rounded-xl p-6">
                      <div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">
                                {ride.startLocation.city} to {ride.endLocation.city}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {new Date(ride.date).toLocaleDateString()} at {ride.time}
                              </p>
                            </div>
                            <Badge
                              className={
                                new Date(ride.date) > new Date()
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-blue-100 text-blue-800 border-blue-200"
                              }
                            >
                              {new Date(ride.date) > new Date() ? "Active" : "Completed"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Price</p>
                              <p className="font-medium">₹{ride.price}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Seats</p>
                              <p className="font-medium">{ride.availableSeats} available</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Car</p>
                              <p className="font-medium">{ride.carInfo?.make} {ride.carInfo?.model}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Offer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-secondary/50 rounded-xl">
                    <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No ride offers</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      You haven't offered any rides yet. 
                      Create a ride offer to start sharing your journey.
                    </p>
                    <Button asChild className="mt-6">
                      <a href="/offer">Offer a Ride</a>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="requests" className="space-y-6">
                {isLoadingRides ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : requestHistory.length > 0 ? (
                  requestHistory.map(ride => (
                    <div key={ride.id} className="glass-card rounded-xl p-6">
                      <div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">
                                {ride.startLocation.city} to {ride.endLocation.city}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {new Date(ride.date).toLocaleDateString()} at {ride.time}
                              </p>
                            </div>
                            <Badge
                              className={
                                new Date(ride.date) > new Date()
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-blue-100 text-blue-800 border-blue-200"
                              }
                            >
                              {new Date(ride.date) > new Date() ? "Pending" : "Completed"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Price</p>
                              <p className="font-medium">₹{ride.price}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Seats</p>
                              <p className="font-medium">{ride.availableSeats} requested</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <p className="font-medium">{new Date(ride.date) > new Date() ? "Awaiting approval" : "Completed"}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Request
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-secondary/50 rounded-xl">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">No ride requests</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      You haven't requested any rides yet.
                      Find a ride and make a request to get started.
                    </p>
                    <Button asChild className="mt-6">
                      <a href="/search">Find a Ride</a>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
