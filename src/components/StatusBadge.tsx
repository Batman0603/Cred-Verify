interface StatusBadgeProps {
  label: string;
  tone?: 'green' | 'red' | 'blue' | 'amber';
}

const tones = {
  green: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/40',
  red: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-400/40',
  blue: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-400/40',
  amber: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/40',
  green: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  red: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
  blue: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
};

const StatusBadge = ({ label, tone = 'blue' }: StatusBadgeProps) => (
  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>
);

export default StatusBadge;
