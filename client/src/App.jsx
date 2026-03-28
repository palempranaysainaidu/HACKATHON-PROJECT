import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import BuilderPage from './pages/BuilderPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import BudgetPage from './pages/BudgetPage';
import EmailsPage from './pages/EmailsPage';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/builder" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
        <Route path="/dashboard/:eventId" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/:eventId/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
        <Route path="/dashboard/:eventId/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
        <Route path="/dashboard/:eventId/emails" element={<ProtectedRoute><EmailsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
