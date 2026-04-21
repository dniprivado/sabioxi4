'use client';

import { useState, useEffect } from 'react';

export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}

export interface Lesson {
  id: string;
  title: string;
  questions: Question[];
  createdAt: number;
}

export const useLearningApp = () => {
  const [score, setScore] = useState<number>(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedScore = localStorage.getItem('learning-app-score');
    const savedLessons = localStorage.getItem('learning-app-lessons');

    if (savedScore) setScore(parseInt(savedScore, 10));
    if (savedLessons) setLessons(JSON.parse(savedLessons));
    
    setIsLoaded(true);
  }, []);

  const addLesson = (title: string, questions: Question[]) => {
    const newLesson: Lesson = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      questions,
      createdAt: Date.now(),
    };
    const updatedLessons = [newLesson, ...lessons];
    setLessons(updatedLessons);
    localStorage.setItem('learning-app-lessons', JSON.stringify(updatedLessons));
  };

  const incrementScore = () => {
    const newScore = score + 1;
    setScore(newScore);
    localStorage.setItem('learning-app-score', newScore.toString());
  };

  return {
    score,
    lessons,
    addLesson,
    incrementScore,
    isLoaded,
  };
};
