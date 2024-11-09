import { useState } from 'react';
import Image from './Image.jsx';
import PropTypes from 'prop-types';
import { X, ImageIcon } from 'lucide-react';

export const PlaceGallery = ({ place }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!place) return null;

  if (showAllPhotos) {
    return (
      <div className='fixed inset-0 bg-white z-50 overflow-y-auto'>
        <div className="p-8">
          <div className="sticky top-0 bg-white pb-4 flex justify-between items-center">
            <h2 className="text-3xl">Photos of {place.title}</h2>
            <button 
              onClick={() => setShowAllPhotos(false)} 
              className="flex items-center gap-1 py-2 px-4 rounded-2xl shadow-md hover:bg-gray-100 bg-white transition-colors"
            >
              <X className="w-6 h-6" />
              <span>Close photos</span>
            </button>
          </div>
          
          <div className="grid gap-4 pb-8">
            {place?.photos?.length > 0 ? (
              place.photos.map((photo, index) => (
                <div key={index} className="flex justify-center">
                  <Image 
                    src={photo} 
                    alt={`Photo ${index + 1} of ${place.title}`}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">No photos available</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden'>
        <div>
          {place.photos?.[0] ? (
            <div className="cursor-pointer" onClick={() => setShowAllPhotos(true)}>
              <Image
                className='aspect-square object-cover hover:opacity-95 transition-opacity'
                src={place.photos[0]}
                alt={`Main photo of ${place.title}`}
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No photo available</span>
            </div>
          )}
        </div>

        <div className='grid gap-2'>
          {place.photos?.[1] ? (
            <div className="cursor-pointer" onClick={() => setShowAllPhotos(true)}>
              <Image
                className='aspect-square object-cover hover:opacity-95 transition-opacity'
                src={place.photos[1]}
                alt={`Second photo of ${place.title}`}
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-100"/>
          )}
          
          <div className='overflow-hidden'>
            {place.photos?.[2] ? (
              <div className="cursor-pointer" onClick={() => setShowAllPhotos(true)}>
                <Image
                  className='aspect-square object-cover hover:opacity-95 transition-opacity'
                  src={place.photos[2]}
                  alt={`Third photo of ${place.title}`}
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100"/>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowAllPhotos(true)}
        className='flex gap-1 items-center absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow-md hover:bg-gray-100 transition-colors'
      >
        <ImageIcon className="w-6 h-6" />
        <span>Show more photos</span>
      </button>
    </div>
  );
};

PlaceGallery.propTypes = {
  place: PropTypes.shape({
    title: PropTypes.string.isRequired,  
    description: PropTypes.string,
    location: PropTypes.string,
    photos: PropTypes.arrayOf(PropTypes.string),  
  }).isRequired,
};