import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CredentialCard from '../components/CredentialCard';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../context/CredentialContext';
import { VerificationResult } from '../types';

type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

type BarcodeDetectorCtor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;

type StudentProof = {
  proofId: string;
  merchant: string;
  credentialId: string;
  studentEmail: string;
  claim: 'student_verified';
  issuedAt: string;
};

const MerchantDashboard = ({ view = 'dashboard' }: { view?: 'dashboard' | 'credentials' }) => {
  const { user } = useAuth();
  const { credentials, verifyCredential, updateCredential, deleteCredential } = useCredentials();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [editing, setEditing] = useState<Record<string, { degree: string; issueDate: string }>>({});
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [studentProof, setStudentProof] = useState<StudentProof | null>(null);
  const [isQrVerifiedSession, setIsQrVerifiedSession] = useState(false);
  const [lastVerificationSource, setLastVerificationSource] = useState<'manual' | 'qr'>('manual');
  const [scannedCredentialIds, setScannedCredentialIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const raw = window.sessionStorage.getItem('merchant_scanned_credential_ids');
    return raw ? (JSON.parse(raw) as string[]) : [];
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);

  const manageList = useMemo(() => {
    if (view === 'credentials') {
      const idSet = new Set(scannedCredentialIds);
      return credentials.filter((credential) => idSet.has(credential.id));
    }
    return credentials;
  }, [credentials, scannedCredentialIds, view]);

  useEffect(() => {
    window.sessionStorage.setItem('merchant_scanned_credential_ids', JSON.stringify(scannedCredentialIds));
  }, [scannedCredentialIds]);

  const toHex = (bytes: Uint8Array) =>
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  const generateStudentProof = async (verification: VerificationResult): Promise<StudentProof | null> => {
    if (!verification.isValid || !verification.credential) {
      return null;
    }

    const payload = JSON.stringify({
      merchant: user?.email || 'merchant@verify.com',
      credentialId: verification.credential.id,
      studentEmail: verification.credential.studentEmail,
      claim: 'student_verified',
      issuedAt: new Date().toISOString(),
    });

    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
    const hash = toHex(new Uint8Array(hashBuffer));

    return {
      proofId: `ZKP-${hash.slice(0, 20).toUpperCase()}`,
      merchant: user?.email || 'merchant@verify.com',
      credentialId: verification.credential.id,
      studentEmail: verification.credential.studentEmail,
      claim: 'student_verified',
      issuedAt: new Date().toISOString(),
    };
  };

  const runVerification = async (credentialId: string, source: 'manual' | 'qr' = 'manual') => {
    setLastVerificationSource(source);
    const verification = await verifyCredential(credentialId);
    setResult(verification);

    if (verification.isValid) {
      const proof = await generateStudentProof(verification);
      setStudentProof(proof);
      if (source === 'qr') {
        setIsQrVerifiedSession(true);
        if (verification.credential) {
          const scannedId = verification.credential.id;
          setScannedCredentialIds((prev) =>
            prev.includes(scannedId) ? prev : [scannedId, ...prev],
          );
        }
      }
      return;
    }

    setStudentProof(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await runVerification(input.trim(), 'manual');
    } finally {
      setLoading(false);
    }
  };

  const stopScanner = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setScannerOpen(false);
  };

  const handleScannedValue = async (rawValue: string) => {
    const credentialId = rawValue.trim();
    setInput(credentialId);
    stopScanner();
    setLoading(true);
    try {
      await runVerification(credentialId, 'qr');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scannerOpen) {
      return;
    }

    let active = true;

    const startScanner = async () => {
      try {
        setScannerError('');

        const Detector = (window as Window & { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
        if (!Detector) {
          setScannerError('QR scanner is not supported in this browser. Use Chrome/Edge and HTTPS/localhost.');
          return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
          setScannerError('Camera access is not available in this browser.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (!active || !videoRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const detector = new Detector({ formats: ['qr_code'] });

        const scanFrame = async () => {
          if (!active || !videoRef.current) {
            return;
          }

          try {
            const detected = await detector.detect(videoRef.current);
            const rawValue = detected[0]?.rawValue;
            if (rawValue) {
              void handleScannedValue(rawValue);
              return;
            }
          } catch {
            // Ignore intermittent detector frame errors.
          }

          frameRef.current = requestAnimationFrame(() => {
            void scanFrame();
          });
        };

        void scanFrame();
      } catch {
        setScannerError('Unable to open camera. Please allow camera permission and try again.');
      }
    };

    void startScanner();

    return () => {
      active = false;
      stopScanner();
    };
  }, [scannerOpen]);

  const saveEdit = (id: string) => {
    const edit = editing[id];
    if (!edit) return;
    updateCredential(id, edit);
    setEditing((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {view === 'dashboard' && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="glass rounded-2xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Verifier</p>
              <p className="text-lg font-bold">{user?.email}</p>
            </article>
            <article className="glass rounded-2xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Credentials in DB</p>
              <p className="text-3xl font-bold">{credentials.length}</p>
            </article>
            <article className="glass rounded-2xl p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Credentials</p>
              <p className="text-3xl font-bold text-emerald-600">
                {credentials.filter((item) => item.status === 'active').length}
              </p>
            </article>
          </section>

          <section className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">Credential Verification Portal</h2>
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
              <button
                type="button"
                className="rounded-xl border-2 border-black bg-white px-5 py-3 font-semibold dark:border-slate-200 dark:bg-slate-900"
                onClick={() => {
                  setScannerError('');
                  setScannerOpen(true);
                }}
              >
                Verify via QR Scanner
              </button>
            </form>

            {scannerOpen && (
              <div className="mt-4 space-y-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-white/20 dark:bg-slate-900/60">
                <p className="text-sm font-semibold">Camera Scanner</p>
                <video ref={videoRef} className="max-h-80 w-full rounded-xl bg-black" muted playsInline />
                {scannerError && <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">{scannerError}</p>}
                <button
                  type="button"
                  className="rounded-lg border border-slate-400 px-3 py-2 text-sm font-semibold"
                  onClick={stopScanner}
                >
                  Close Scanner
                </button>
              </div>
            )}
          </section>

          {result && (
            <section className="glass rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Verification Result</h3>
                <div
                  className={`rounded-xl px-4 py-2 text-lg font-bold ${
                    result.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {result.isValid ? 'VALID' : 'INVALID'}
                </div>
              </div>
              <div className="mb-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Database Status</p>
                  <StatusBadge
                    label={result.databaseStatus}
                    tone={result.databaseStatus === 'Active' ? 'green' : result.databaseStatus === 'Revoked' ? 'red' : 'amber'}
                  />
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Blockchain Status</p>
                  <StatusBadge label={result.blockchainStatus} tone={result.blockchainStatus === 'Hash Match' ? 'green' : 'red'} />
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500">Network</p>
                  <StatusBadge label="Sepolia Testnet" tone="blue" />
                </div>
              </div>
              {lastVerificationSource === 'qr' && (
                <div
                  className={`rounded-xl border p-4 text-sm font-semibold ${
                    result.isValid
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-rose-300 bg-rose-50 text-rose-900'
                  }`}
                >
                  {result.isValid ? 'QR Verified' : 'QR Invalid'}
                </div>
              )}

              {lastVerificationSource !== 'qr' && !isQrVerifiedSession && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                  Credential details are hidden. Scan a valid QR once to unlock merchant credential visibility.
                </div>
              )}

              {result.credential && isQrVerifiedSession && lastVerificationSource !== 'qr' && (
                <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm md:grid-cols-[1fr_auto]">
                  <div>
                    <p>
                      <span className="text-slate-500">Student:</span> {result.credential.studentName}
                    </p>
                    <p>
                      <span className="text-slate-500">Degree:</span> {result.credential.degree}
                    </p>
                    <p>
                      <span className="text-slate-500">University:</span> {result.credential.universityName}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-2">
                    <QRCodeSVG value={result.credential.id} size={88} includeMargin />
                  </div>
                </div>
              )}

              {studentProof && isQrVerifiedSession && lastVerificationSource !== 'qr' && (
                <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="font-bold">Zero-Knowledge Proof Generated</p>
                  <p className="mt-1">Claim: user is a student</p>
                  <p>Proof ID: {studentProof.proofId}</p>
                  <p>Merchant: {studentProof.merchant}</p>
                  <p>Credential ID: {studentProof.credentialId}</p>
                  <p>Student Email: {studentProof.studentEmail}</p>
                  <p>Issued At: {new Date(studentProof.issuedAt).toLocaleString()}</p>
                </div>
              )}
            </section>
          )}
        </>
      )}

      <section>
        <h3 className="mb-3 text-xl font-semibold">
          {view === 'credentials' ? 'QR Scanned Users Credentials' : 'Manage Credentials'}
        </h3>
        {!isQrVerifiedSession && (
          <div className="glass rounded-2xl p-6">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Scan and verify at least one credential QR to unlock credential visibility.
            </p>
          </div>
        )}
        {isQrVerifiedSession && (
        <div className="grid gap-4 lg:grid-cols-2">
          {view === 'credentials' && manageList.length === 0 && (
            <div className="glass rounded-2xl p-6">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No scanned credentials yet. Scan a user QR from dashboard first.
              </p>
            </div>
          )}
          {manageList.map((credential) => {
            const edit = editing[credential.id];
            return (
              <CredentialCard
                key={credential.id}
                credential={credential}
                action={
                  <div className="space-y-2">
                    {edit && (
                      <div className="grid gap-2 md:grid-cols-2">
                        <input
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                          value={edit.degree}
                          onChange={(e) =>
                            setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, degree: e.target.value } }))
                          }
                        />
                        <input
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                          type="date"
                          value={edit.issueDate}
                          onChange={(e) =>
                            setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, issueDate: e.target.value } }))
                          }
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      {!edit ? (
                        <button
                          className="rounded-lg border border-blue-300 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50"
                          onClick={() =>
                            setEditing((prev) => ({
                              ...prev,
                              [credential.id]: { degree: credential.degree, issueDate: credential.issueDate },
                            }))
                          }
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          className="rounded-lg border border-emerald-300 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                          onClick={() => saveEdit(credential.id)}
                        >
                          Save
                        </button>
                      )}
                      <button
                        className="rounded-lg border border-rose-400/50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                        onClick={() => deleteCredential(credential.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
        )}
      </section>
    </div>
  );
};

export default MerchantDashboard;
