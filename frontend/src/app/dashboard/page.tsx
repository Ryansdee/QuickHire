'use client';

import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { HiOutlineDocumentText, HiOutlineBriefcase, HiOutlinePlusCircle, HiOutlinePhone, HiOutlineSearch } from 'react-icons/hi';

const Dashboard = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Logique de déconnexion ici, par exemple effacer un token ou rediriger
    router.push('/signin'); // Redirige vers la page de connexion après déconnexion
  };

  return (
    <>
      <Head>
        <title>Dashboard - QuickHire</title>
        <meta name="description" content="Tableau de bord de votre compte QuickHire" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Bienvenue sur votre tableau de bord</h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Gérez votre profil, vos candidatures et vos offres d'emploi en toute simplicité.
          </p>

          {/* Section des cartes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
              <div className="flex items-center space-x-4">
                <HiOutlineDocumentText className="text-indigo-500 text-3xl" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Candidatures en attente</h4>
                  <p className="text-gray-600">Vous avez 3 candidatures en attente d'approbation.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
              <div className="flex items-center space-x-4">
                <HiOutlineBriefcase className="text-green-500 text-3xl" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Offres d'emploi</h4>
                  <p className="text-gray-600">Vous avez 5 offres d'emploi en cours de publication.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
              <div className="flex items-center space-x-4">
                <HiOutlinePhone className="text-blue-500 text-3xl" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Profil</h4>
                  <p className="text-gray-600">Complétez votre profil pour obtenir plus de visibilité auprès des recruteurs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/create-job"
              className="bg-green-500 text-white rounded-lg p-6 flex items-center justify-between hover:bg-green-600 transition duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-4">
                <HiOutlinePlusCircle className="text-2xl" />
                <span>Créer une offre d'emploi</span>
              </div>
            </Link>
            <Link
              href="/dashboard/upload-cv"
              className="bg-blue-500 text-white rounded-lg p-6 flex items-center justify-between hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-4">
                <HiOutlineSearch className="text-2xl" />
                <span>Télécharger des CV</span>
              </div>
            </Link>
            <Link
              href="/dashboard/cv-dashboard"
              className="bg-yellow-500 text-white rounded-lg p-6 flex items-center justify-between hover:bg-yellow-600 transition duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-4">
                <HiOutlineSearch className="text-2xl" />
                <span>Trier les CV</span>
              </div>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
