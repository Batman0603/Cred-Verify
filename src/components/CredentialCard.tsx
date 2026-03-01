import { Credential } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  credential: Credential;
  action?: React.ReactNode;
}

const CredentialCard = ({ credential, action }: Props) => {
  const active = credential.status === 'active';

  return (
    <article className="glass rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-glow">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-cyan-200">{credential.degree}</h3>
        <StatusBadge label={active ? 'Active' : 'Revoked'} tone={active ? 'green' : 'red'} />
      </div>
      <div className="space-y-1 text-sm text-slate-200">
        <p>
          <span className="text-slate-400">Credential ID:</span> {credential.id}
        </p>
        <p>
          <span className="text-slate-400">Student:</span> {credential.studentName}
        </p>
        <p>
          <span className="text-slate-400">University:</span> {credential.universityName}
        </p>
        <p>
          <span className="text-slate-400">Issue Date:</span> {credential.issueDate}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge label="Verified on Sepolia" tone="blue" />
        <span className="truncate text-xs text-slate-400">Tx: {credential.transactionHash.slice(0, 16)}...</span>
      </div>
      {action && <div className="mt-4">{action}</div>}
    </article>
  );
};

export default CredentialCard;
