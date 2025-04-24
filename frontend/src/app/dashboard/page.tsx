'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { HiOutlineDocumentText, HiOutlineBriefcase, HiOutlinePlusCircle, HiOutlinePhone, HiOutlineSearch } from 'react-icons/hi';
import { useUser } from '../../context/UserContext';

const Dashboard = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    } else {
      router.push('/signin');
    }
  }, [setUser, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/jobs?authorId=${user.uid}`);
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  if (!user) return null;

  const firstN = user.firstName?.split(' ')[0] || 'Utilisateur';

  return (
    <>
      <Head>
        <title>Dashboard - QuickHire</title>
        <meta name="description" content="Tableau de bord de votre compte QuickHire" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <section className="py-20 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
            Bienvenue {firstN} sur votre tableau de bord
          </h2>

          <p className="text-xl text-gray-600 mb-12 text-center">
            Gérez votre profil, vos candidatures et vos offres d'emploi en toute simplicité.
          </p>

          {/* Cartes d'infos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <HiOutlineDocumentText className="text-indigo-500 text-3xl" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Candidatures en attente</h4>
                  <p className="text-gray-600">Bientôt disponible !</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <HiOutlineBriefcase className="text-green-500 text-3xl" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Offres d'emploi</h4>
                  {loading ? (
                    <p className="text-gray-600 animate-pulse">Chargement...</p>
                  ) : (
                    <p className="text-gray-600">
                      {jobs.length > 0
                        ? `Vous avez ${jobs.length} offre${jobs.length > 1 ? 's' : ''} publiées.`
                        : "Vous n'avez encore publié aucune offre."}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <HiOutlinePhone className="text-blue-500 text-3xl" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Profil</h4>
                  <p className="text-gray-600">Complétez votre profil pour plus de visibilité.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/create-job"
              className="bg-green-500 text-white rounded-lg p-6 flex items-center justify-between hover:bg-green-600 transition"
            >
              <div className="flex items-center space-x-4">
                <HiOutlinePlusCircle className="text-2xl" />
                <span>Créer une offre d'emploi</span>
              </div>
            </Link>
            <Link
              href="/dashboard/upload-cv"
              className="bg-blue-500 text-white rounded-lg p-6 flex items-center justify-between hover:bg-blue-600 transition"
            >
              <div className="flex items-center space-x-4">
                <HiOutlineSearch className="text-2xl" />
                <span>Télécharger des CV</span>
              </div>
            </Link>
            <Link
              href="/dashboard/cv-dashboard"
              className="bg-yellow-500 text-white rounded-lg p-6 flex items-center justify-between hover:bg-yellow-600 transition"
            >
              <div className="flex items-center space-x-4">
                <HiOutlineSearch className="text-2xl" />
                <span>Trier les CV</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
