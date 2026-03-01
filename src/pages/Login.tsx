import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { dashboardRouteByRole, useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const isRole = (value: string | null): value is UserRole =>
  value === 'student' || value === 'university' || value === 'merchant';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get('role');
  const role = isRole(selectedRole) ? selectedRole : null;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const title = useMemo(() => {
    if (role === 'student') return 'Student Login';
    if (role === 'university') return 'University Login';
    if (role === 'merchant') return 'Merchant Login';
    return 'Login';
  }, [role]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const loggedRole = await login(form.email, form.password);
      if (role && loggedRole !== role) {
        throw new Error(`Selected role is ${role}, but account role is ${loggedRole}.`);
      }
      navigate(dashboardRouteByRole(loggedRole));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
      <form onSubmit={submit} className="glass w-full p-8">
        <h1 className="mb-1 text-3xl font-black uppercase">{title}</h1>
        <p className="mb-6 text-sm font-semibold uppercase text-slate-600 dark:text-slate-300">
          {role ? `Role selected: ${role}` : 'Choose role from home first'}
        </p>
        <div className="space-y-4">
          <input className="w-full border-4 border-black bg-white px-4 py-3 font-semibold dark:border-slate-200 dark:bg-slate-800" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          <input className="w-full border-4 border-black bg-white px-4 py-3 font-semibold dark:border-slate-200 dark:bg-slate-800" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
          {error && <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>}
          <button className="brutal-btn w-full" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
          {role === 'merchant' && (
            <p className="text-center text-sm font-semibold">
              New merchant?{' '}
              <Link to="/register?role=merchant" className="underline">
                Sign up
              </Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
