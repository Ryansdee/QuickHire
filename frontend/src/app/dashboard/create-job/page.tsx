// src/pages/create-job.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../lib/firebase';

const CreateJob = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sauvegarder les critères dans une base de données
    // Assurez-vous que ces données sont enregistrées dans Firestore ou une autre base de données
    
    console.log({
      jobTitle,
      experienceYears,
      skills,
      location,
    });

    router.push('/dashboard'); // Rediriger vers un tableau de bord ou autre page.
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Créer une offre d'emploi</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Titre du poste</label>
          <input 
            type="text" 
            value={jobTitle} 
            onChange={(e) => setJobTitle(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Années d'expérience requises</label>
          <input 
            type="number" 
            value={experienceYears} 
            onChange={(e) => setExperienceYears(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Compétences requises</label>
          <input 
            type="text" 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Localisation</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded" 
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-2 bg-indigo-500 text-white rounded-md"
        >
          Créer l'offre
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
