import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
     
      <Header />
      
     
      <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

     
      <footer className="bg-gray-800 text-white py-4 mt-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 My Website. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
