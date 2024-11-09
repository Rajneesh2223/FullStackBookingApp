import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, Info,  Loader2, ChevronDown, Star } from 'lucide-react';
import { BookingsWidget } from '../BookingsWidget';
import { PlaceGallery } from '../PlaceGallery';
import { AddressLink } from '../AddressLink';

export const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchPlaceData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/places/${id}`);
        if (!response.ok) throw new Error('Failed to fetch place details');
        const data = await response.json();
        setPlace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaceData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-lg">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-700 font-medium">Loading your destination...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-50 p-4">
        <div className="max-w-lg p-6 bg-white border border-red-200 text-red-800 rounded-xl shadow-lg">
          <div className="font-semibold text-lg">Unable to load place details</div>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!place) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="space-y-6 mb-12 animate-fadeIn">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {place.title}
            </h1>
            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-semibold">4.9</span>
            </div>
          </div>
          <AddressLink>
            <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <span className="text-lg">{place.address}</span>
            </div>
          </AddressLink>
        </div>

        {/* Gallery Section */}
        <div className="mb-16 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
          <PlaceGallery place={place} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12">
          {/* Left Column - Details */}
          <div className="space-y-10">
            {/* Description */}
            <section className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">About this place</h2>
              <div className={`relative ${!isDescriptionExpanded && 'max-h-48 overflow-hidden'}`}>
                <p className="text-gray-600 leading-relaxed text-lg">{place.description}</p>
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                <span>{isDescriptionExpanded ? 'Show less' : 'Read more'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
              </button>
            </section>

            {/* Check-in Details */}
            <section className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">Stay Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="flex items-start gap-4 group p-4 rounded-xl hover:bg-blue-50 transition-colors">
                  <Clock className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <div>
                    <p className="font-semibold text-gray-900">Check-in</p>
                    <p className="text-gray-600 mt-1">{place.checkIn}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group p-4 rounded-xl hover:bg-blue-50 transition-colors">
                  <Clock className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <div>
                    <p className="font-semibold text-gray-900">Check-out</p>
                    <p className="text-gray-600 mt-1">{place.checkOut}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group p-4 rounded-xl hover:bg-blue-50 transition-colors">
                  <Users className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  <div>
                    <p className="font-semibold text-gray-900">Max guests</p>
                    <p className="text-gray-600 mt-1">{place.maxGuests} guests</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Extra Info */}
            {place.extraInfo && (
              <section className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">{place.extraInfo}</p>
              </section>
            )}
          </div>

          {/* Right Column - Booking Widget */}
          <div className="md:sticky md:top-8 h-fit">
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <BookingsWidget place={place} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;