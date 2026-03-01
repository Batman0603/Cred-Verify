import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const roles: { role: UserRole; title: string; subtitle: string }[] = [
  { role: 'student', title: 'Student', subtitle: 'View credentials and share QR proof' },
  { role: 'university', title: 'University', subtitle: 'Issue, anchor, and revoke credentials' },
  { role: 'merchant', title: 'Merchant', subtitle: 'Verify credentials in real-time' },
];

const RoleSelector = () => {
  const { setRole, user } = useAuth();
  const navigate = useNavigate();

  const pickRole = (role: UserRole) => {
    setRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center px-6">
      <div className="w-full">
        <h1 className="mb-2 text-3xl font-bold">Choose your demo role</h1>
        <p className="mb-8 text-slate-300">Signed in as {user?.email}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((item) => (
            <button
              key={item.role}
              onClick={() => pickRole(item.role)}
              className="glass rounded-2xl p-6 text-left transition hover:-translate-y-1 hover:shadow-glow"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{item.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
