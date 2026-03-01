import CredentialCard from '../components/CredentialCard';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../context/CredentialContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { credentials } = useCredentials();
  const matchedCredentials = credentials.filter((item) =>
    item.studentName.toLowerCase().includes((user?.name || '').toLowerCase()),
  );
  const myCredentials = matchedCredentials.length > 0 ? matchedCredentials : credentials;

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">My Credentials</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View and share your blockchain-verified credentials. QR is shown on every credential card.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {myCredentials.map((credential) => (
          <CredentialCard
            key={credential.id}
            credential={credential}
            action={
              <div className="flex gap-2">
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">
                  Download Credential (PDF)
                </button>
                <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Share Credential</button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
