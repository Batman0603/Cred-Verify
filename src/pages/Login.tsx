import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/role-select');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Login to CredVerify</h1>
        <p className="mb-6 text-sm text-slate-400">Access your decentralized credential workspace.</p>
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
          <p className="text-center text-sm text-slate-400">
            Need an account? <Link to="/register" className="text-cyan-300">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
