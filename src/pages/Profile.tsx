import React from 'react';
import Navbar from '@/components/Navbar';
import UserProfileSimple from '@/components/UserProfileSimple';
import ProtectedRoute from '@/components/ProtectedRoute';

const Profile: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
            <UserProfileSimple />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
