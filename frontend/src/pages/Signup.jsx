import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'employee',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      return setError('Name, email, and password are required');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setIsSubmitting(true);
      const res = await signup(formData);
      navigate(`/${res.data.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create an account</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Join AI JobConnect to find work or hire talent
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
        />
        
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        
        <Input
          label="Phone (Optional)"
          id="phone"
          name="phone"
          type="tel"
          placeholder="+1 234 567 890"
          value={formData.phone}
          onChange={handleChange}
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            I want to...
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`border rounded-lg p-3 cursor-pointer text-center transition-colors ${
                formData.role === 'employee'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="employee"
                checked={formData.role === 'employee'}
                onChange={handleChange}
                className="hidden"
              />
              <span className="font-semibold block">Find Work</span>
              <span className="text-xs opacity-80">(Employee)</span>
            </label>
            <label
              className={`border rounded-lg p-3 cursor-pointer text-center transition-colors ${
                formData.role === 'recruiter'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={formData.role === 'recruiter'}
                onChange={handleChange}
                className="hidden"
              />
              <span className="font-semibold block">Hire Talent</span>
              <span className="text-xs opacity-80">(Recruiter)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
