import { FormEvent, useMemo, useState } from 'react';
import CredentialCard from '../components/CredentialCard';
import StatusBadge from '../components/StatusBadge';
import { useCredentials } from '../context/CredentialContext';
import { useAuth } from '../context/AuthContext';

const UniversityDashboard = ({ view = 'dashboard' }: { view?: 'dashboard' | 'credentials' }) => {
  const { credentials, issueNewCredential, revokeCredential, updateCredential, deleteCredential } =
    useCredentials();
  const { user } = useAuth();
  const [form, setForm] = useState({ studentName: '', studentId: '', studentEmail: '', degree: '', issueDate: '' });
  const [loading, setLoading] = useState(false);
  const [newCredentialId, setNewCredentialId] = useState('');
  const [editing, setEditing] = useState<Record<string, { degree: string; issueDate: string }>>({});

  const ownCredentials = useMemo(
    () => credentials.filter((credential) => credential.issuerEmail === user?.email),
    [credentials, user?.email],
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const credential = await issueNewCredential({
        ...form,
        universityName: user?.name || 'Issuer University',
        issuerEmail: user?.email || 'admin@gmail.com',
      });
      setNewCredentialId(credential.id);
      setForm({ studentName: '', studentId: '', studentEmail: '', degree: '', issueDate: '' });
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = (id: string) => {
    const edit = editing[id];
    if (!edit) return;
    updateCredential(id, edit);
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {view === 'dashboard' && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="glass rounded-2xl p-4"><p className="text-sm text-slate-500 dark:text-slate-400">Total Issued</p><p className="text-3xl font-bold">{ownCredentials.length}</p></article>
            <article className="glass rounded-2xl p-4"><p className="text-sm text-slate-500 dark:text-slate-400">Active</p><p className="text-3xl font-bold text-emerald-600">{ownCredentials.filter((item) => item.status === 'active').length}</p></article>
            <article className="glass rounded-2xl p-4"><p className="text-sm text-slate-500 dark:text-slate-400">Revoked</p><p className="text-3xl font-bold text-rose-600">{ownCredentials.filter((item) => item.status === 'revoked').length}</p></article>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">Issue Credential</h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">University role has permission to create student credentials.</p>
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
              <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" placeholder="Student Name" value={form.studentName} onChange={(e) => setForm((prev) => ({ ...prev, studentName: e.target.value }))} required />
              <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" placeholder="Student ID" value={form.studentId} onChange={(e) => setForm((prev) => ({ ...prev, studentId: e.target.value }))} required />
              <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" placeholder="Student Email" type="email" value={form.studentEmail} onChange={(e) => setForm((prev) => ({ ...prev, studentEmail: e.target.value }))} required />
              <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" placeholder="Degree / Course" value={form.degree} onChange={(e) => setForm((prev) => ({ ...prev, degree: e.target.value }))} required />
              <input className="rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60 md:col-span-2" type="date" value={form.issueDate} onChange={(e) => setForm((prev) => ({ ...prev, issueDate: e.target.value }))} required />
              <button className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white md:col-span-2" disabled={loading}>{loading ? 'Anchoring to Blockchain…' : 'Issue Credential'}</button>
            </form>
            {newCredentialId && <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-300 bg-blue-50 p-3 text-blue-700 animate-pulseGlow dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200"><StatusBadge label="Success" tone="green" /> New credential issued: {newCredentialId}</div>}
          </section>
        </>
      )}

      <section>
        <h3 className="mb-3 text-xl font-semibold">Manage Issued Credentials</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {ownCredentials.map((credential) => {
            const edit = editing[credential.id];
            return (
              <CredentialCard
                key={credential.id}
                credential={credential}
                action={<div className="space-y-2">{edit && <div className="grid gap-2 md:grid-cols-2"><input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-950/60" value={edit.degree} onChange={(e) => setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, degree: e.target.value } }))} /><input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-950/60" type="date" value={edit.issueDate} onChange={(e) => setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, issueDate: e.target.value } }))} /></div>}<div className="flex flex-wrap gap-2">{!edit ? <button className="rounded-lg border border-blue-300 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50" onClick={() => setEditing((prev) => ({ ...prev, [credential.id]: { degree: credential.degree, issueDate: credential.issueDate } }))}>Edit</button> : <button className="rounded-lg border border-emerald-300 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50" onClick={() => saveEdit(credential.id)}>Save</button>}<button className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50" onClick={() => deleteCredential(credential.id)}>Delete</button>{credential.status === 'active' && <button className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50" onClick={() => revokeCredential(credential.id)}>Revoke</button>}</div></div>}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default UniversityDashboard;
