'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addLessonAction } from '@/app/actions/lessons';
import Link from 'next/link';

export default function CreateLesson() {
  const [title, setTitle] = useState('');
  const [pastedData, setPastedData] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreate = async () => {
    setError('');
    if (!title.trim()) {
      setError('¡Ups! Necesitas un título para tu lección.');
      return;
    }

    const lines = pastedData.trim().split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 30) {
      setError(`¡Faltan líneas! Necesitamos 30 (6 preguntas x 5 líneas). Tienes ${lines.length}.`);
      return;
    }

    try {
      const questions: any[] = [];
      for (let i = 0; i < 30; i += 5) {
        questions.push({
          id: Math.random().toString(36).substring(2, 9),
          text: lines[i].trim(),
          correctAnswer: lines[i+1].trim(),
          incorrectAnswers: [lines[i+2].trim(), lines[i+3].trim(), lines[i+4].trim()],
        });
      }

      await addLessonAction(title, questions);
      router.push('/');
    } catch (err: any) {
      setError('Hubo un problema procesando las preguntas. Revisa el formato.');
    }
  };

  const detectedLines = pastedData.trim().split('\n').filter(line => line.trim() !== '').length;

  return (
    <main className="container animate-fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#afafaf', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✕</span> CANCELAR
        </Link>
      </header>

      <h1>Nueva Lección</h1>
      
      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#4b4b4b' }}>Título</label>
          <input 
            type="text" 
            placeholder="Ej: Verbos Irregulares"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: 'var(--radius)',
              background: '#f7f7f7',
              border: '2px solid #e5e5e5',
              color: '#3c3c3c',
              fontSize: '1rem',
              fontWeight: 500
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#4b4b4b' }}>
            Contenido (Vertical)
          </label>
          <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#777', backgroundColor: '#f7f7f7', padding: '1rem', borderRadius: 'var(--radius)', border: '2px dashed #e5e5e5' }}>
            Pega 30 líneas. Cada 5 líneas:<br/>
            <strong>1. Pregunta</strong><br/>
            <strong>2. Respuesta Correcta</strong><br/>
            3-5. Respuestas Incorrectas
          </div>
          
          <div style={{ 
            fontSize: '0.8rem', 
            color: detectedLines >= 30 ? '#58cc02' : '#1cb0f6', 
            fontWeight: 800, 
            marginBottom: '0.5rem',
            textAlign: 'right'
          }}>
            {detectedLines} / 30 LÍNEAS
          </div>
          
          <textarea 
            rows={10}
            placeholder={"¿Cuál es la capital de Francia?\nParís\nLyon\nMarsella\nNiza\n..."}
            value={pastedData}
            onChange={(e) => setPastedData(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: 'var(--radius)',
              background: '#f7f7f7',
              border: '2px solid #e5e5e5',
              color: '#3c3c3c',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {error && (
          <div style={{ 
            color: '#ea2b2b', 
            background: '#ffdbdb', 
            padding: '1rem', 
            borderRadius: 'var(--radius)', 
            marginBottom: '1.5rem', 
            fontSize: '0.9rem',
            fontWeight: 600,
            border: '2px solid #ff4b4b'
          }}>
            {error}
          </div>
        )}

        <button onClick={handleCreate} className="btn btn-primary">
          GUARDAR LECCIÓN
        </button>
      </div>
    </main>
  );
}
