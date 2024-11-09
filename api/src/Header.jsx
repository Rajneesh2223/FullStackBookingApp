import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext.jsx';
import { useContext, useState } from 'react';
import { Search, Menu, User, LogOut, Heart, Home, Settings, HelpCircle, Bell } from 'lucide-react';

export const Header = () => {
  const { user } = useContext(UserContext);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="relative">
      <header className="flex justify-between items-center bg-gradient-to-r from-[#FF5A5F] to-[#FF748C] p-4 rounded-b-3xl shadow-lg">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-90 w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
          <span className="text-white font-bold text-2xl tracking-wider">AirBond</span>
        </Link>

        <div 
          className={`flex border gap-2 border-white rounded-full py-2 px-4 shadow-md bg-white/30 backdrop-blur-md transition-all duration-300 ${
            isSearchExpanded ? 'w-1/2' : 'w-auto'
          }`}
          onClick={() => setIsSearchExpanded(true)}
          onBlur={() => setIsSearchExpanded(false)}
        >
          <div className="text-white font-medium">Anywhere</div>
          <div className="border-l border-white"></div>
          <div className="text-white font-medium">Anyweek</div>
          <div className="border-l border-white"></div>
          <div className="text-white font-medium">Add Guests</div>
          <div className="border-l border-white"></div>
          <button className="bg-[#FF5A5F] text-white p-2 rounded-full hover:bg-[#FF748C] transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors relative"
            >
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-sm text-gray-800">New booking request from John Doe</p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-sm text-gray-800">Your booking was confirmed</p>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 border-2 border-white rounded-full py-2 px-4 hover:bg-white/40 transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
              <div className="bg-gray-500 text-white rounded-full border-2 border-gray-500 overflow-hidden">
                <User className="w-6 h-6" />
              </div>
              {user && (
                <div className="text-white font-semibold">
                  {user.name}
                </div>
              )}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-50">
                {user ? (
                  <>
                    <Link to="/account" className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <Link to="/favorites" className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>Favorites</span>
                    </Link>
                    <Link to="/bookings" className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                      <Home className="w-5 h-5" />
                      <span>My Bookings</span>
                    </Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <Link to="/settings" className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <Link to="/help" className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                      <HelpCircle className="w-5 h-5" />
                      <span>Help Center</span>
                    </Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors text-red-600 w-full">
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                      <LogOut className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                    <Link to="/signup" className="px-4 py-2 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                      <User className="w-5 h-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};