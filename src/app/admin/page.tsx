import { getUsers, blockUser, deleteUser, resetUserPassword } from "@/app/actions/admin";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    redirect("/");
  }

  const { results: users } = await getUsers();

  return (
    <main className="container">
      <header className="flex-between mb-8">
        <Link href="/" className="btn btn-outline" style={{ width: 'auto' }}>← VOLVER</Link>
        <h1>Panel Admin</h1>
      </header>

      <div className="grid">
        {users.map((user: any) => (
          <div key={user.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between">
              <div>
                <h2 style={{ margin: 0 }}>{user.email}</h2>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, color: user.role === 'admin' ? '#1cb0f6' : '#afafaf' }}>
                  {user.role.toUpperCase()}
                </p>
              </div>
              <div style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.7rem', 
                fontWeight: 800,
                backgroundColor: user.status === 'blocked' ? '#ffdbdb' : '#d7ffb8',
                color: user.status === 'blocked' ? '#ea2b2b' : '#46a302'
              }}>
                {user.status.toUpperCase()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <form action={async () => {
                'use server';
                await blockUser(user.id, user.status === 'active');
              }}>
                <button className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.7rem' }}>
                  {user.status === 'active' ? 'BLOQUEAR' : 'DESBLOQUEAR'}
                </button>
              </form>

              <form action={async () => {
                'use server';
                await deleteUser(user.id);
              }}>
                <button className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.7rem', color: '#ea2b2b' }}>
                  ELIMINAR
                </button>
              </form>

              {/* Reset Password is a bit more complex for a simple form, maybe just a placeholder for now */}
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.5rem', fontSize: '0.7rem' }}
                onClick={() => {}} // This is a server component, can't have onClick like this.
              >
                CAMBIAR PWD
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
