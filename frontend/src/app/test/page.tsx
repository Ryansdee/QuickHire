'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const TestPage = () => {
  const [isClient, setIsClient] = useState(false);  // État pour vérifier si on est côté client
  const [testContent, setTestContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);  // S'assurer que l'on est côté client
  }, []);

  // Ne pas appeler useRouter() tant que ce n'est pas côté client
  if (!isClient) {
    return <p>Chargement...</p>;  // Afficher un message de chargement ou rien avant que le côté client soit monté
  }

  const router = useRouter();  // Appel de useRouter uniquement côté client

  useEffect(() => {
    if (router.isReady) {
      const { type } = router.query;
      const decodedType = type ? decodeURIComponent(type as string) : '';

      if (decodedType === 'frontend') {
        setTestContent(`
          <h2>Test de développement Frontend (HTML/React)</h2>
          <p>Construisez une interface simple en HTML/CSS/React...</p>
          <textarea placeholder="Écrivez votre code ici..." className="w-full h-60 p-2 border border-gray-300"></textarea>
        `);
      } else if (decodedType === 'backend') {
        setTestContent(`
          <h2>Test de développement Backend (Node.js)</h2>
          <p>Écrivez une fonction qui résout ce problème...</p>
          <textarea placeholder="Écrivez votre code ici..." className="w-full h-60 p-2 border border-gray-300"></textarea>
        `);
      } else if (decodedType === 'développeur frontend') {
        setTestContent(`
          <h2>Test pour Développeur Frontend</h2>
          <p>Écrivez un composant React en utilisant HTML, CSS, et React.</p>
          <textarea placeholder="Écrivez votre code ici..." className="w-full h-60 p-2 border border-gray-300"></textarea>
        `);
      } else {
        setTestContent('<p>Test non disponible pour ce type de job.</p>');
      }
      setIsLoading(false); // Fin du chargement
    }
  }, [router.isReady, router.query]);

  if (isLoading) return <p>Chargement...</p>;  // Message de chargement jusqu'à ce que tout soit prêt

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Test de codage</h1>
        <div dangerouslySetInnerHTML={{ __html: testContent || '<p>Chargement du test...</p>' }} />
      </div>
    </div>
  );
};

export default TestPage;
