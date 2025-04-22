'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import testsData from './tests.json';


type TestType = {
  id: string;
  title: string;
  description: string;
  languages: string[];
  placeholder: string;
  defaultCode: string;
  examples: Record<string, string>;
  correctAnswers: string[];
};

type CandidateSubmission = {
  candidateId: string;
  code: string;
};

const TestPage = () => {
  const searchParams = useSearchParams();
  const [testData, setTestData] = useState<TestType | null>(null);
  const [code, setCode] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]); // État pour stocker les soumissions des candidats
  const [selectedSubmission, setSelectedSubmission] = useState<CandidateSubmission | null>(null); // Soumission sélectionnée par l'auteur

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

      const selectedLang = found.languages && found.languages.includes(decodedLang)
        ? decodedLang
        : found.languages[0];

      const initialCode = found.examples[selectedLang] || found.defaultCode || '';
      setCode(initialCode);
    } else {
      setTestData(null);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams]);

// Extrait du code côté client dans `page.tsx`
const handleSubmit = async (candidateId: string) => {
  if (!testData) return;

  const submission = {
    candidateId,
    code: code.trim(),
  };

  try {
    const response = await fetch('/api/response', {
      method: 'POST',  // Utiliser la méthode POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testId: testData.id,
        candidateId,
        code: submission.code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur lors de la soumission:', errorData.error);
      return;
    }

    const data = await response.json();
    console.log('Réponse soumise avec succès:', data);

    // Ajouter la soumission dans l'état ou effectuer d'autres actions
    setSubmissions((prevSubmissions) => [...prevSubmissions, submission]);
    setIsTimeUp(true);
  } catch (error) {
    console.error('Erreur lors de la soumission de la réponse:', error);
  }
};


  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSelection = (submission: CandidateSubmission) => {
    setSelectedSubmission(submission); // L'auteur sélectionne la proposition
  };

  if (!testData) return <p className="text-center py-10">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{testData.title}</h1>
          <p className="text-gray-700">{testData.description}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={testData.placeholder}
              disabled={isTimeUp}
              rows={12}
              className="w-full font-mono p-3 rounded-md border text-gray-500 border-gray-300 bg-gray-50"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-lg font-medium text-gray-700">
              Temps restant : {isTimeUp ? 'Temps écoulé' : formatTime(timeLeft)}
            </div>

            <button
              onClick={() => handleSubmit("candidate1")} // L'ID du candidat peut être dynamique
              disabled={isTimeUp}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-400"
            >
              {isTimeUp ? 'Test verrouillé' : 'Soumettre le test'}
            </button>
          </div>

          {/* Affichage des soumissions des candidats */}
          {isTimeUp && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800">Propositions des candidats :</h2>
              <ul className="mt-4 space-y-4">
                {submissions.map((submission, index) => (
                  <li key={index} className="p-4 bg-gray-50 border rounded-md">
                    <div className="font-semibold text-gray-700">
                      Candidat : {submission.candidateId}
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap">{submission.code}</pre>
                    <button
                      onClick={() => handleSelection(submission)}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      Sélectionner cette proposition
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Affichage de la proposition sélectionnée par l'auteur */}
          {selectedSubmission && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
              <h3 className="font-semibold">Proposition sélectionnée :</h3>
              <pre className="mt-2 whitespace-pre-wrap">{selectedSubmission.code}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
