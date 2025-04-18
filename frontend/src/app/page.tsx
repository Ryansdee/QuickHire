'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Job {
  id: number;
  jobTitle: string;
  company?: string;
  location: string;
  description: string;
}

const LandingPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Mettre à jour le titre de la page après le premier rendu
  useEffect(() => {
    document.title = "QuickHire - Trouvez votre talent idéal";
  }, []);  // Ce useEffect s'exécute une seule fois lors du rendu initial

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs', {
          method: 'GET',
        });
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Erreur lors du fetch des jobs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="Plateforme de recrutement rapide avec QuickHire" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-200 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">Accélérez vos recrutements et trouvez le talent idéal en un clic !</h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez une plateforme innovante qui simplifie vos processus de recrutement et vous aide à trouver des talents rapidement.
          </p>
        </div>
      </section>

      {/* Job Posts Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-semibold text-gray-800 mb-10 text-center">Explorez nos offres d'emploi récentes</h3>

          {loading ? (
            <p className="text-center text-gray-500">Chargement des offres d'emploi...</p>
          ) : jobs.length === 0 ? (
            <p className="text-center text-gray-500">Aucune offre pour le moment. Revenez bientôt !</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">{job.jobTitle}</h4>
                  <p className="text-gray-700 font-medium">Localisation : {job.location}</p>
                  <p className="text-gray-700" style={{ fontSize: 12, fontStyle: 'italic', textDecoration: 'underline' }}>
                    {job.company}
                  </p>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-indigo-500 hover:underline mt-4 block"
                  >
                    Voir plus
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default LandingPage;
