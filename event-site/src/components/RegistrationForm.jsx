import { useState } from 'react';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';

export default function RegistrationForm({ eventId }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    numberOfPeople: 1
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/registrations/event/${eventId}`,
        form
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">You're registered!</h3>
        <p className="text-gray-400">Check your email for confirmation details.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <input name="name" placeholder="Full Name *" required onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 outline-none transition-colors" />
      <input name="email" type="email" placeholder="Email Address *" required onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 outline-none transition-colors" />
      <input name="phone" placeholder="Phone Number" onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 outline-none transition-colors" />
      <input name="organization" placeholder="College / Organization" onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 outline-none transition-colors" />
      <select name="numberOfPeople" onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 outline-none transition-colors">
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} person{n > 1 ? 's' : ''}</option>)}
      </select>
      {error && <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50">
        {loading ? 'Registering...' : 'Register Now'}
      </button>
    </form>
  );
}
