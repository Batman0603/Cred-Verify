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
