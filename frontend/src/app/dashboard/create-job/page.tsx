// src/pages/create-job.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext' // 👈 Import du contexte utilisateur

const CreateJob = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const router = useRouter();
  const { user } = useUser(); // 👈 Utilisation du contexte

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour créer une offre.");
      return;
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          company,
          experienceYears,
          skills,
          location,
          description,
          tags,
          authorId: user.uid, // 👈 Envoi de l'UID Firebase
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Offre d'emploi créée avec succès:", data);
        router.push('/dashboard');
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'offre:", error);
      alert("Erreur lors de la création de l'offre: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="max-w mx-auto p-8 bg-white shadow-lg text-gray-600">
      <h2 className="text-2xl font-semibold mb-6">Créer une offre d'emploi</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Titre du poste</label>
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Nom de l'entreprise</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Années d'expérience requises</label>
          <input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Compétences requises</label>
          <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Localisation</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Description du poste</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={4} required />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold">Tags (mots-clés séparés par des virgules)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2 border rounded" placeholder="ex: react,nodejs,figma" />
        </div>
        <button type="submit" className="w-full py-2 bg-indigo-500 text-white rounded-md">
          Créer l'offre
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
