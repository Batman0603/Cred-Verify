import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const roleColumns: { role: UserRole; title: string; subtitle: string; notes: string[] }[] = [
  {
    role: 'student',
    title: 'Student',
    subtitle: 'Login only',
    notes: ['View your credentials', 'Edit / delete your own records'],
  },
  {
    role: 'university',
    title: 'University',
    subtitle: 'Login only',
    notes: ['Issue student credentials', 'Revoke issued credentials'],
  },
  {
    role: 'merchant',
    title: 'Merchant',
    subtitle: 'Login + signup',
    notes: ['Verify on DB + blockchain', 'Merchant registration enabled'],
  },
];

const Landing = () => {
  const navigate = useNavigate();

  const continueWithRole = (role: UserRole) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1500px] px-6 py-8">
      <header className="mb-4 flex items-center justify-between border-4 border-black bg-white px-8 py-5 dark:border-slate-200 dark:bg-slate-900">
        <div className="flex items-center gap-6">
          <h1 className="text-5xl font-black uppercase tracking-tight">CredFlow</h1>
          <div className="border-4 border-black px-4 py-2 text-sm font-black uppercase dark:border-slate-200">
            Role Gate
          </div>
        </div>
        <div className="flex gap-3">
          <button className="brutal-btn">New Session</button>
          <button className="brutal-btn">Docs</button>
        </div>
      </header>

      <section className="mb-6 flex items-center justify-between border-y-4 border-black bg-[#e5e7eb] px-8 py-3 text-sm font-bold uppercase dark:border-slate-200 dark:bg-slate-800">
        <p>
          Select your role first → then continue to role-scoped login.
        </p>
        <p>student/university: login only • merchant: login + signup</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {roleColumns.map((column, index) => (
          <article key={column.role} className="border-4 border-black bg-[#f3f4f6] dark:border-slate-200 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b-4 border-black px-5 py-4 dark:border-slate-200">
              <h2 className="text-3xl font-black uppercase">{column.title}</h2>
              <span className="border-4 border-black px-3 py-1 text-sm font-black dark:border-slate-200">0{index + 1}</span>
            </div>
            <div className="p-5">
              <p className="mb-4 text-sm font-black uppercase text-slate-600 dark:text-slate-300">{column.subtitle}</p>
              <div className="mb-4 space-y-2">
                {column.notes.map((note) => (
                  <p key={note} className="border-2 border-black bg-white px-3 py-2 text-sm font-semibold dark:border-slate-300 dark:bg-slate-800">
                    {note}
                  </p>
                ))}
              </div>
              <button onClick={() => continueWithRole(column.role)} className="brutal-btn w-full">
                Continue as {column.title}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Landing;
