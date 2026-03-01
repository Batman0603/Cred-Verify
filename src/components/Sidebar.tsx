import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';

const linksByRole: Record<UserRole, { label: string; to: string }[]> = {
  university: [
    { label: 'Dashboard', to: '/university/dashboard' },
    { label: 'Credentials', to: '/university/credentials' },
    { label: 'My Credentials', to: '/university/my-credentials' },
  ],
  student: [
    { label: 'Dashboard', to: '/student/dashboard' },
    { label: 'My Credentials', to: '/student/my-credentials' },
  ],
  merchant: [
    { label: 'Dashboard', to: '/merchant/dashboard' },
    { label: 'Credentials', to: '/merchant/credentials' },
    { label: 'My Credentials', to: '/merchant/my-credentials' },
  ],
};

const Sidebar = ({ role }: { role: UserRole }) => (
  <aside className="hidden w-64 border-4 border-black bg-white p-4 dark:border-slate-200 dark:bg-slate-900 md:block">
    <h2 className="mb-4 text-lg font-black uppercase">Navigation</h2>
    <nav className="space-y-2">
      {linksByRole[role].map((link) => (
        <NavLink
          key={`${role}-${link.label}`}
          to={link.to}
          className={({ isActive }) =>
            `block border-4 px-3 py-2 text-sm font-bold uppercase transition ${
              isActive
                ? 'border-black bg-black text-white dark:border-slate-200 dark:bg-slate-200 dark:text-black'
                : 'border-black bg-white hover:bg-slate-100 dark:border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800'
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
