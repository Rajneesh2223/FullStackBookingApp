import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Pencil } from 'lucide-react';

export const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaces();
  }, []);

  async function loadPlaces() {
    try {
      const { data } = await axios.get('/user-places');
      setPlaces(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading places:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <Link 
          to={'/account/places/new'} 
          className="inline-flex items-center gap-2 bg-primary px-6 py-2 text-white rounded-full"
        >
          <Plus className="w-4 h-4" />
          Add new place
        </Link>
      </div>
      <div className="mt-8">
        {places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map(place => (
              <Link
                to={`/account/places/${place._id}`}
                key={place._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video">
                  {place.photos?.[0] && (
                    <img
                      src={`http://localhost:4000/uploads/${place.photos[0]}`}
                      alt={place.title}
                      className="object-cover w-full h-full"
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{place.title}</h2>
                  <p className="text-gray-500 text-sm mb-2">{place.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium">${place.price} / night</span>
                    <span className="text-sm text-gray-500">
                      Max guests: {place.maxGuests}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-500 mb-4">You haven't listed any places yet.</p>
            <Link 
              to={'/account/places/new'} 
              className="text-primary hover:underline"
            >
              Start by adding your first place
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};