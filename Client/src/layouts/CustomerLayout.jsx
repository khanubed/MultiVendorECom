import React from 'react';
import TopNavBar from '../components/common/TopNavBar';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const CustomerLayout = ({ children }) => {
  return (
    <div className="font-body-md text-on-surface bg-[#F8FAFC] min-h-screen flex flex-col">
      {/* Persistent Navigation */}
      <TopNavBar />

      {/* Dynamic Content Core */}
      <main className="pt-4 pb-4 px-2  max-w-[1440px] mx-auto flex-grow">
        <Outlet />
        <Toaster position="bottom-right" />
      </main>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
};

export default CustomerLayout;