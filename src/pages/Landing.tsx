import { Link } from 'react-router-dom';

const features = [
  'Tamper-proof credentials',
  'On-chain verification',
  'Instant revocation controls',
  'QR-based validation flow',
];

const Landing = () => (
  <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center bg-slate-100 px-6 py-12 dark:bg-slate-950">
    <div className="glass rounded-3xl p-8 md:p-12">
      <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-200">
        Blockchain Credential Infrastructure
      </p>
      <h1 className="text-4xl font-bold md:text-6xl">Secure. Verifiable. Decentralized.</h1>
      <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
        University-grade digital credentialing with blockchain anchoring and instant merchant verification.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/login" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500">
          Login
        </Link>
        <Link to="/register" className="rounded-xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">
          View Demo
        </Link>
      </div>
      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature} className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            {feature}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Landing;
