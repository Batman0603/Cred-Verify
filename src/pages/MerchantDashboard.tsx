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
    const verification = await verifyCredential(input);
    setResult(verification);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
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
