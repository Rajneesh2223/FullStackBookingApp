import PropTypes from 'prop-types';

const BACKEND_URL = 'https://fullstackbookingapp.onrender.com';
export default function Image({ src, ...rest }) {
  // Ensure src starts with the base URL if it's not already a full URL
  src = src && (src.startsWith('http://') || src.startsWith('https://')) 
    ? src 
    : `${BACKEND_URL}/uploads/${src}`;

  console.log('Image URL:', src);

  return (
    <img {...rest} src={src} alt={rest.alt || ''} />
  );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,  
  alt: PropTypes.string,  
};
