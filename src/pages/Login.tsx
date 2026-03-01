import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardRouteByRole, useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const role = await login(form.email, form.password);
      navigate(dashboardRouteByRole(role));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Login to CredVerify</h1>
        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
          Login route goes to role-specific dashboard.
        </p>
        <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
          Demo issuer account: admin@gmail.com / admin123
        </p>
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          {error && <p className="text-sm text-rose-500 dark:text-rose-300">{error}</p>}
          <button className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Need a merchant account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-cyan-300">
              Register Merchant
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
