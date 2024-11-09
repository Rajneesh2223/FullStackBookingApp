import PropTypes from 'prop-types';
import Image from "./Image.jsx";

export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place?.photos?.length) {
    return null;  // Return null instead of an empty string for React components
  }

  className = className || 'object-cover';

  return (
    <Image 
      className={className} 
      src={place.photos[index]} 
      alt={`Place image ${index + 1}`}
    />
  );
}

PlaceImg.propTypes = {
  place: PropTypes.shape({
    photos: PropTypes.arrayOf(PropTypes.string).isRequired,  // Assuming photos is an array of image URLs
  }).isRequired,
  index: PropTypes.number,
  className: PropTypes.string,
};
