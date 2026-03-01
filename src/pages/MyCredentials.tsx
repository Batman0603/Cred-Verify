import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CredentialCard from '../components/CredentialCard';
import { useAuth } from '../context/AuthContext';
import { useCredentials } from '../context/CredentialContext';

const MyCredentials = () => {
  const { user } = useAuth();
  const { credentials, updateCredential } = useCredentials();
  const [editing, setEditing] = useState<Record<string, { degree: string; issueDate: string }>>({});

  const myCredentials = useMemo(() => {
    if (!user) {
      return [];
    }

    if (user.role === 'student') {
      return credentials.filter((credential) => credential.studentEmail === user.email);
    }

    if (user.role === 'university') {
      return credentials.filter((credential) => credential.issuerEmail === user.email);
    }

    return credentials.filter(
      (credential) => credential.studentEmail === user.email || credential.issuerEmail === user.email,
    );
  }, [credentials, user]);

  const primaryCredential = myCredentials[0];
  const profileName =
    user?.role === 'student'
      ? primaryCredential?.studentName || user?.name || 'N/A'
      : user?.name || primaryCredential?.universityName || 'N/A';
  const profileId =
    user?.role === 'student'
      ? primaryCredential?.studentId || 'N/A'
      : user?.email || primaryCredential?.id || 'N/A';
  const profileRole = user?.role || 'N/A';

  const profileQrValue = JSON.stringify({
    name: profileName,
    id: profileId,
    role: profileRole,
    email: user?.email || 'N/A',
  });

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
      <section className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">My Credentials</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Credentials linked to your signed-in account. You can edit your own credential details here.
        </p>
      </section>

      <section className="glass rounded-2xl p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Name:</span> {profileName}
            </p>
            <p>
              <span className="font-semibold">ID:</span> {profileId}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {profileRole}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email || 'N/A'}
            </p>
          </div>
          <div className="rounded-lg bg-white p-2">
            <QRCodeSVG value={profileQrValue} size={96} includeMargin />
          </div>
        </div>
      </section>

      {myCredentials.length === 0 && (
        <section className="glass rounded-2xl p-6">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No credentials found for this account.
          </p>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {myCredentials.map((credential) => {
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
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-950/60"
                        value={edit.degree}
                        onChange={(e) =>
                          setEditing((prev) => ({ ...prev, [credential.id]: { ...edit, degree: e.target.value } }))
                        }
                      />
                      <input
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-slate-950/60"
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
                  </div>
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default MyCredentials;
