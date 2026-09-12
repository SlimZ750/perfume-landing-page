import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import LandingPage from './components/LandingPage';
import Dashboard from './dashboard/Dashboard';
import Login from './dashboard/Login';
import ProtectedRoute from './dashboard/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LandingContentProvider } from './context/LandingContentContext';

const App: React.FC = () => (
  <AuthProvider>
    <LandingContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </LandingContentProvider>
  </AuthProvider>
);

export default App;
