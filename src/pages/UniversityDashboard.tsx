import { FormEvent, useState } from 'react';
import CredentialCard from '../components/CredentialCard';
import StatusBadge from '../components/StatusBadge';
import { useCredentials } from '../context/CredentialContext';
import { useAuth } from '../context/AuthContext';

const UniversityDashboard = () => {
  const { credentials, issueNewCredential, revokeCredential } = useCredentials();
  const { user } = useAuth();
  const [form, setForm] = useState({ studentName: '', studentId: '', degree: '', issueDate: '' });
  const [loading, setLoading] = useState(false);
  const [newCredentialId, setNewCredentialId] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const credential = await issueNewCredential({ ...form, universityName: user?.name || 'University of CredVerify' });
      setNewCredentialId(credential.id);
      setForm({ studentName: '', studentId: '', degree: '', issueDate: '' });
    } finally {
      setLoading(false);
    }
  };

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      console.warn('Clipboard not available');
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Issue Credential</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Only universities can issue and anchor student credentials.</p>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" placeholder="Student Name" value={form.studentName} onChange={(e) => setForm((prev) => ({ ...prev, studentName: e.target.value }))} required />
          <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" placeholder="Student ID" value={form.studentId} onChange={(e) => setForm((prev) => ({ ...prev, studentId: e.target.value }))} required />
          <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" placeholder="Degree / Course" value={form.degree} onChange={(e) => setForm((prev) => ({ ...prev, degree: e.target.value }))} required />
          <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" type="date" value={form.issueDate} onChange={(e) => setForm((prev) => ({ ...prev, issueDate: e.target.value }))} required />
          <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white md:col-span-2" disabled={loading}>
            {loading ? 'Anchoring to Blockchain…' : 'Issue Credential'}
          </button>
        </form>
        {newCredentialId && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-300 bg-blue-50 p-3 text-blue-700 animate-pulseGlow dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200">
            <StatusBadge label="Success" tone="green" /> New credential issued: {newCredentialId}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-xl font-semibold">Issued Credentials</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {credentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              action={
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10"
                    onClick={() => copyId(credential.id)}
                  >
                    Copy ID
                  </button>
                  {credential.status === 'active' && (
                    <button
                      className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-200 dark:hover:bg-rose-500/20"
                      onClick={() => revokeCredential(credential.id)}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default UniversityDashboard;
