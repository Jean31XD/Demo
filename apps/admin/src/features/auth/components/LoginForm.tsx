import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, LogIn } from 'lucide-react';
import { LOGIN } from '@/graphql/mutations/auth.mutations';
import { useAuthStore } from '@/store/auth.store';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail]       = useState('demo@ferreteria.com');
  const [password, setPassword] = useState('demo1234');
  const [fieldError, setFieldError] = useState('');

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted(data) {
      const { token, customer } = data.login;
      setAuth(token, { id: customer.id, email: customer.email, name: customer.name });
      navigate('/', { replace: true });
    },
    onError(err) {
      setFieldError(err.graphQLErrors[0]?.message ?? 'Error al iniciar sesión');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError('');
    if (!email || !password) { setFieldError('Completa todos los campos'); return; }
    login({ variables: { email, password } });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="section-label"
          style={{ color: 'var(--muted)' }}
        >
          Correo electrónico
        </label>
        <div className="relative">
          <Mail
            size={14}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--faint)' }}
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="usuario@ferreteria.com"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="section-label"
          style={{ color: 'var(--muted)' }}
        >
          Contraseña
        </label>
        <div className="relative">
          <Lock
            size={14}
            strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--faint)' }}
          />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>
      </div>

      {fieldError && (
        <div
          role="alert"
          className="flex items-center gap-2 px-3 py-2.5"
          style={{
            background: 'var(--fail-pale)',
            border: '1px solid var(--fail-border)',
            color: 'var(--fail)',
          }}
        >
          <AlertCircle size={13} strokeWidth={2} />
          <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{fieldError}</span>
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary py-3 mt-1 w-full justify-center">
        <LogIn size={14} strokeWidth={2} />
        <span>{loading ? 'Autenticando...' : 'Acceder al sistema'}</span>
      </button>

      <p className="text-center mono-tag" style={{ opacity: 0.55 }}>
        demo@ferreteria.com · demo1234
      </p>
    </form>
  );
};

export default LoginForm;
