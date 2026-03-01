import { useMemo, useState } from 'react';
import CredentialCard from '../components/CredentialCard';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../context/CredentialContext';

const StudentDashboard = ({ view = 'dashboard' }: { view?: 'dashboard' | 'credentials' }) => {
  const { user } = useAuth();
  const { credentials, updateCredential, deleteCredential } = useCredentials();
  const [editing, setEditing] = useState<Record<string, { degree: string; issueDate: string }>>({});

  const myCredentials = useMemo(
    () => credentials.filter((item) => item.studentEmail === user?.email),
    [credentials, user?.email],
  );

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
        <section className="grid gap-4 md:grid-cols-2">
          <article className="glass rounded-2xl p-4"><p className="text-sm text-slate-500 dark:text-slate-400">My Credentials</p><p className="text-3xl font-bold">{myCredentials.length}</p></article>
          <article className="glass rounded-2xl p-4"><p className="text-sm text-slate-500 dark:text-slate-400">Active Credentials</p><p className="text-3xl font-bold text-emerald-600">{myCredentials.filter((item) => item.status === 'active').length}</p></article>
        </section>
      )}

      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">My Credential Page</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Students can view, edit, and delete their own credentials.</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {myCredentials.map((credential) => {
          const edit = editing[credential.id];
          return (
            <CredentialCard
              key={credential.id}
              credential={credential}
              action={<div className="space-y-2">{edit && <div className="grid gap-2 md:grid-cols-2"><input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-950/60" value={edit.degree} onChange={(e) => setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, degree: e.target.value } }))} /><input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-950/60" type="date" value={edit.issueDate} onChange={(e) => setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, issueDate: e.target.value } }))} /></div>}<div className="flex gap-2">{!edit ? <button className="rounded-lg border border-blue-300 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50" onClick={() => setEditing((prev) => ({ ...prev, [credential.id]: { degree: credential.degree, issueDate: credential.issueDate } }))}>Edit</button> : <button className="rounded-lg border border-emerald-300 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50" onClick={() => saveEdit(credential.id)}>Save</button>}<button className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50" onClick={() => deleteCredential(credential.id)}>Delete</button></div></div>}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
