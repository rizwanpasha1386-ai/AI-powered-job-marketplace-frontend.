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
        const { data } = await api.get('/employee-profiles/me');
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
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You haven't set up your employee profile yet. Create one to start finding the best jobs!
        </p>
        <Link
          to="/employee/profile/edit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <Link
          to="/employee/profile/edit"
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
                {profile.user?.name || 'Professional'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{profile.preferredJobType} Worker</p>
            </div>
            <div className="mt-4 sm:mt-0 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
              {profile.availabilityStatus}
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
            {profile.bio || 'No bio provided.'}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
          
          {/* Left Column */}
          <div className="p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No skills listed.</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preferences
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Target Salary:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {profile.preferredSalary ? `$${profile.preferredSalary.toLocaleString()}` : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Job Type:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{profile.preferredJobType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Experience</h3>
              {profile.experience?.length > 0 ? (
                <div className="space-y-4">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{exp.jobTitle}</h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {exp.company} &bull; {exp.duration}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{exp.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No experience listed.</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Education</h3>
              {profile.education?.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{edu.degree}</h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {edu.institution} &bull; {edu.year}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No education listed.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
