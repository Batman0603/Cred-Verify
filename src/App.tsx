import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import MerchantDashboard from './pages/MerchantDashboard';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import UniversityDashboard from './pages/UniversityDashboard';

const App = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route
        path="/university/dashboard"
        element={
          <ProtectedRoute requiredRole="university">
            <UniversityDashboard view="dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university/credentials"
        element={
          <ProtectedRoute requiredRole="university">
            <UniversityDashboard view="credentials" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard view="dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/credentials"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard view="credentials" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/dashboard"
        element={
          <ProtectedRoute requiredRole="merchant">
            <MerchantDashboard view="dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/credentials"
        element={
          <ProtectedRoute requiredRole="merchant">
            <MerchantDashboard view="credentials" />
          </ProtectedRoute>
        }
      />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
