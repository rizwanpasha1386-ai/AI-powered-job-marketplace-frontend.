import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Workspace = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';
  
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Rating states
  const [ratingData, setRatingData] = useState({ rating: 5, feedback: '' });
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const messagesEndRef = useRef(null);

  const fetchWorkspaceData = async () => {
    try {
      const [sessionRes, messagesRes] = await Promise.all([
        api.get(`/work-sessions/${id}`),
        api.get(`/work-sessions/${id}/messages`)
      ]);
      setSession(sessionRes.data.data);
      setMessages(messagesRes.data.data);
    } catch (err) {
      setError('Failed to load workspace data. You may not have permission.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
    // In a real app, you would use WebSockets here. For hackathon, manual refresh is fine.
  }, [id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const { data } = await api.post(`/work-sessions/${id}/messages`, { message: newMessage });
      setMessages([...messages, data.data]);
      setNewMessage('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const handleMarkComplete = async () => {
    if (!window.confirm('Are you sure you want to mark this work as completed?')) return;
    try {
      const { data } = await api.put(`/work-sessions/${id}/status`, { status: 'completed' });
      setSession(data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setRatingError('');
    
    const toUserId = isRecruiter ? session.employee.user._id : session.recruiter.user._id;

    try {
      await api.post('/ratings', {
        workSessionId: id,
        toUserId,
        rating: ratingData.rating,
        feedback: ratingData.feedback
      });
      setRatingSubmitted(true);
    } catch (err) {
      setRatingError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading Workspace...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!session) return null;

  const counterpartName = isRecruiter ? session.employee.user.name : session.recruiter.user.name;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {session.job.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Working with <span className="font-bold text-gray-800 dark:text-gray-200">{counterpartName}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-xs uppercase font-bold rounded-full ${
              session.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
              session.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {session.status}
            </span>
            {session.status === 'active' && isRecruiter && (
              <button
                onClick={handleMarkComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Mark as Completed
              </button>
            )}
            {session.status === 'completed' && !isRecruiter && (
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Work completed by recruiter
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Workspace Chat</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                No messages yet. Say hello!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender._id === user._id;
                return (
                  <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
                      {isMe ? 'You' : msg.sender.name}
                    </span>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-bl-none shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Actions / Rating */}
        {session.status === 'completed' && (
          <div className="lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 shrink-0 h-fit">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Leave a Rating</h2>
            {ratingSubmitted ? (
              <div className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-lg text-sm text-center font-medium">
                Thank you! Your feedback has been submitted successfully.
              </div>
            ) : (
              <form onSubmit={handleSubmitRating} className="space-y-4">
                {ratingError && <div className="text-red-500 text-xs bg-red-50 p-2 rounded">{ratingError}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5) *</label>
                  <select
                    value={ratingData.rating}
                    onChange={(e) => setRatingData({ ...ratingData, rating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} Stars</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback</label>
                  <textarea
                    value={ratingData.feedback}
                    onChange={(e) => setRatingData({ ...ratingData, feedback: e.target.value })}
                    rows="3"
                    placeholder="How was it working together?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Submit Rating
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
