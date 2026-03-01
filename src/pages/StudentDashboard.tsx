import { QRCodeSVG } from 'qrcode.react';
import CredentialCard from '../components/CredentialCard';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../context/CredentialContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { credentials } = useCredentials();
  const myCredentials = credentials.filter((item) =>
    item.studentName.toLowerCase().includes((user?.name || '').toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">My Credentials</h2>
        <p className="text-sm text-slate-400">View your blockchain-verified academic credentials.</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {myCredentials.map((credential) => (
          <div key={credential.id} className="space-y-4">
            <CredentialCard
              credential={credential}
              action={
                <button className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
                  Download Credential (PDF)
                </button>
              }
            />
            <div className="glass rounded-2xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold">Credential QR</h4>
                <StatusBadge label="Blockchain Verified" tone="green" />
              </div>
              <div className="flex justify-center rounded-xl bg-white p-4">
                <QRCodeSVG value={credential.id} size={160} />
              </div>
              <button className="mt-4 w-full rounded-lg bg-indigo-500/70 px-3 py-2 text-sm font-semibold">Share Credential</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
