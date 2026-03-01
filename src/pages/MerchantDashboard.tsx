import { FormEvent, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CredentialCard from '../components/CredentialCard';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../context/CredentialContext';
import { VerificationResult } from '../types';

const MerchantDashboard = ({ view = 'dashboard' }: { view?: 'dashboard' | 'credentials' }) => {
  const { user } = useAuth();
  const { credentials, verifyCredential, updateCredential, deleteCredential } = useCredentials();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [editing, setEditing] = useState<Record<string, { degree: string; issueDate: string }>>({});

  const manageList = useMemo(() => credentials, [credentials]);
import { FormEvent, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useCredentials } from '../context/CredentialContext';
import { VerificationResult } from '../types';

const MerchantDashboard = () => {
  const { verifyCredential } = useCredentials();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const verification = await verifyCredential(input);
      setResult(verification);
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
    const verification = await verifyCredential(input);
    setResult(verification);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {view === 'dashboard' && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="glass rounded-2xl p-4"><p className="text-sm text-slate-500 dark:text-slate-400">Verifier</p><p className="text-lg font-bold">{user?.email}</p></article>
            <article className="glass rounded-2xl p-4"><p className="text-sm text-slate-500 dark:text-slate-400">Total Credentials in DB</p><p className="text-3xl font-bold">{credentials.length}</p></article>
            <article className="glass rounded-2xl p-4"><p className="text-sm text-slate-500 dark:text-slate-400">Active Credentials</p><p className="text-3xl font-bold text-emerald-600">{credentials.filter((item) => item.status === 'active').length}</p></article>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">Credential Verification Portal</h2>
            <form onSubmit={submit} className="mt-4 flex flex-col gap-3 md:flex-row">
              <input className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60" placeholder="Enter Credential ID" value={input} onChange={(e) => setInput(e.target.value)} />
              <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white" disabled={loading}>{loading ? 'Verifying...' : 'Verify Credential'}</button>
            </form>
          </section>

          {result && <section className="glass rounded-2xl p-6"><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-semibold">Verification Result</h3><div className={`rounded-xl px-4 py-2 text-lg font-bold ${result.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{result.isValid ? 'VALID' : 'INVALID'}</div></div><div className="mb-4 grid gap-3 md:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs uppercase text-slate-500">Database Status</p><StatusBadge label={result.databaseStatus} tone={result.databaseStatus === 'Active' ? 'green' : result.databaseStatus === 'Revoked' ? 'red' : 'amber'} /></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs uppercase text-slate-500">Blockchain Status</p><StatusBadge label={result.blockchainStatus} tone={result.blockchainStatus === 'Hash Match' ? 'green' : 'red'} /></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs uppercase text-slate-500">Network</p><StatusBadge label="Sepolia Testnet" tone="blue" /></div></div>{result.credential && <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm md:grid-cols-[1fr_auto]"><div><p><span className="text-slate-500">Student:</span> {result.credential.studentName}</p><p><span className="text-slate-500">Degree:</span> {result.credential.degree}</p><p><span className="text-slate-500">University:</span> {result.credential.universityName}</p></div><div className="rounded-lg bg-white p-2"><QRCodeSVG value={result.credential.id} size={88} includeMargin /></div></div>}</section>}
        </>
      )}

      <section>
        <h3 className="mb-3 text-xl font-semibold">Manage Credentials</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {manageList.map((credential) => {
            const edit = editing[credential.id];
            return (
              <CredentialCard
                key={credential.id}
                credential={credential}
                action={<div className="space-y-2">{edit && <div className="grid gap-2 md:grid-cols-2"><input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" value={edit.degree} onChange={(e) => setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, degree: e.target.value } }))} /><input className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" type="date" value={edit.issueDate} onChange={(e) => setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, issueDate: e.target.value } }))} /></div>}<div className="flex gap-2">{!edit ? <button className="rounded-lg border border-blue-300 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50" onClick={() => setEditing((prev) => ({ ...prev, [credential.id]: { degree: credential.degree, issueDate: credential.issueDate } }))}>Edit</button> : <button className="rounded-lg border border-emerald-300 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50" onClick={() => saveEdit(credential.id)}>Save</button>}<button className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50" onClick={() => deleteCredential(credential.id)}>Delete</button></div></div>}
              />
            );
          })}
        </div>
      </section>
      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Credential Verification Portal</h2>
        <p className="text-sm text-slate-400">Verify status from database + blockchain hash consistency.</p>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            className="flex-1 rounded-xl border border-white/20 bg-slate-950/60 px-4 py-3"
            placeholder="Enter Credential ID"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Credential'}
          </button>
        </form>
      </section>

      {result && (
        <section className="glass rounded-2xl p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-semibold">Verification Result</h3>
            <div
              className={`rounded-xl px-4 py-2 text-lg font-bold ${
                result.isValid ? 'bg-emerald-500/20 text-emerald-300 shadow-glow' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {result.isValid ? 'VALID' : 'INVALID'}
            </div>
          </div>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase text-slate-400">Database Status</p>
              <StatusBadge
                label={result.databaseStatus}
                tone={result.databaseStatus === 'Active' ? 'green' : result.databaseStatus === 'Revoked' ? 'red' : 'amber'}
              />
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase text-slate-400">Blockchain Status</p>
              <StatusBadge label={result.blockchainStatus} tone={result.blockchainStatus === 'Hash Match' ? 'green' : 'red'} />
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-xs uppercase text-slate-400">Network</p>
              <StatusBadge label="Sepolia Testnet" tone="blue" />
            </div>
          </div>

          {result.credential && (
            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm">
              <p><span className="text-slate-400">Student:</span> {result.credential.studentName}</p>
              <p><span className="text-slate-400">Degree:</span> {result.credential.degree}</p>
              <p><span className="text-slate-400">University:</span> {result.credential.universityName}</p>
              <p className="truncate"><span className="text-slate-400">Tx Hash:</span> {result.credential.transactionHash}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default MerchantDashboard;
