import { FormEvent, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Credential Verification Portal</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Verify status from database + blockchain hash consistency.</p>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 md:flex-row">
          <input
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 dark:border-white/20 dark:bg-slate-950/60"
            placeholder="Enter Credential ID"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white" disabled={loading}>
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
                result.isValid
                  ? 'bg-emerald-100 text-emerald-700 shadow-glow dark:bg-emerald-500/20 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
              }`}
            >
              {result.isValid ? 'VALID' : 'INVALID'}
            </div>
          </div>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Database Status</p>
              <StatusBadge
                label={result.databaseStatus}
                tone={result.databaseStatus === 'Active' ? 'green' : result.databaseStatus === 'Revoked' ? 'red' : 'amber'}
              />
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Blockchain Status</p>
              <StatusBadge label={result.blockchainStatus} tone={result.blockchainStatus === 'Hash Match' ? 'green' : 'red'} />
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/5">
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Network</p>
              <StatusBadge label="Sepolia Testnet" tone="blue" />
            </div>
          </div>

          {result.credential && (
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-white/10 dark:bg-slate-900/50 md:grid-cols-[1fr_auto]">
              <div>
                <p><span className="text-slate-500 dark:text-slate-400">Student:</span> {result.credential.studentName}</p>
                <p><span className="text-slate-500 dark:text-slate-400">Degree:</span> {result.credential.degree}</p>
                <p><span className="text-slate-500 dark:text-slate-400">University:</span> {result.credential.universityName}</p>
                <p className="truncate"><span className="text-slate-500 dark:text-slate-400">Tx Hash:</span> {result.credential.transactionHash}</p>
              </div>
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG value={result.credential.id} size={88} includeMargin />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default MerchantDashboard;
