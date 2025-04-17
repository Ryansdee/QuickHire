'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const UploadCV = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cvFile) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', cvFile);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Fichier téléchargé avec succès');
      router.push('/dashboard/cv-dashboard');
    } else {
      alert('Erreur lors du téléchargement');
    }

    setUploading(false);
  };

  return (
    <div className="max-w mx-auto p-8 bg-white shadow-lg text-gray-700">
      <h2 className="text-2xl font-semibold mb-6">Télécharger les CV</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Sélectionner les CV</label>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-500 text-white rounded-md"
          disabled={uploading}
        >
          {uploading ? 'Téléchargement...' : 'Télécharger'}
        </button>
      </form>
    </div>
  );
};

export default UploadCV;
