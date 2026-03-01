import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { dashboardRouteByRole, useAuth } from '../context/AuthContext';

const Register = () => {
  const { registerMerchant, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('role') !== 'merchant') {
      navigate('/login?role=merchant', { replace: true });
    }
  }, [navigate, searchParams]);

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
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
      <form onSubmit={submit} className="glass w-full p-8">
        <h1 className="mb-1 text-3xl font-black uppercase">Merchant Signup</h1>
        <p className="mb-6 text-sm font-semibold uppercase text-slate-600 dark:text-slate-300">
          Only merchants can create accounts from signup.
        </p>
        <div className="space-y-4">
          <input className="w-full border-4 border-black bg-white px-4 py-3 font-semibold dark:border-slate-200 dark:bg-slate-800" placeholder="Full name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          <input className="w-full border-4 border-black bg-white px-4 py-3 font-semibold dark:border-slate-200 dark:bg-slate-800" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          <input className="w-full border-4 border-black bg-white px-4 py-3 font-semibold dark:border-slate-200 dark:bg-slate-800" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
          {error && <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>}
          <button className="brutal-btn w-full" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Merchant Account'}</button>
          <p className="text-center text-sm font-semibold">
            Already have merchant account? <Link to="/login?role=merchant" className="underline">Login</Link>
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await register(form.name, form.email, form.password);
    navigate('/role-select');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="mb-6 text-sm text-slate-400">Start issuing and verifying secure credentials.</p>
        <div className="space-y-4">
          <input
            className="w-full rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
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
          <button className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Register'}
          </button>
          <p className="text-center text-sm text-slate-400">
            Already registered? <Link to="/login" className="text-cyan-300">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
