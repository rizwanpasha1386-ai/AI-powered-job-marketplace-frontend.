import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/recruiter-profiles/me');
        setProfile(data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile(null);
        } else {
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading your profile...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-10 text-center max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Company Profile Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You haven't set up your recruiter profile yet. Create one to start posting jobs and hiring talent!
        </p>
        <Link
          to="/recruiter/profile/edit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Create Company Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
        <Link
          to="/recruiter/profile/edit"
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Edit Profile
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.companyName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.companyLocation || 'Location not specified'}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-col items-end">
              {profile.verifiedStatus ? (
                <div className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium border border-green-200 dark:border-green-800 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Verified Company
                </div>
              ) : (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-600">
                  Unverified
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About the Company</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {profile.companyDescription || 'No description provided yet.'}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Recruiter Information</h3>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>{profile.recruiterName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
