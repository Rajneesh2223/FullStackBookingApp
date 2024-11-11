import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import { AccountNav } from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import {  Loader2, MapPin } from 'lucide-react';

export const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);  // Changed from string to array
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchPlace = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/places/' + id);
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.addedPhotos || []); // Add fallback empty array
        setDescription(data.description);
        setPerks(data.perks || []); // Add fallback empty array
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  const inputHeader = (text) => (
    <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-2">{text}</h2>
  );

  const inputDescription = (text) => (
    <p className="text-gray-500 text-sm mb-2">{text}</p>
  );

  const preInput = (header, description) => (
    <>
      {inputHeader(header)}
      {inputDescription(description)}
    </>
  );

  async function savePlace(ev) {
    ev.preventDefault();
    try {
      setLoading(true);
      const placeData = {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      };

      if (id) {
        await axios.put('/places', { id, ...placeData });
      } else {
        await axios.post('/places', placeData);
      }
      setRedirect(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountNav />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={savePlace} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {preInput('Title', 'Give your place a catchy title')}
            <input
              type="text"
              value={title}
              onChange={ev => setTitle(ev.target.value)}
              placeholder="e.g., Cozy Beachfront Villa"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {preInput('Address', 'Where is your place located?')}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={address}
                onChange={ev => setAddress(ev.target.value)}
                placeholder="Full address"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {preInput('Photos', 'Upload high-quality photos of your place')}
            <div className="bg-gray-50 p-4 rounded-lg">
              <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
            </div>

            {preInput('Description', 'Tell guests what makes your place special')}
            <textarea
              value={description}
              onChange={ev => setDescription(ev.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
              placeholder="Describe your place..."
            />

            {preInput('Perks', 'Select the amenities your place offers')}
            <div className=" p-4">
  <Perks selected={perks} onChange={setPerks} />
</div>


            {preInput('Extra Info', 'House rules and additional information')}
            <textarea
              value={extraInfo}
              onChange={ev => setExtraInfo(ev.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              placeholder="E.g., Check-in instructions, house rules..."
            />

            {preInput('Check-in & Check-out', 'Set your check-in and check-out times')}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                <input
                  type="text"
                  value={checkIn}
                  onChange={ev => setCheckIn(ev.target.value)}
                  placeholder="14:00"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                <input
                  type="text"
                  value={checkOut}
                  onChange={ev => setCheckOut(ev.target.value)}
                  placeholder="11:00"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                <input
                  type="number"
                  min="1"
                  value={maxGuests}
                  onChange={ev => setMaxGuests(ev.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={ev => setPrice(ev.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Saving...
              </>
            ) : (
              'Save Place'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlacesFormPage;