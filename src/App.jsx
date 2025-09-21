
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Tasks from './components/Tasks/Page';
import Profile from './components/Profile/Profile';
import AIDashboard from './components/AI/AiDashboard.jsx';
import FloatingChat from './components/AI/FloatingChat.jsx';
import TokenGuard from './utils/validateToken.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/tasks" element={<TokenGuard><Tasks/></TokenGuard>} />
        <Route path="/profile" element={<TokenGuard><Profile/></TokenGuard>} />
        <Route path="/ai" element={<TokenGuard><AIDashboard/></TokenGuard>} />
      </Routes>
      
      {/* Floating Chat - Available on all authenticated pages */}
      <TokenGuard>
        <FloatingChat />
      </TokenGuard>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          color: '#f8fafc'
        }}
        progressStyle={{
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'
        }}
      />
    </BrowserRouter>
  );
}