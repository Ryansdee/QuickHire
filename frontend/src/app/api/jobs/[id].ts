// src/pages/api/jobs/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getJobById } from '../../../../lib/jobs';  // Assurez-vous que le chemin vers lib/jobs est correct

// Fonction pour gérer la requête GET pour récupérer un job par ID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;  // Récupérer l'ID du job depuis l'URL

  if (req.method === 'GET') {
    try {
      const job = await getJobById(id as string);  // Appeler la fonction pour récupérer le job par ID

      if (!job) {
        return res.status(404).json({ message: 'Job non trouvé' });  // Retourner une erreur 404 si le job n'existe pas
      }

      return res.status(200).json(job);  // Retourner les données du job si trouvé
    } catch (error) {
      console.error('Erreur lors de la récupération du job:', error);
      return res.status(500).json({ message: 'Erreur interne du serveur' });  // Gérer l'erreur serveur
    }
  } else {
    // Si ce n'est pas une requête GET, retourner un code 405 (Méthode non autorisée)
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
}
