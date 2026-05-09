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
    skills: '', // we will split by comma on submit
    preferredSalary: '',
    preferredJobType: 'Full-time',
    bio: '',
    availabilityStatus: 'Available',
    education: [],
    experience: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/employee-profiles/me');
        if (data.data) {
          setIsUpdate(true);
          const p = data.data;
          setFormData({
            skills: p.skills ? p.skills.join(', ') : '',
            preferredSalary: p.preferredSalary || '',
            preferredJobType: p.preferredJobType || 'Full-time',
            bio: p.bio || '',
            availabilityStatus: p.availabilityStatus || 'Available',
            education: p.education || [],
            experience: p.experience || [],
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

  // Complex array handlers
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', year: '' }],
    });
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...formData.education];
    newEdu[index][field] = value;
    setFormData({ ...formData, education: newEdu });
  };

  const removeEducation = (index) => {
    const newEdu = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEdu });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { jobTitle: '', company: '', duration: '', description: '' }],
    });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...formData.experience];
    newExp[index][field] = value;
    setFormData({ ...formData, experience: newExp });
  };

  const removeExperience = (index) => {
    const newExp = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExp });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()).filter((s) => s !== ''),
      preferredSalary: formData.preferredSalary ? Number(formData.preferredSalary) : undefined,
    };

    try {
      if (isUpdate) {
        await api.put('/employee-profiles/me', payload);
      } else {
        await api.post('/employee-profiles', payload);
      }
      navigate('/employee/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please check your inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading form...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-10 my-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isUpdate ? 'Edit Profile' : 'Create Profile'}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Preferred Salary (USD)"
              id="preferredSalary"
              name="preferredSalary"
              type="number"
              value={formData.preferredSalary}
              onChange={handleChange}
              placeholder="e.g. 50000"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
              <select
                name="preferredJobType"
                value={formData.preferredJobType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability</label>
              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Actively Looking">Actively Looking</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Skills (Comma separated)"
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js"
              />
            </div>

            <div className="sm:col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Tell us a little about yourself"
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Experience</h2>
            <button type="button" onClick={addExperience} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              + Add Role
            </button>
          </div>
          
          {formData.experience.map((exp, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative bg-gray-50 dark:bg-gray-800/50">
              <button type="button" onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">
                Remove
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Job Title" value={exp.jobTitle} onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)} />
                <Input label="Company" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} />
                <Input label="Duration" placeholder="e.g. 2020 - 2022" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} />
                <div className="sm:col-span-2">
                  <Input label="Description" value={exp.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Education</h2>
            <button type="button" onClick={addEducation} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              + Add Education
            </button>
          </div>
          
          {formData.education.map((edu, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative bg-gray-50 dark:bg-gray-800/50">
              <button type="button" onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">
                Remove
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <Input label="Degree" placeholder="e.g. B.S. Comp Sci" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} />
                </div>
                <div className="sm:col-span-1">
                  <Input label="Institution" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} />
                </div>
                <div className="sm:col-span-1">
                  <Input label="Year" placeholder="e.g. 2023" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
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
