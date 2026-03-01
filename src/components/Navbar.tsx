import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b-4 border-black bg-white px-6 py-4 dark:border-slate-200 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">CredVerify</p>
          <h1 className="text-2xl font-black uppercase">{user?.role} Board</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="brutal-btn text-xs">
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <div className="border-4 border-black px-3 py-2 text-xs font-bold uppercase dark:border-slate-200">
            {user?.name}
          </div>
          <button onClick={logout} className="brutal-btn text-xs">Logout</button>
        </div>
import StatusBadge from './StatusBadge';

const roleTone = {
  student: 'blue',
  university: 'green',
  merchant: 'amber',
} as const;

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass sticky top-0 z-20 flex h-16 items-center justify-between px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Decentralized Credential Network</p>
        <h1 className="text-lg font-semibold">CredVerify Platform</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold capitalize">{user?.name}</p>
          {user && <StatusBadge label={user.role} tone={roleTone[user.role]} />}
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm transition hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
