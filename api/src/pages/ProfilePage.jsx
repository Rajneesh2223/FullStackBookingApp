import  { useContext, useState } from 'react';
import { UserContext } from '../../UserContext.jsx';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PlacesPage } from './PlacesPage.jsx';
import { AccountNav } from '../AccountNav.jsx';
import { UserCircle, LogOut, Mail, Calendar } from 'lucide-react';

export const ProfilePage = () => {
  const [redirect, setRedirect] = useState(false);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout');
    setUser(null);
    setRedirect('/');
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-36"></div>
          </div>
        </div>
      </div>
    );
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <AccountNav />
        
        {subpage === 'profile' && (
          <div className="mt-8 bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex flex-col items-center space-y-6">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="bg-primary/10 rounded-full p-6 bg-blue-50">
                    <UserCircle className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
                
                {/* User Info */}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {user.name}
                  </h2>
                  <div className="flex items-center justify-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{user.email}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="w-full max-w-xs">
                  <button
                    onClick={logout}
                    className="flex items-center justify-center w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Account Status */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-2">Account Status</h3>
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Member Since
                      </div>
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-xl font-semibold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-xl font-semibold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Places Listed</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-xl font-semibold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-xl font-semibold text-orange-600">0</div>
                  <div className="text-sm text-gray-600">Favorites</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {subpage === 'places' && (
          <div className="mt-8">
            <PlacesPage />
          </div>
        )}
      </div>
    </div>
  );
};