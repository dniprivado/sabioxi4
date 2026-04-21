'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    const res = await loginAction(formData);
    if (res) setError(res);
  }

  return (
    <main className="container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <h1 style={{ textAlign: 'center' }}>Iniciar Sesión</h1>
      
      <div className="card">
        <form action={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>EMAIL</label>
            <input 
              name="email"
              type="email" 
              required
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                background: '#f7f7f7',
                border: '2px solid #e5e5e5',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>CONTRASEÑA</label>
            <input 
              name="password"
              type="password" 
              required
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                background: '#f7f7f7',
                border: '2px solid #e5e5e5',
                fontSize: '1rem'
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#ea2b2b', background: '#ffdbdb', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontWeight: 600, border: '2px solid #ff4b4b' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary">ENTRAR</button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        ¿No tienes cuenta? <Link href="/signup" style={{ color: '#1cb0f6', fontWeight: 800 }}>Regístrate</Link>
      </p>
    </main>
  );
}
