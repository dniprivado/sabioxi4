import Link from 'next/link';
import { getLessons, getUserScore } from '@/app/actions/lessons';
import { auth, signOut } from '@/lib/auth';

export default async function Home() {
  const session = await auth();
  const lessons = await getLessons();
  const score = await getUserScore();

  return (
    <main className="container">
      <header className="flex-between" style={{ padding: '0.5rem 0', borderBottom: '2px solid #e5e5e5', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔥</span>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ff9600' }}>{score}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {session ? (
            <>
              {(session.user as any).role === 'admin' && (
                <Link href="/admin" className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  ADMIN
                </Link>
              )}
              <form action={async () => {
                'use server';
                await signOut();
              }}>
                <button className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  SALIR
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
              ENTRAR
            </Link>
          )}
        </div>
      </header>

      <section>
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Lecciones</h1>
          {session && (
            <Link href="/create" className="btn btn-primary" style={{ width: 'auto' }}>
              + CREAR
            </Link>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {lessons.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🦉</div>
              <h2>¡Empieza tu aventura!</h2>
              <p style={{ margin: '1rem 0 2rem' }}>Crea tu primera lección pegando tus preguntas de Excel.</p>
              <Link href="/create" className="btn btn-primary">
                Crear Lección
              </Link>
            </div>
          ) : (
            lessons.map((lesson) => (
              <Link href={`/lesson/${lesson.id}`} key={lesson.id} className="card card-interactive flex-between" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    backgroundColor: '#1cb0f6', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white',
                    boxShadow: '0 4px 0 #1899d6'
                  }}>
                    📚
                  </div>
                  <div>
                    <h2 style={{ margin: 0 }}>{lesson.title}</h2>
                    <p style={{ fontSize: '0.9rem' }}>{lesson.questions.length} preguntas</p>
                  </div>
                </div>
                <div style={{ color: '#afafaf', fontWeight: 800 }}>➔</div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
