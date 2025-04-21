'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import tests from './tests.json'; // Le JSON de test
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

type TestType = {
  title: string;
  description: string;
  placeholder: string;
  defaultCode?: string;
  reactCode?: string;   // Code spécifique React (si nécessaire)
  htmlCode?: { html: string; js: string };  // Code spécifique HTML/JS (si nécessaire)
  nodeCode?: string;  // Code spécifique Node.js (si nécessaire)
};

const TestPage = () => {
  const searchParams = useSearchParams();
  const [testData, setTestData] = useState<TestType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState<string>('');  // Code à éditer
  const [language, setLanguage] = useState<string>('');  // Langage sélectionné
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 minutes en secondes
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false); // Si le temps est écoulé

  useEffect(() => {
    const type = searchParams.get('name');
    const decodedType = type ? decodeURIComponent(type) : '';

    const foundTest = decodedType && (tests as Record<string, TestType>)[decodedType];
    if (foundTest) {
      setTestData(foundTest);

      // Initialisation du code en fonction du type de test
      if (foundTest.reactCode) {
        setCode(foundTest.reactCode);
        setLanguage('react');
      } else if (foundTest.htmlCode) {
        setCode(foundTest.htmlCode.html + '\n' + foundTest.htmlCode.js);
        setLanguage('html');
      } else if (foundTest.nodeCode) {
        setCode(foundTest.nodeCode);
        setLanguage('node');
      } else {
        setCode(foundTest.defaultCode || '<h1>Hello World</h1>');
        setLanguage('html');
      }
    }

    setIsLoading(false);

    // Timer setup (15 minutes countdown)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);

    // Modifier le code en fonction du langage choisi
    if (testData) {
      if (selectedLanguage === 'react' && testData.reactCode) {
        setCode(testData.reactCode);
      } else if (selectedLanguage === 'html' && testData.htmlCode) {
        setCode(testData.htmlCode.html + '\n' + testData.htmlCode.js);
      } else if (selectedLanguage === 'node' && testData.nodeCode) {
        setCode(testData.nodeCode);
      } else {
        setCode(testData.defaultCode || '<h1>Hello World</h1>');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmitTest = () => {
    // Logique de soumission de test et de notation (par exemple, vérifier si le code est valide)
    alert('Test soumis et noté !');
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Instruction Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{testData?.title}</h2>
          <p className="text-gray-900">{testData?.description}</p>
        </div>

        {/* IDE + Preview */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          {/* Langage Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900" htmlFor="language">
              Choisissez un langage
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isTimeUp}
            >
              <option value="html">HTML / JavaScript</option>
              <option value="react">React</option>
              <option value="node">Node.js</option>
            </select>
          </div>

          {/* Timer Display */}
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-900">
              Temps restant: {isTimeUp ? 'Temps écoulé' : formatTime(timeLeft)}
            </p>
          </div>

          {/* Code Editor */}
          <LiveProvider code={code} noInline={true}>
            <div className="mb-4">
              <LiveEditor
                onChange={(newCode) => setCode(newCode)}
                className="bg-gray-100 rounded-md p-2 text-sm font-mono h-100 overflow-auto"
                aria-placeholder={testData?.placeholder || 'Écrivez votre code ici...'}
                disabled={isTimeUp}
              />
            </div>

            {/* Preview section */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Aperçu</h3>
              <div className="p-4 border rounded-md bg-gray-50 text-gray-500">
                <LivePreview />
              </div>
            </div>
          </LiveProvider>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              onClick={handleSubmitTest}
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-400"
              disabled={isTimeUp}
            >
              {isTimeUp ? 'Test soumis automatiquement' : 'Soumettre le test'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
