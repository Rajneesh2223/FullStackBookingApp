import { useEffect, useState } from 'react';
import { AccountNav } from '../AccountNav';
import PlaceImg from '../PlaceImg';
import axios from 'axios';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/bookings');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AccountNav />
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AccountNav />
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountNav />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <PlaceImg place={booking.place} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{booking.place.title}</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{booking.place.address}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {booking.numberOfNights} {booking.numberOfNights === 1 ? 'night' : 'nights'}
                      </span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Price</span>
                        <span className="text-xl font-semibold text-blue-600">${booking.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button 
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      onClick={() => window.location.href = `/account/bookings/${booking._id}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;