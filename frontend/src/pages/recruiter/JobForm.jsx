import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/Input';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isUpdate = Boolean(id);

  const [loading, setLoading] = useState(isUpdate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '', // comma separated string for easy entry
    salary: '',
    jobType: 'Full-time',
    experienceRequired: '0-1 year',
    longitude: '',
    latitude: '',
    location: '',
    status: 'open',
  });

  useEffect(() => {
    if (isUpdate) {
      const fetchJob = async () => {
        try {
          const { data } = await api.get(`/jobs/${id}`);
          const job = data.data;
          setFormData({
            title: job.title || '',
            description: job.description || '',
            requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : '',
            salary: job.salary || '',
            jobType: job.jobType || 'Full-time',
            experienceRequired: job.experienceRequired || '0-1 year',
            longitude: job.location?.coordinates?.[0] || '',
            latitude: job.location?.coordinates?.[1] || '',
            location: job.location?.address || '',
            status: job.status || 'open',
          });
        } catch (err) {
          setError('Failed to fetch job details for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isUpdate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Backend array validation requires array
    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter((s) => s !== ''),
      salary: formData.salary ? Number(formData.salary) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined,
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      address: formData.location, // Mapping the text input 'location' to 'address' for the backend
    };

    if (!payload.title || !payload.description || payload.requiredSkills.length === 0) {
      return setError('Title, description, and at least one skill are required.');
    }

    setSaving(true);

    try {
      if (isUpdate) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading form...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/recruiter/jobs" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-6">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Job Management
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isUpdate ? 'Edit Job Posting' : 'Create New Job Posting'}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Job Title *"
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Backend Developer"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Detail the responsibilities and daily tasks..."
            />
          </div>

          <Input
            label="Required Skills (Comma separated) *"
            id="requiredSkills"
            name="requiredSkills"
            type="text"
            value={formData.requiredSkills}
            onChange={handleChange}
            placeholder="e.g. Node.js, MongoDB, React"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Salary (USD)"
              id="salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 120000"
            />

            <Input
              label="Location (Address/City)"
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY"
            />

            <Input
              label="Longitude *"
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="e.g. -74.0060"
              required
            />
            
            <Input
              label="Latitude *"
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="e.g. 40.7128"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience Required</label>
              <select
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="0-1 year">0-1 year</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>

            {isUpdate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold"
                >
                  <option value="open">Open (Accepting Applicants)</option>
                  <option value="closed">Closed (Not Accepting)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition-colors disabled:opacity-70"
            >
              {saving ? 'Saving...' : (isUpdate ? 'Update Job' : 'Post Job')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
