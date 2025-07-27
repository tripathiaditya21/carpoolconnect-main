
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Search as SearchIcon, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SearchFormProps {
  onSearch: (criteria: {
    from: string;
    to: string;
    date: Date | undefined;
    seats: string;
  }) => void;
  loading?: boolean;
}

const SearchForm = ({ onSearch, loading = false }: SearchFormProps) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [seats, setSeats] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ from, to, date, seats });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-full shadow-sm border border-gray-200 p-1 flex flex-wrap md:flex-nowrap items-center"
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-wrap md:flex-nowrap items-center">
        <div className="relative flex-1 min-w-[200px] px-2 py-1 md:py-0 border-r border-gray-200">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              id="from"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8 text-base placeholder:text-gray-500"
              required
            />
          </div>
        </div>
        
        <div className="relative flex-1 min-w-[200px] px-2 py-1 md:py-0 border-r border-gray-200">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              id="to"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8 text-base placeholder:text-gray-500"
              required
            />
          </div>
        </div>
        
        <div className="relative flex-1 min-w-[200px] px-2 py-1 md:py-0 border-r border-gray-200">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center w-full h-8 text-left text-base focus:outline-none"
                >
                  {date ? format(date, "PPP") : <span className="text-gray-500">Today</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    // Compare only the date parts to allow selecting today
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="relative flex-1 min-w-[150px] px-2 py-1 md:py-0 border-r border-gray-200">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">{seats}</span>
              <span className="text-gray-500">passenger{parseInt(seats) !== 1 ? 's' : ''}</span>
              <Input
                id="seats"
                type="range"
                min="1"
                max="8"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="w-16 ml-2 h-1"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-auto p-1">
          <Button 
            type="submit" 
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 rounded-full" 
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default SearchForm;
