import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StatusBadge from './StatusBadge';

const roleTone = {
  student: 'blue',
  university: 'green',
  merchant: 'amber',
} as const;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-blue-700 px-6 text-white shadow-lg">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-blue-100">Decentralized Credential Network</p>
        <h1 className="text-lg font-semibold">CredVerify Platform</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-lg border border-blue-200/60 bg-blue-600 px-3 py-2 text-sm transition hover:bg-blue-500"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div className="text-right">
          <p className="text-sm font-semibold capitalize">{user?.name}</p>
          {user && <StatusBadge label={user.role} tone={roleTone[user.role]} />}
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-blue-200/60 bg-blue-600 px-3 py-2 text-sm transition hover:bg-blue-500"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
