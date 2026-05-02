import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Units from './pages/Units';
import Collections from './pages/Collections';
import Expenses from './pages/Expenses';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in with Firebase
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata?.creationTime
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData);
      } else {
        // Check if user is logged in as guest
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      }
      setIsLoading(false);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark' ? 'dark' : 'light');

    return unsubscribe;
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveNav('dashboard');
    else if (path === '/tenants') setActiveNav('tenants');
    else if (path === '/units') setActiveNav('units');
    else if (path === '/collections') setActiveNav('collections');
    else if (path === '/expenses') setActiveNav('expenses');
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      // Sign out from Firebase if user is authenticated via Firebase
      if (currentUser?.uid && !currentUser?.isGuest) {
        await signOut(auth);
      }
      // Clear localStorage
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  if (isLoading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (!currentUser) {
    return (
      <div className="App" dir="rtl">
        <Login onLogin={setCurrentUser} />
      </div>
    );
  }

  return (
    <div className="App" dir="rtl">
      <nav className="navbar">
        <div className="nav-header">
          <h1 className="app-title">🏢 تطبيق إدارة العقارات</h1>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${activeNav === 'dashboard' ? 'active' : ''}`}
          >
            📊 لوحة التحكم
          </Link>
          <Link 
            to="/tenants" 
            className={`nav-link ${activeNav === 'tenants' ? 'active' : ''}`}
          >
            👥 المستأجرين
          </Link>
          <Link 
            to="/units" 
            className={`nav-link ${activeNav === 'units' ? 'active' : ''}`}
          >
            🏠 الوحدات
          </Link>
          <Link 
            to="/expenses" 
            className={`nav-link ${activeNav === 'expenses' ? 'active' : ''}`}
          >
            💸 المصروفات
          </Link>
          <Link 
            to="/collections" 
            className={`nav-link ${activeNav === 'collections' ? 'active' : ''}`}
          >
            💰 التحصيل
          </Link>
          <button type="button" className="btn btn-theme" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ وضع النهار' : '🌙 وضع الليل'}
          </button>
          <div className="user-info-menu">
            <span className="user-email">{currentUser?.displayName || currentUser?.email}</span>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 تسجيل الخروج
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/units" element={<Units />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/collections" element={<Collections />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
