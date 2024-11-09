import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AddressLink } from "../AddressLink";
import { PlaceGallery } from "../PlaceGallery";
import BookingDates from "../BookingDates";
import { Calendar,  CreditCard, Home, Clock, DollarSign } from "lucide-react";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Home className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">{booking.place.title}</h1>
        </div>
        <AddressLink className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
          
          {booking.place.address}
        </AddressLink>
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Booking Details</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <BookingDates booking={booking} />
              </div>
              
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span>Confirmation ID: {booking._id}</span>
              </div>
            </div>

            <div className="bg-primary text-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">Total Amount</span>
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold">${booking.price}</div>
              <div className="text-sm opacity-75 mt-2">All taxes and fees included</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <PlaceGallery place={booking.place} />
        </div>
      </div>
    </div>
  );
}