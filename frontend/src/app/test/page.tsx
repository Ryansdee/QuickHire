'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import testsData from './tests.json';
import './test.css';
import Editor from "@monaco-editor/react";

type TestType = {
  id: string;
  title: string;
  description: string;
  languages: string[];
  placeholder: string;
  defaultCode: string;
  examples: Record<string, string>;
  correctAnswers: string[];
  authorId: string;
};

type CandidateSubmission = {
  candidateId: string;
  code: string;
  feedback?: string;
  score?: number;
};

const TestPage = () => {
  const searchParams = useSearchParams();
  const [testData, setTestData] = useState<TestType | null>(null);
  const [code, setCode] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // 🆕
  const [timeLeft, setTimeLeft] = useState(900);
  const [evaluationResult, setEvaluationResult] = useState<{ feedback: string, score: number } | null>(null);
  

  // Lancement du timer
  useEffect(() => {
    if (isTimeUp) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setHasSubmitted(true); // l'utilisateur a soumis
          setIsTimeUp(true); // stop le timer si ce n'était pas déjà fait          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimeUp]);

  // Initialisation des données du test
  useEffect(() => {
    const nameParam = searchParams.get('name');
    const langParam = searchParams.get('lang');

    const decodedName = nameParam ? decodeURIComponent(nameParam).toLowerCase() : '';
    const decodedLang = langParam ? decodeURIComponent(langParam).toLowerCase() : '';

    const allTests: TestType[] = (testsData as unknown as { tests: TestType[] }).tests;

    let testId = '';
    if (decodedName.includes('frontend')) testId = 'frontend';
    else if (decodedName.includes('backend')) testId = 'backend';
    else testId = decodedName;

    const found = allTests.find((t) => t.id === testId);

    if (found) {
      setTestData(found);
      const selectedLang = found.languages.includes(decodedLang) ? decodedLang : found.languages[0];
      const initialCode = found.examples[selectedLang] || found.defaultCode || '';
      setCode(initialCode);

      fetch(`/api/evaluate?name=${encodeURIComponent(nameParam || '')}&lang=${encodeURIComponent(langParam || '')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'question',
          testId,
          description: found.description
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (data?.question) setGeneratedQuestion(data.question);
        })
        .catch(console.error);

      const userStored = localStorage.getItem('userId');
      if (userStored) {
        // Optionnel: setUserId(userStored);
      }
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!code.trim()) return;

    setIsTimeUp(true); // stop timer

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          name: 'html',
          lang: 'html',
          code,
        }),
      });

      const data = await response.json();
      if (data) {
        setEvaluationResult({
          feedback: data.feedback,
          score: data.score,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl text-gray-800 font-bold">{testData?.title}</h1>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="font-semibold text-gray-600">Question Générée :</h2>
        <p className="text-gray-600">{generatedQuestion}</p>
      </div>

      <div className="relative">
        <Editor
          height="400px"
          defaultLanguage={testData?.languages[0] || 'javascript'}
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || '')}
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {isTimeUp ? 'Temps écoulé' : `Temps restant : ${formatTime(timeLeft)}`}
        </p>
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded text-white ${
            (isTimeUp || hasSubmitted) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          }`}
          disabled={isTimeUp || hasSubmitted}
        >
          Soumettre
        </button>
      </div>

      {evaluationResult && (
        <div className="bg-green-100 p-4 rounded-md mt-4">
          <p><strong>Note :</strong> {evaluationResult.score}/10</p>
          <p><strong>Feedback :</strong> {evaluationResult.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
