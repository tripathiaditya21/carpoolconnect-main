import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Ride, RideRequest, User, Location } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to "MMM D, YYYY" (e.g., "Apr 20, 2023")
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format time to "h:mm A" (e.g., "3:30 PM")
export function formatTime(timeString: string): string {
  if (!timeString) return "";
  
  // Handle HH:MM format
  if (/^\d{1,2}:\d{2}$/.test(timeString)) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  // If it's already in the correct format or another format, return as is
  return timeString;
}

// Calculate distance between two locations (mock implementation)
export function calculateDistance(start: Location, end: Location): number {
  // This would use a real geo-calculation in production
  return Math.floor(Math.random() * 50) + 5; // Random distance between 5-55 km
}

// Calculate ride duration based on distance (mock implementation)
export function calculateDuration(distance: number): number {
  // Simple calculation: average speed of 50 km/h
  return Math.ceil(distance / 50 * 60); // Duration in minutes
}

// Format price as Indian currency (₹)
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// Generate avatar URL or fallback to UI Avatars
export function getAvatarUrl(user: User): string {
  if (user.avatar) return user.avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
}

// Format rating as X.X
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Indian names for drivers and users
const indianNames = [
  "Aarav Sharma", "Aanya Patel", "Advait Mehta", "Aditi Singh", 
  "Arjun Kumar", "Anaya Reddy", "Dhruv Agarwal", "Diya Gupta",
  "Ishaan Joshi", "Isha Verma", "Kabir Malhotra", "Kyra Kapoor",
  "Manav Chauhan", "Myra Choudhury", "Neha Bansal", "Neel Desai",
  "Rohan Mehra", "Riya Shah", "Samar Rao", "Shanaya Dubey",
  "Veer Saxena", "Vanya Khanna", "Yash Bajaj", "Zara Bose",
  "Vikram Iyer", "Pooja Reddy", "Rahul Chopra", "Sanjana Mittal",
  "Aditya Singhania", "Tanya Agarwal", "Karan Malhotra", "Meera Kapoor",
  "Vivek Kumar", "Anjali Desai", "Nikhil Joshi", "Deepika Singh",
  "Rajat Sharma", "Priya Gupta", "Varun Mehta", "Shreya Patel",
  "Siddharth Khanna", "Tanvi Reddy", "Ayush Verma", "Kavya Mishra",
  "Pranav Choudhary", "Aishwarya Bajaj", "Dev Patil", "Anika Sharma"
];

function getRandomIndianName() {
  return indianNames[Math.floor(Math.random() * indianNames.length)];
}

// Store a new ride to local storage
export function storeUserRide(ride: Ride): void {
  try {
    // Get existing user rides from local storage
    const existingRidesJSON = localStorage.getItem('userRides') || '[]';
    const existingRides = JSON.parse(existingRidesJSON) as Ride[];
    
    // Add the new ride to the array
    existingRides.push(ride);
    
    // Save back to local storage
    localStorage.setItem('userRides', JSON.stringify(existingRides));
  } catch (error) {
    console.error('Error storing ride:', error);
  }
}

// Get user-created rides from local storage
export function getUserRides(): Ride[] {
  try {
    const ridesJSON = localStorage.getItem('userRides') || '[]';
    return JSON.parse(ridesJSON) as Ride[];
  } catch (error) {
    console.error('Error retrieving user rides:', error);
    return [];
  }
}

// Mock function to fetch rides
export async function fetchRides(): Promise<Ride[]> {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get user-created rides
  const userRides = getUserRides();
  
  // Generate 10 mock rides with Indian cities and details
  const mockRides = Array.from({ length: 10 }, (_, i) => ({
    id: `ride-${i + 1}`,
    driver: {
      id: `driver-${i + 1}`,
      name: getRandomIndianName(),
      email: `driver${i + 1}@example.com`,
      avatar: i % 3 === 0 ? `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 1}.jpg` : undefined,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 50) + 5,
      verifiedDriver: i % 3 === 0,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
    },
    startLocation: {
      address: `${100 + i} ${['MG Road', 'Linking Road', 'Gandhi Marg', 'Nehru Place', 'Patel Chowk'][i % 5]}`,
      city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Kochi'][i % 10],
      state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'West Bengal', 'Rajasthan', 'Gujarat', 'Kerala'][i % 10],
      country: 'India'
    },
    endLocation: {
      address: `${200 + i} ${['Bandra', 'Connaught Place', 'Koramangala', 'T Nagar', 'Jubilee Hills'][i % 5]}`,
      city: ['Pune', 'Jaipur', 'Hyderabad', 'Kolkata', 'Delhi', 'Chennai', 'Mumbai', 'Kochi', 'Bangalore', 'Ahmedabad'][i % 10],
      state: ['Maharashtra', 'Rajasthan', 'Telangana', 'West Bengal', 'Delhi', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Karnataka', 'Gujarat'][i % 10],
      country: 'India'
    },
    date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
    time: `${(9 + (i % 8)).toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    availableSeats: Math.floor(Math.random() * 3) + 1,
    price: (Math.floor(Math.random() * 10) + 1) * 500, // Prices in rupees (500-5000)
    status: 'scheduled' as const,
    createdAt: new Date().toISOString(),
    carInfo: {
      make: ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda'][i % 5],
      model: ['Swift', 'i20', 'Nexon', 'XUV300', 'City'][i % 5],
      year: 2018 + (i % 5),
      color: ['White', 'Black', 'Silver', 'Blue', 'Red'][i % 5],
      licensePlate: `${['MH', 'DL', 'KA', 'TN', 'TS', 'WB', 'RJ', 'GJ', 'KL'][i % 9]}-${(i + 1) * 10}${String.fromCharCode(65 + (i % 26))}-${1000 + i * 111}`
    },
    driverDetails: {
      experience: `${2 + (i % 10)} years`,
      languages: ['Hindi', 'English', ...(i % 3 === 0 ? ['Tamil'] : i % 3 === 1 ? ['Marathi'] : ['Bengali'])],
      verificationStatus: i % 5 === 0 ? 'Gold verified' : i % 3 === 0 ? 'Silver verified' : 'Verified'
    },
    connections: i % 3, // 0 = direct, 1 = one connection, 2 = two connections
    amenities: {
      maxTwoInBack: i % 3 === 0,
      instantBooking: i % 2 === 0,
      smokingAllowed: i % 5 === 0,
      petsAllowed: i % 4 === 0,
      powerOutlets: i % 3 === 1,
      wifi: i % 3 === 2,
      toilets: i % 4 === 1,
      airConditioning: i % 2 === 1,
      accessible: i % 7 === 0
    }
  }));
  
  // Combine user rides with mock rides
  return [...userRides, ...mockRides];
}

// Mock function to fetch ride requests
export async function fetchRideRequests(): Promise<RideRequest[]> {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate 5 mock ride requests with Indian cities
  return Array.from({ length: 5 }, (_, i) => ({
    id: `request-${i + 1}`,
    user: {
      id: `user-${i + 1}`,
      name: getRandomIndianName(),
      email: `user${i + 1}@example.com`,
      avatar: i % 2 === 0 ? `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 10}.jpg` : undefined,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 20) + 2
    },
    startLocation: {
      address: `${300 + i} ${['Juhu', 'Saket', 'Indiranagar', 'Adyar', 'Banjara Hills'][i % 5]}`,
      city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'][i % 5],
      state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana'][i % 5],
      country: 'India'
    },
    endLocation: {
      address: `${400 + i} ${['Andheri', 'Dwarka', 'HSR Layout', 'Velachery', 'HITEC City'][i % 5]}`,
      city: ['Pune', 'Gurgaon', 'Mysore', 'Pondicherry', 'Warangal'][i % 5],
      state: ['Maharashtra', 'Haryana', 'Karnataka', 'Puducherry', 'Telangana'][i % 5],
      country: 'India'
    },
    date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
    time: `${8 + (i % 10)}:${i % 2 === 0 ? '00' : '30'} ${i < 3 ? 'AM' : 'PM'}`,
    numberOfSeats: Math.floor(Math.random() * 2) + 1,
    maxPrice: (Math.floor(Math.random() * 5) + 1) * 400, // Max prices in rupees (400-2000)
    status: 'open' as const,
    createdAt: new Date().toISOString()
  }));
}

// Store a ride request to local storage
export function storeUserRideRequest(rideId: string, userId: string, seats: number): boolean {
  try {
    // Get existing ride requests from local storage
    const existingRequestsJSON = localStorage.getItem('userRideRequests') || '[]';
    let existingRequests = [];
    
    try {
      existingRequests = JSON.parse(existingRequestsJSON);
    } catch (e) {
      console.error('Error parsing existing requests:', e);
      existingRequests = [];
    }
    
    // Create a simplified ride object with just the necessary data
    // This avoids storing the entire ride object which might cause issues
    const newRequest = {
      id: `request-${Date.now()}`,
      rideId,
      userId,
      seats,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    existingRequests.push(newRequest);
    
    // Save back to local storage
    localStorage.setItem('userRideRequests', JSON.stringify(existingRequests));
    console.log('Ride request stored successfully:', newRequest);
    return true;
  } catch (error) {
    console.error('Error storing ride request:', error);
    return false;
  }
}

// Get user ride requests from local storage
export function getUserRideRequests(): any[] {
  try {
    const requestsJSON = localStorage.getItem('userRideRequests') || '[]';
    return JSON.parse(requestsJSON);
  } catch (error) {
    console.error('Error retrieving user ride requests:', error);
    return [];
  }
}

// Book a ride (mock implementation)
export async function bookRide(rideId: string, userId: string, seats: number): Promise<boolean> {
  try {
    // In a real app, this would be an API call to book the ride
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Booking ride ${rideId} for user ${userId} with ${seats} seats`);
    
    // Store the ride request in local storage - safely
    try {
      const requestStored = storeUserRideRequest(rideId, userId, seats);
      if (!requestStored) {
        console.error('Failed to store ride request');
        return false;
      }
      
      // Update available seats for the ride (in a real app, this would be done on the server)
      const rides = await fetchRides();
      const rideIndex = rides.findIndex(r => r.id === rideId);
      
      if (rideIndex !== -1 && rides[rideIndex].availableSeats >= seats) {
        rides[rideIndex].availableSeats -= seats;
        // This is just for demo - in a real app we wouldn't store the entire rides array in localStorage
        localStorage.setItem('cachedRides', JSON.stringify(rides));
      }
      
      return true;
    } catch (storageError) {
      console.error('Error in storage operations:', storageError);
      return false;
    }
  } catch (error) {
    console.error('Error booking ride:', error);
    return false;
  }
}

// Get driver details (mock implementation)
export async function getDriverDetails(driverId: string): Promise<User | null> {
  // In a real app, this would be an API call to get driver details
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock driver details
  const driverIndex = parseInt(driverId.replace('driver-', '')) || 1;
  
  return {
    id: driverId,
    name: getRandomIndianName(),
    email: `driver${driverIndex}@example.com`,
    avatar: driverIndex % 3 === 0 ? `https://randomuser.me/api/portraits/${driverIndex % 2 === 0 ? 'men' : 'women'}/${driverIndex + 1}.jpg` : undefined,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    rating: 4 + Math.random(),
    reviewCount: Math.floor(Math.random() * 50) + 5,
    verifiedDriver: driverIndex % 3 === 0,
    createdAt: new Date(Date.now() - driverIndex * 30 * 86400000).toISOString()
  };
}
