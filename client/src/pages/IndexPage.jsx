import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, MapPin,  Star } from 'lucide-react';

export const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/places', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch places: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPlaces(Array.isArray(data) ? [...data, ...data, ...data] : []);
      } catch (err) {
        setError(err.message || 'Failed to load places. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-rose-50 p-6 text-rose-800 my-4 shadow-xl">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">Error loading places</p>
        </div>
        <p className="mt-2 text-sm text-rose-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-rose-100 hover:bg-rose-200 rounded-lg text-sm transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {places.length > 0 ? places.map((place) => (
        <Link 
          to={'/place/' + place._id} 
          key={place._id}
          className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            {place.photos?.[0] ? (
              <img 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={'http://localhost:4000/uploads/' + place.photos[0]} 
                alt={place.title}
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/300";
                  e.target.alt = "Image not available";
                }}
              />
            ) : (
              <img 
                className="w-full h-full object-cover"
                src="/api/placeholder/400/300"
                alt="Placeholder" 
              />
            )}
            <div className="absolute top-3 right-3">
              <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 group">
                <svg 
                  viewBox="0 0 32 32" 
                  className="h-5 w-5 fill-none stroke-gray-600 stroke-2 group-hover:stroke-pink-600"
                >
                  <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-teal-100 to-pink-100 rounded-b-xl shadow-lg">
            <div className="flex justify-between items-start mb-1">
              <h2 className="font-medium text-gray-900 truncate">{place.title}</h2>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span className="font-medium">4.9</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="h-4 w-4 text-teal-500" />
              <p className="text-sm truncate">{place.address}</p>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-lg font-semibold text-teal-900">${place.price}</span>
              <span className="text-sm text-gray-500">/night</span>
            </div>
          </div>
        </Link>
      )) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
          <img 
            src="/api/placeholder/200/200"
            alt="No places" 
            className="w-32 h-32 mb-4 opacity-50"
          />
          <p className="text-lg font-medium">No places found</p>
          <p className="text-sm mt-1">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
