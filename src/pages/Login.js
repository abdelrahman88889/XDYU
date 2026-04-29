import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    // التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('البريد الإلكتروني غير صحيح');
      return;
    }

    // الحصول على المستخدمين من localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === email);

    if (isNewUser) {
      // مستخدم جديد
      if (user) {
        setError('هذا البريد الإلكتروني موجود بالفعل');
        return;
      }
      
      user = {
        id: Date.now(),
        email,
        password, // في تطبيق حقيقي، يجب تشفير كلمة المرور
        createdAt: new Date().toLocaleDateString('ar-SA')
      };
      
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin(user);
    } else {
      // مستخدم موجود
      if (!user || user.password !== password) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return;
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLogin(user);
    }
  };

  const handleGuest = () => {
    const guestUser = {
      id: 'guest-' + Date.now(),
      email: 'ضيف',
      isGuest: true
    };
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    onLogin(guestUser);
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setError('');
    
    // محاكاة تسجيل دخول اجتماعي
    const socialEmails = {
      google: `user_${Date.now()}@gmail.com`,
      facebook: `user_${Date.now()}@facebook.com`,
      microsoft: `user_${Date.now()}@outlook.com`
    };

    const socialUser = {
      id: Date.now(),
      email: socialEmails[provider],
      password: 'social_auth',
      provider: provider,
      createdAt: new Date().toLocaleDateString('ar-SA'),
      isSocial: true
    };

    // إضافة المستخدم إلى قائمة المستخدمين
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.find(u => u.email === socialUser.email)) {
      users.push(socialUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    setTimeout(() => {
      localStorage.setItem('currentUser', JSON.stringify(socialUser));
      setLoading(false);
      onLogin(socialUser);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🏢 نظام إدارة العقارات</h1>
          <p className="login-subtitle">مرحباً بك في نظام التحصيل والإدارة</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <h2>{isNewUser ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
          
          {error && <div className="error-message">⚠️ {error}</div>}

          <div className="form-group">
            <label>البريد الإلكتروني *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>كلمة المرور *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            {isNewUser ? '✓ إنشاء الحساب' : '✓ تسجيل الدخول'}
          </button>

          <button type="button" className="btn btn-secondary btn-large" onClick={handleGuest}>
            👤 متابعة كضيف
          </button>

          <div className="social-login-divider">
            <span>أو سجل دخول باستخدام</span>
          </div>

          <div className="social-login-buttons">
            <button 
              type="button" 
              className="btn btn-social btn-google" 
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <span className="google-icon">🔍</span> Google
            </button>
            <button 
              type="button" 
              className="btn btn-social btn-facebook" 
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
            >
              <span className="facebook-icon">👍</span> Facebook
            </button>
            <button 
              type="button" 
              className="btn btn-social btn-microsoft" 
              onClick={() => handleSocialLogin('microsoft')}
              disabled={loading}
            >
              <span className="microsoft-icon">Ⓜ️</span> Microsoft
            </button>
          </div>

          <div className="toggle-mode">
            {isNewUser ? (
              <>
                هل لديك حساب؟{' '}
                <button type="button" onClick={() => { setIsNewUser(false); setError(''); }}>
                  تسجيل الدخول
                </button>
              </>
            ) : (
              <>
                ليس لديك حساب؟{' '}
                <button type="button" onClick={() => { setIsNewUser(true); setError(''); }}>
                  إنشاء حساب جديد
                </button>
              </>
            )}
          </div>
        </form>

        <div className="login-info">
          <p>⚠️ ملاحظة: يمكنك استخدام أي بريد إلكتروني لإنشاء حساب تجريبي</p>
          <p>مثال: admin@test.com</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
