import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardRouteByRole, useAuth } from '../context/AuthContext';

const Register = () => {
  const { registerMerchant, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const role = await registerMerchant(form.name, form.email, form.password);
      navigate(dashboardRouteByRole(role));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Merchant Registration</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Register page is restricted to creating merchant users only.
        </p>
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
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
            {isLoading ? 'Creating...' : 'Register Merchant'}
          </button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 dark:text-cyan-300">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
