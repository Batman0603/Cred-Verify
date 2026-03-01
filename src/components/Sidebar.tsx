import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';

const linksByRole: Record<UserRole, { label: string; to: string }[]> = {
  university: [
    { label: 'Dashboard', to: '/university' },
    { label: 'Issue Credentials', to: '/university' },
  ],
  student: [
    { label: 'Dashboard', to: '/student' },
    { label: 'My Credentials', to: '/student' },
  ],
  merchant: [
    { label: 'Verifier', to: '/merchant' },
    { label: 'Public Validation', to: '/merchant' },
  ],
};

const Sidebar = ({ role }: { role: UserRole }) => (
  <aside className="glass hidden min-h-[calc(100vh-4rem)] w-64 p-4 md:block">
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-300">Navigation</h2>
    <nav className="space-y-2">
      {linksByRole[role].map((link) => (
        <NavLink
          key={`${role}-${link.label}`}
          to={link.to}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm transition ${
              isActive ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:bg-white/10'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
