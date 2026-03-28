import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-black text-purple-500/20 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400">The event page you're looking for doesn't exist.</p>
      </div>
    </div>
  );
}
