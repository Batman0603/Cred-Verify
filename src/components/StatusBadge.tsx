interface StatusBadgeProps {
  label: string;
  tone?: 'green' | 'red' | 'blue' | 'amber';
}

const tones = {
  green: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  red: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
  blue: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
};

const StatusBadge = ({ label, tone = 'blue' }: StatusBadgeProps) => (
  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>
);

export default StatusBadge;
