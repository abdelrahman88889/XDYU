import React, { useState } from 'react';
import '../new_login_styles.css';
import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('social'); // 'social', 'email', 'phone'

  // Firebase providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const appleProvider = new OAuthProvider('apple.com');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('البريد الإلكتروني غير صحيح');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isNewUser) {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          method: 'email',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          method: 'email',
          createdAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        onLogin(userData);
      } else {
        // Sign in existing user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data() || {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0]
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        onLogin(userData);
      }
    } catch (error) {
      let errorMessage = 'حدث خطأ في العملية';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'لم يتم العثور على هذا البريد الإلكتروني';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور غير صحيحة';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'هذا البريد الإلكتروني موجود بالفعل';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل)';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صحيح';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    const guestUser = {
      uid: 'guest-' + Date.now(),
      email: 'ضيف',
      isGuest: true,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    onLogin(guestUser);
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError('');

    let authProvider;
    let providerName;

    switch (provider) {
      case 'google':
        authProvider = googleProvider;
        providerName = 'google';
        break;
      case 'facebook':
        authProvider = facebookProvider;
        providerName = 'facebook';
        break;
      case 'apple':
        authProvider = appleProvider;
        providerName = 'apple';
        break;
      case 'microsoft':
        authProvider = new OAuthProvider('microsoft.com');
        authProvider.addScopes('profile', 'email');
        providerName = 'microsoft';
        break;
      default:
        setError('مزود الخدمة غير معروف');
        setLoading(false);
        return;
    }

    try {
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          method: providerName,
          provider: provider,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        // Update last login time
        await setDoc(
          userDocRef,
          {
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          { merge: true }
        );
      }

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        method: providerName,
        provider: provider,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      onLogin(userData);
    } catch (error) {
      let errorMessage = 'فشل تسجيل الدخول عبر ' + provider;
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'تم إغلاق نافذة تسجيل الدخول';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'هذا الحساب موجود بالفعل مع طريقة دخول مختلفة';
      }
      
      setError(errorMessage);
      console.error('Social login error:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-page">
      <div className="login-modal">
        <button className="close-btn" onClick={handleGuest}>✕</button>

        <div className="login-content">
          <h1 className="login-modal-title">تسجيل الدخول أو إنشاء حساب</h1>
          <p className="login-modal-subtitle">ستحصل على جميع أدوات إدارة العقارات بعد تسجيل الدخول.</p>

          {error && <div className="error-alert">⚠️ {error}</div>}

          {loginMethod === 'social' && (
            <>
              <div className="social-buttons-container">
                <button
                  type="button"
                  className="social-btn google-btn"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <span className="social-icon">🔍</span>
                  <span>المتابعة باستخدام حساب Google</span>
                </button>

                <button
                  type="button"
                  className="social-btn apple-btn"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={loading}
                >
                  <span className="social-icon">🍎</span>
                  <span>المتابعة باستخدام حساب Apple</span>
                </button>

                <button
                  type="button"
                  className="social-btn facebook-btn"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                >
                  <span className="social-icon">f</span>
                  <span>المتابعة باستخدام حساب Facebook</span>
                </button>

                <button
                  type="button"
                  className="social-btn microsoft-btn"
                  onClick={() => handleSocialLogin('microsoft')}
                  disabled={loading}
                >
                  <span className="social-icon">⊞</span>
                  <span>المتابعة باستخدام حساب Microsoft</span>
                </button>

                <button
                  type="button"
                  className="social-btn email-btn"
                  onClick={() => setLoginMethod('email')}
                  disabled={loading}
                >
                  <span className="social-icon">✉️</span>
                  <span>المتابعة باستخدام البريد الإلكتروني</span>
                </button>
              </div>

              <div className="divider-container">
                <span className="divider-text">أو</span>
              </div>
            </>
          )}

          {loginMethod === 'email' && (
            <>
              <div className="back-button-container">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => {
                    setLoginMethod('social');
                    setError('');
                    setEmail('');
                    setPassword('');
                  }}
                >
                  ← رجوع
                </button>
              </div>

              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="example@email.com"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="button"
                className="continue-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'جاري المعالجة...' : (isNewUser ? 'إنشاء الحساب' : 'تسجيل الدخول')}
              </button>

              <div className="toggle-account-mode">
                {isNewUser ? (
                  <>
                    هل لديك حساب؟{' '}
                    <button 
                      type="button" 
                      onClick={() => { 
                        setIsNewUser(false); 
                        setError(''); 
                      }}
                      disabled={loading}
                    >
                      تسجيل الدخول
                    </button>
                  </>
                ) : (
                  <>
                    ليس لديك حساب؟{' '}
                    <button 
                      type="button" 
                      onClick={() => { 
                        setIsNewUser(true); 
                        setError(''); 
                      }}
                      disabled={loading}
                    >
                      إنشاء حساب جديد
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          <button
            type="button"
            className="guest-continue-btn"
            onClick={handleGuest}
            disabled={loading}
          >
            متابعة كضيف
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
