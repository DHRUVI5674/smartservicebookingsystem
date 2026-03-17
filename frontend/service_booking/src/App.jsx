import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { GlobalProvider, useGlobal } from './context/GlobalContext';
import ProtectedRoute from './components/ProtectedRoute';

function Navbar() {
  const { user, notifications, logout } = useGlobal();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">S</div>
          <span className="text-slate-900">Service<span className="text-indigo-600">Hub</span></span>
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors">Home</Link>
          <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors">Dashboard</Link>
          
          <div className="h-6 w-px bg-slate-200 mx-2"></div>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="relative">
                <span className="text-xl cursor-default">🔔</span>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    {notifications}
                  </span>
                )}
              </div>
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={logout}
                className="text-slate-500 hover:text-red-600 text-sm font-bold transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors mt-2">Login</Link>
              <Link to="/signup" className="btn btn-primary text-sm px-6 py-2.5">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-6 flex justify-center gap-8">
           <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Privacy</a>
           <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Terms</a>
           <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Support</a>
        </div>
        <p className="text-slate-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} ServiceHub System. Empowering local expertise.
        </p>
      </div>
    </footer>
  );
}

const AppWrapper = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </GlobalProvider>
  );
}
