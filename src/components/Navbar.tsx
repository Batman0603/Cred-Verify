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
      </div>
    </header>
  );
};

export default Navbar;
