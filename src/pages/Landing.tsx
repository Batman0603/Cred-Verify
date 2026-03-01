import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const roleCards: { role: UserRole; title: string; desc: string }[] = [
  { role: 'student', title: 'Student', desc: 'Login only • view/manage your credentials' },
  { role: 'university', title: 'University', desc: 'Login only • issue student credentials' },
  { role: 'merchant', title: 'Merchant', desc: 'Login + signup • verify credentials' },
];

const Landing = () => {
  const navigate = useNavigate();

  const chooseRole = (role: UserRole) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between border-4 border-black bg-white px-8 py-5 dark:border-slate-200 dark:bg-slate-900">
        <h1 className="text-4xl font-black uppercase tracking-tight">CredVerify</h1>
        <p className="text-sm font-bold uppercase">Decentralized Credential Board</p>
      </header>

      <section className="mb-6 border-y-4 border-black bg-[#e8e8e8] px-8 py-4 text-sm dark:border-slate-200 dark:bg-slate-800">
        <strong className="mr-2">Select Role</strong> → Student and University can only login. Merchant can login or sign up.
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {roleCards.map((item) => (
          <article key={item.role} className="glass p-6">
            <h2 className="mb-3 text-2xl font-black uppercase">{item.title}</h2>
            <p className="mb-5 min-h-12 text-sm font-semibold">{item.desc}</p>
            <button onClick={() => chooseRole(item.role)} className="brutal-btn w-full">
              Continue as {item.title}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Landing;
