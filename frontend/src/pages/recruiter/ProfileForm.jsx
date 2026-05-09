import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/Input';

const ProfileForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    recruiterName: '',
    companyDescription: '',
    companyLocation: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/recruiter-profiles/me');
        if (data.data) {
          setIsUpdate(true);
          const p = data.data;
          setFormData({
            companyName: p.companyName || '',
            recruiterName: p.recruiterName || '',
            companyDescription: p.companyDescription || '',
            companyLocation: p.companyLocation || '',
          });
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError('Failed to load existing profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.companyName || !formData.recruiterName) {
      return setError('Company Name and Recruiter Name are strictly required.');
    }

    setSaving(true);

    try {
      if (isUpdate) {
        await api.put('/recruiter-profiles/me', formData);
      } else {
        await api.post('/recruiter-profiles', formData);
      }
      navigate('/recruiter/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please check your inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading form...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-10 my-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isUpdate ? 'Edit Company Profile' : 'Create Company Profile'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name *"
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            required
          />
          
          <Input
            label="Recruiter Name *"
            id="recruiterName"
            name="recruiterName"
            type="text"
            value={formData.recruiterName}
            onChange={handleChange}
            placeholder="e.g. Jane Doe"
            required
          />
        </div>

        <Input
          label="Company Location"
          id="companyLocation"
          name="companyLocation"
          type="text"
          value={formData.companyLocation}
          onChange={handleChange}
          placeholder="e.g. San Francisco, CA"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Company Description
          </label>
          <textarea
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Tell candidates about your company culture, mission, and benefits..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition-colors disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
