'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { incrementUserScoreAction, getLessons } from '@/app/actions/lessons';
import Link from 'next/link';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function TakeLesson() {
  const { id } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    getLessons().then(data => {
      setLessons(data);
      setIsLoaded(true);
    });
  }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const lesson = useMemo(() => lessons.find(l => l.id === id), [lessons, id]);

  const randomizedQuestions = useMemo(() => {
    if (!lesson) return [];
    return shuffleArray(lesson.questions).map(q => ({
      ...q,
      shuffledAnswers: shuffleArray([q.correctAnswer, ...q.incorrectAnswers])
    }));
  }, [lesson]);

  if (!isLoaded) return <div className="container">Cargando...</div>;
  if (!lesson) return <div className="container">Lección no encontrada.</div>;

  const currentQuestion = randomizedQuestions[currentQuestionIndex];

  const handleAnswerClick = async (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    // We increment correctCount locally to show in results
    const newCorrectCount = correct ? correctCount + 1 : correctCount;
    if (correct) setCorrectCount(prev => prev + 1);

    setTimeout(async () => {
      if (currentQuestionIndex < randomizedQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
        if (newCorrectCount >= 5) {
          await incrementUserScoreAction();
        }
      }
    }, 1200);
  };

  if (isFinished) {
    const passed = correctCount >= 5;
    return (
      <main className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{passed ? '🏆' : '🎯'}</div>
        <h1 style={{ color: passed ? '#58cc02' : '#1cb0f6' }}>{passed ? '¡Lección Completada!' : '¡Sigue practicando!'}</h1>
        
        <div className="card" style={{ margin: '2rem 0', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>PUNTUACIÓN</p>
              <h2 style={{ fontSize: '2rem', color: '#ff9600' }}>{Math.round((correctCount / randomizedQuestions.length) * 100)}%</h2>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>ACIERTOS</p>
              <h2 style={{ fontSize: '2rem', color: '#58cc02' }}>{correctCount} / 6</h2>
            </div>
          </div>
        </div>

        {passed ? (
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#58cc02', fontWeight: 700 }}>¡Has ganado 1 punto extra! 🔥</p>
        ) : (
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Necesitas 5 aciertos para ganar un punto.</p>
        )}

        <Link href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          CONTINUAR
        </Link>
      </main>
    );
  }

  const progress = ((currentQuestionIndex) / randomizedQuestions.length) * 100;

  return (
    <main className="container">
      <header className="flex-between" style={{ gap: '1rem' }}>
        <Link href="/" style={{ color: '#afafaf', fontSize: '1.5rem', textDecoration: 'none', fontWeight: 'bold' }}>✕</Link>
        <div className="progress-container" style={{ margin: 0 }}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ color: '#ff9600', fontWeight: 800, minWidth: '40px' }}>💎</div>
      </header>

      <div style={{ marginTop: '3rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>{currentQuestion.text}</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentQuestion.shuffledAnswers.map((answer, index) => {
            let statusClass = '';
            if (selectedAnswer === answer) {
              statusClass = isCorrect ? 'correct' : 'incorrect';
            } else if (selectedAnswer !== null && answer === currentQuestion.correctAnswer) {
              statusClass = 'correct';
            } else if (selectedAnswer !== null) {
              statusClass = '';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswer !== null}
                className={`answer-option ${selectedAnswer === answer ? 'selected' : ''} ${statusClass}`}
              >
                <span style={{ 
                  display: 'inline-flex', 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '8px', 
                  border: '2px solid #e5e5e5', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#afafaf'
                }}>
                  {index + 1}
                </span>
                {answer}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
