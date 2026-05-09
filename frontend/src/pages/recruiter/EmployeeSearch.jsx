import { useState, useEffect } from 'react';
import api from '../../services/api';
import EmployeeCard from '../../components/EmployeeCard';

const EmployeeSearch = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Default filters with generic coordinates if none provided
  const [filters, setFilters] = useState({
    lat: '40.7128', // Default to NYC for testing purposes
    lng: '-74.0060',
    radius: '50',
    skills: '',
    availability: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!filters.lat || !filters.lng) {
      return setError('Latitude and Longitude are required for geospatial search.');
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const { data } = await api.get('/search/employees', { params: filters });
      setEmployees(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search employees.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Try to get user's location automatically on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFilters((prev) => ({
          ...prev,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString()
        }));
      });
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Search Filters Sidebar */}
      <div className="w-full md:w-80 shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Search Filters</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
                <input
                  type="text"
                  name="lat"
                  value={filters.lat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="40.7128"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
                <input
                  type="text"
                  name="lng"
                  value={filters.lng}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="-74.0060"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Radius (km)</label>
              <input
                type="range"
                name="radius"
                min="1"
                max="500"
                value={filters.radius}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              />
              <div className="text-right text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
                {filters.radius} kilometers
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="React, Node, Construction..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability Status</label>
              <select
                name="availability"
                value={filters.availability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Any Status</option>
                <option value="Available">Available</option>
                <option value="Actively Looking">Actively Looking</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-70"
            >
              {loading ? 'Searching...' : 'Find Candidates'}
            </button>
          </form>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Nearby Talent</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

        {!hasSearched ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center border border-gray-100 dark:border-gray-700">
            <svg className="w-16 h-16 mx-auto text-blue-500 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to search</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Use the filters on the left to find skilled candidates within your area. Our geospatial engine will map the closest matches instantly.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-64 animate-pulse border border-gray-100 dark:border-gray-700">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="flex gap-2"><div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div></div>
              </div>
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No matches found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              We couldn't find any candidates matching your exact criteria. Try expanding your search radius or removing some skill filters.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
              Showing {employees.length} candidate{employees.length !== 1 ? 's' : ''} in your area
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <EmployeeCard key={employee._id} employee={employee} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default EmployeeSearch;
