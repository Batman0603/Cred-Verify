import { Link } from 'react-router-dom';

const features = [
  'Tamper-proof credentials',
  'On-chain verification',
  'Instant revocation controls',
  'QR-based validation flow',
];

const Landing = () => (
  <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
    <div className="glass rounded-3xl p-8 md:p-12">
      <p className="mb-3 inline-block rounded-full bg-cyan-500/20 px-4 py-1 text-xs font-semibold text-cyan-200">
        Blockchain Credential Infrastructure
      </p>
      <h1 className="text-4xl font-bold md:text-6xl">Secure. Verifiable. Decentralized.</h1>
      <p className="mt-4 max-w-2xl text-slate-300">
        University-grade digital credentialing with blockchain anchoring and instant merchant verification.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/login" className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
          Login
        </Link>
        <Link to="/register" className="rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10">
          View Demo
        </Link>
      </div>
      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature} className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200">
            {feature}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Landing;
