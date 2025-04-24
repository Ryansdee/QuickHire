// src/components/TestPage.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import testsData from './tests.json';
import './test.css';

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
  const [timeLeft, setTimeLeft] = useState(900);  // Initialement 15 minutes
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [userId, setUserId] = useState<string | null>(null);  // L'ID de l'utilisateur actuel
  const [evaluationResult, setEvaluationResult] = useState<{ feedback: string, score: number } | null>(null);

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
  
      // Appel API pour générer une question
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
          if (!res.ok) {
            const text = await res.text();
            console.error('Erreur API (text brut) :', text);
            return;
          }
          const data = await res.json();
          if (data?.question) {
            setGeneratedQuestion(data.question);
          } else {
            console.error('Réponse mal formatée de l’API:', data);
          }
        })
        .catch((err) => console.error('Erreur fetch question:', err));
  
      // Vérifier l'utilisateur actuel
      const userStored = localStorage.getItem('userId');
      if (userStored) setUserId(userStored);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setIsTimeUp(true);
  
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
      } else {
        console.error('Aucune donnée reçue après soumission.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };
  
  return (
    <div className="test-page">
      <h1>Test: {testData?.title}</h1>
      <p>{testData?.description}</p>
      <div className="code-editor">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={testData?.placeholder || 'Écrivez votre code ici...'}
        />
      </div>
      <button onClick={handleSubmit} disabled={isTimeUp}>Soumettre</button>
      {isTimeUp && <p>Le temps est écoulé !</p>}
      {evaluationResult && (
        <div className="evaluation-result">
          <p>Note: {evaluationResult.score}/10</p>
          <p>Feedback: {evaluationResult.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
