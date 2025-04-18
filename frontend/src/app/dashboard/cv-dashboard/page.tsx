'use client';

import { useEffect, useState } from 'react';

const CvDashboard = () => {
  const [cvFiles, setCvFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [keywords, setKeywords] = useState<string>('');

  useEffect(() => {
    const fetchCvFiles = async () => {
      try {
        const res = await fetch('/api/cv-files');
        if (res.ok) {
          const data = await res.json();
          setCvFiles(data.files);
        } else {
          setError('Erreur de récupération des fichiers');
        }
      } catch (error) {
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchCvFiles();
  }, []);

  const handleDelete = async (file: any) => {
    const isConfirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer le fichier "${file}" ?`);

    if (!isConfirmed) return;

    try {
      // Log avant appel API pour vérifier le fichier
      console.log(`Suppression du fichier: ${file}`);

      // Appel à l'API pour supprimer le fichier côté backend (passer le nom du fichier)
      const res = await fetch('/api/delete-file', {
        method: 'POST',
        body: JSON.stringify({ filePath: `uploads/${file}` }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Vérification du statut de la réponse
      if (!res.ok) {
        const message = await res.text(); // Récupérer le message d'erreur renvoyé par l'API
        throw new Error(message || 'Erreur lors de la suppression du fichier');
      }

      console.log(`Fichier ${file} supprimé avec succès`);
      // Si la suppression sur le backend a réussi, supprimer localement
      setCvFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));  // On compare les noms des fichiers
    } catch (error) {
      // Log de l'erreur
      console.error('Erreur lors de la suppression du fichier:', error);
      setError(`Erreur lors de la suppression du fichier : ${error instanceof Error ? error.message : 'Inconnue'}`);
    }
  };

  const filterFiles = (files: any[], keywords: string) => {
    if (!keywords.trim()) return files; // Si aucun mot-clé, retourner tous les fichiers

    const keywordList = keywords.toLowerCase().split(',').map(k => k.trim());

    return files.filter(file => 
      keywordList.some(kw => file.textContent?.toLowerCase().includes(kw))
    );
  };

  const sortFiles = (files: any[]) => {
    return files.sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'date') {
        const dateA = new Date(a.uploadDate || 0).getTime();
        const dateB = new Date(b.uploadDate || 0).getTime();
        return dateB - dateA;
      }
      return 0;
    });
  };

  return (
    <div className="max-w-8xl mx-auto p-8 bg-gray-50 shadow-xl text-center">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">Tableau de Bord des CV</h2>

      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-t-4 border-blue-500 rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Chargement des fichiers...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-lg font-medium">{error}</p>
      ) : (
        <>
          {/* Mots-clés */}
          <div className="mb-6">
            <label className="mr-4 text-gray-800 font-medium">Mots-clés (séparés par des virgules) :</label>
            <input
              type="text"
              placeholder="ex: react, figma, node"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="p-2 w-96 border rounded text-gray-800"
            />
          </div>

          {/* Tri des CV */}
          <div className="mb-6">
            <label className="mr-4 text-gray-800">Trier par :</label>
            <select
              className="p-2 border rounded text-gray-800"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Nom</option>
              <option value="date">Date</option>
            </select>
          </div>

          {/* Liste des fichiers */}
          <div className="space-y-6">
            {filterFiles(cvFiles, keywords).length > 0 ? (
              sortFiles(filterFiles(cvFiles, keywords)).map((file, index) => {
                // Définir filePath pour chaque fichier ici
                const filePath = `/uploads/${file}`;
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-all">
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-medium text-gray-700">{file}</span>
                      <a
                        href={filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <i className="fas fa-eye mr-2"></i> Voir
                      </a>
                    </div>
                    <button
                      onClick={() => handleDelete(file)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      <i className="fas fa-trash-alt"></i> Supprimer
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-lg text-gray-500">Aucun CV correspondant aux mots-clés.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CvDashboard;
