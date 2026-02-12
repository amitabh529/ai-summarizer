import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Langdingpage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Header from './components/landing/Header';
import DashboardPage from './pages/Dashboard';
import MainWorkspacePage from './pages/MainWorkspacePage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <div className="overflow-y-scroll [&::-webkit-scrollbar]:hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <LandingPage />
            </>
          } />
          <Route path="/login" element={
            <>
              <Header />
              <LoginPage />
            </>
          } />
          <Route path="/signup" element={
            <>
              <Header />
              <SignupPage />
            </>
          } />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute />}
          >
            <Route index element={<DashboardPage />} />
            <Route path="workspace" element={<MainWorkspacePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
