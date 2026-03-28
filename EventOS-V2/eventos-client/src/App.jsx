import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AuthPage from './pages/AuthPage';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateEvent from './pages/organizer/CreateEvent';
import EventManagement from './pages/organizer/EventManagement';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerWorkspace from './pages/volunteer/VolunteerWorkspace';
import AttendeeDashboard from './pages/attendee/AttendeeDashboard';
import EventCatalog from './pages/attendee/EventCatalog';
import EventDetail from './pages/attendee/EventDetail';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-brand-surface">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Dashboard Routes */}
            <Route path="/*" element={
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
                <Routes>
                  {/* Organizer Routes */}
                  <Route path="organizer/dashboard" element={<OrganizerDashboard />} />
                  <Route path="organizer/events/new" element={<CreateEvent />} />
                  <Route path="organizer/events/:id" element={<EventManagement />} />
                  
                  {/* Attendee & Public Routes */}
                  <Route path="events" element={<EventCatalog />} />
                  <Route path="events/:slug" element={<EventDetail />} />
                  <Route path="attendee/dashboard" element={<AttendeeDashboard />} />
                  <Route path="volunteer/dashboard" element={<VolunteerDashboard />} />
                  <Route path="volunteer/workspace/:id" element={<VolunteerWorkspace />} />
                </Routes>
              </div>
            } />
          </Routes>
        </main>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
