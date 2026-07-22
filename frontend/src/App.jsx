import { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { getToken, clearToken } from './api';

export default function App() {
  const [username, setUsername] = useState(() => {
    if (getToken()) {
      return localStorage.getItem('username') || '';
    }
    return '';
  });

  function handleLogin(name) {
    localStorage.setItem('username', name);
    setUsername(name);
  }

  function handleLogout() {
    clearToken();
    localStorage.removeItem('username');
    setUsername('');
  }

  if (!getToken() || !username) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard username={username} onLogout={handleLogout} />;
}
