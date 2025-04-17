// page.tsx
'use client';

import Head from 'next/head';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>QuickHire - Trouvez votre talent idéal</title>
        <meta name="description" content="Plateforme de recrutement rapide avec QuickHire" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-200 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">Recrutez plus vite. Trouvez votre talent idéal.</h2>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez une plateforme innovante pour simplifier vos recrutements. Téléchargez votre CV, explorez les opportunités et connectez-vous avec des recruteurs.
          </p>
          <div>
            <Link
              href="/signup"
              className="px-8 py-3 bg-indigo-500 text-white rounded-lg text-lg hover:bg-indigo-600 transition"
            >
              Commencez maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-8">Pourquoi choisir QuickHire?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">Simplicité</h4>
              <p className="text-gray-600">
                Téléchargez votre CV en quelques clics et commencez à rechercher des opportunités immédiatement.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">Efficacité</h4>
              <p className="text-gray-600">
                Nous analysons les offres d’emploi et vous connectons avec les recruteurs qui correspondent à vos compétences.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">Sécurité</h4>
              <p className="text-gray-600">
                Votre sécurité et confidentialité sont notre priorité. Vos informations personnelles sont protégées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-200 py-20 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Prêt à démarrer?</h3>
          <p className="text-xl text-gray-600 mb-6">
            Rejoignez notre communauté de candidats et de recruteurs dès aujourd'hui.
          </p>
          <Link
            href="/signup"
            className="px-8 py-3 bg-indigo-500 text-white rounded-lg text-lg hover:bg-indigo-600 transition"
          >
            Inscrivez-vous maintenant
          </Link>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
