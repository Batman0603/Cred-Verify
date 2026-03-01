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
    const credential = await issueNewCredential({ ...form, universityName: user?.name || 'University of CredVerify' });
    setNewCredentialId(credential.id);
    setForm({ studentName: '', studentId: '', degree: '', issueDate: '' });
    setLoading(false);
  };

  const copyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Issue Credential</h2>
        <p className="mb-4 text-sm text-slate-400">Anchor a student credential to Sepolia (simulated).</p>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <input className="rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3" placeholder="Student Name" value={form.studentName} onChange={(e) => setForm((prev) => ({ ...prev, studentName: e.target.value }))} required />
          <input className="rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3" placeholder="Student ID" value={form.studentId} onChange={(e) => setForm((prev) => ({ ...prev, studentId: e.target.value }))} required />
          <input className="rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3" placeholder="Degree / Course" value={form.degree} onChange={(e) => setForm((prev) => ({ ...prev, degree: e.target.value }))} required />
          <input className="rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3" type="date" value={form.issueDate} onChange={(e) => setForm((prev) => ({ ...prev, issueDate: e.target.value }))} required />
          <button className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 md:col-span-2" disabled={loading}>
            {loading ? 'Anchoring to Blockchain…' : 'Issue Credential'}
          </button>
        </form>
        {newCredentialId && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/15 p-3 text-emerald-200 animate-pulseGlow">
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
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
                    onClick={() => copyId(credential.id)}
                  >
                    Copy ID
                  </button>
                  {credential.status === 'active' && (
                    <button
                      className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/20"
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
