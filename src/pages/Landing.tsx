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
      <header className="landing-reveal mb-4 flex items-center justify-between border-4 border-black bg-white px-8 py-5 dark:border-slate-200 dark:bg-slate-900">
        <div className="flex items-center gap-6">
          <h1 className="text-5xl font-black uppercase tracking-tight">CredFlow</h1>
          <div className="border-4 border-black px-4 py-2 text-sm font-black uppercase dark:border-slate-200">
            Role Gate
          </div>
        </div>
      </header>

      <section className="landing-reveal mb-6 border-4 border-black bg-gradient-to-r from-[#ffd9a8] via-[#ffedd5] to-[#fde68a] px-8 py-6 dark:border-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <h2 className="mb-2 text-3xl font-black uppercase">Trusted Digital Credentials with CredFlow</h2>
        <p className="max-w-5xl text-sm font-semibold leading-6">
          CredFlow helps universities issue credentials, lets students securely hold and share them, and allows merchants
          to verify authenticity using QR + blockchain checks.
        </p>
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-3">
        <article className="landing-float border-4 border-black bg-white p-4 dark:border-slate-200 dark:bg-slate-900">
          <svg viewBox="0 0 240 110" className="mb-3 h-28 w-full border-2 border-black bg-[#fef3c7] dark:border-slate-200 dark:bg-slate-800">
            <rect x="20" y="24" width="200" height="62" fill="#fff" stroke="#111" strokeWidth="4" />
            <rect x="34" y="38" width="100" height="10" fill="#f97316" />
            <rect x="34" y="56" width="160" height="8" fill="#334155" />
            <rect x="34" y="70" width="84" height="8" fill="#334155" />
          </svg>
          <h3 className="text-lg font-black uppercase">Issue</h3>
          <p className="text-sm font-semibold">Universities generate secure credentials for students in minutes.</p>
        </article>

        <article className="landing-float border-4 border-black bg-white p-4 dark:border-slate-200 dark:bg-slate-900">
          <svg viewBox="0 0 240 110" className="mb-3 h-28 w-full border-2 border-black bg-[#dbeafe] dark:border-slate-200 dark:bg-slate-800">
            <rect x="18" y="18" width="92" height="72" fill="#fff" stroke="#111" strokeWidth="4" />
            <rect x="130" y="18" width="92" height="72" fill="#fff" stroke="#111" strokeWidth="4" />
            <rect x="36" y="36" width="54" height="10" fill="#0ea5e9" />
            <rect x="146" y="36" width="54" height="10" fill="#16a34a" />
            <rect x="36" y="56" width="54" height="10" fill="#334155" />
            <rect x="146" y="56" width="54" height="10" fill="#334155" />
          </svg>
          <h3 className="text-lg font-black uppercase">Share</h3>
          <p className="text-sm font-semibold">Students carry one verifiable identity with QR-ready access.</p>
        </article>

        <article className="landing-float border-4 border-black bg-white p-4 dark:border-slate-200 dark:bg-slate-900">
          <svg viewBox="0 0 240 110" className="mb-3 h-28 w-full border-2 border-black bg-[#dcfce7] dark:border-slate-200 dark:bg-slate-800">
            <rect x="24" y="22" width="78" height="66" fill="#fff" stroke="#111" strokeWidth="4" />
            <rect x="118" y="22" width="98" height="66" fill="#fff" stroke="#111" strokeWidth="4" />
            <rect x="138" y="38" width="58" height="10" fill="#16a34a" />
            <rect x="138" y="56" width="40" height="8" fill="#334155" />
            <rect x="36" y="34" width="16" height="16" fill="#111" />
            <rect x="56" y="34" width="16" height="16" fill="#111" />
            <rect x="36" y="54" width="16" height="16" fill="#111" />
            <rect x="56" y="54" width="16" height="16" fill="#111" />
          </svg>
          <h3 className="text-lg font-black uppercase">Verify</h3>
          <p className="text-sm font-semibold">Merchants scan QR and validate proof status instantly.</p>
        </article>
      </section>

      <section className="landing-reveal mb-3 border-y-4 border-black bg-[#e5e7eb] px-8 py-3 text-sm font-bold uppercase dark:border-slate-200 dark:bg-slate-800">
        <p>Login Menu: choose your role to continue.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {roleColumns.map((column, index) => (
          <article key={column.role} className="landing-reveal border-4 border-black bg-[#f3f4f6] dark:border-slate-200 dark:bg-slate-900">
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
              <button onClick={() => continueWithRole(column.role)} className="brutal-btn auth-btn w-full">
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
