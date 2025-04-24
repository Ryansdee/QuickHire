// src/app/api/evaluate/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialisation de l'API GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: '',  // Assurez-vous de remplacer cela par votre véritable clé API
});

// Fonction pour générer une question courte d'exercice pratique
export const generateQuestion = async (name: string, lang: string) => {
  console.log(`Le nom: ${name}, et langue: ${lang}`);  // Afficher les paramètres reçus

  // Ajuster le prompt pour obtenir une question courte en fonction de la langue
  let prompt = '';
  if (lang.toLowerCase() === 'html') {
    prompt = `Génère une petite question d'exercice simple pratique pour du html. Faites une question simple de 1/2 phrases max.`;
  } else if (lang.toLowerCase() === 'css') {
    prompt = `Génère une petite question d'exercice pratique pour du css. Faites une question simple de 1/2 phrases max.`;
  } else {
    prompt = `Écrivez = Je n'ai pas pu récupérer et générer une question`;
  }

  console.log('Prompt envoyé à l\'API:', prompt);  // Vérifier le prompt envoyé

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',  // Utilisez le modèle flash pour des réponses plus rapides
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    console.log('Réponse générée:', result.text);  // Affichez la réponse générée pour le débogage
    return result.text || 'Aucune question générée'; // Retourne la question générée
  } catch (error) {
    console.error('Erreur pendant l’évaluation du code:', error);
    throw new Error('Impossible d’évaluer le code correctement');
  }
};

// Fonction principale de l'API pour générer une question ou évaluer un code
export async function POST(req: Request) {
  console.log('Requête reçue dans POST');

  try {
    const url = new URL(req.url);
    const name = url.searchParams.get('name'); // Paramètre 'name' de l'URL
    const lang = url.searchParams.get('lang'); // Paramètre 'lang' de l'URL
    const code = url.searchParams.get('code'); // Paramètre 'code' pour l'évaluation

    console.log("Nom:", name, "Langue:", lang, "Code:", code);

    if (!name || !lang) {
      return NextResponse.json({ error: 'Les paramètres "name" et "lang" sont obligatoires' }, { status: 400 });
    }

    let question = '';

    // Si le paramètre "code" est présent, évaluer le code
    if (code) {
      question = await generateQuestion(name, lang);  // Générer une question liée à l'exercice
      console.log('Question générée:', question);

      // Appel de la fonction pour évaluer le code
      const evaluation = await evaluateCode(code, question);
      console.log('Évaluation du code:', evaluation);

      if (evaluation && typeof evaluation === 'object') {
        return NextResponse.json(evaluation);  // Retourne l'évaluation du code
      } else {
        return NextResponse.json({
          error: 'Résultat d’évaluation invalide',
          result: String(evaluation),
        }, { status: 500 });
      }
    }

    // Si le paramètre "code" n'est pas présent, générer une question
    question = await generateQuestion(name, lang);
    console.log('Question générée:', question);

    return NextResponse.json({ question });  // Retourne la question générée

  } catch (error) {
    console.error('Erreur dans le traitement de la requête:', error);
    return NextResponse.json({ error: 'Erreur lors du traitement de la requête' }, { status: 500 });
  }
}

// Fonction pour évaluer le code
export const evaluateCode = async (code: string, question: string) => {
  const prompt = `Tu es un correcteur de code. Voici la consigne : "${question}". 
Voici le code soumis par le candidat :
${code}

Corrige ce code si nécessaire. Puis, attribue une note sur 10 et donne un feedback clair, constructif et court (3-4 phrases max).
Format de réponse attendu (JSON uniquement) :
{
  "score": 7,
  "feedback": "Ton code fonctionne mais pourrait être mieux structuré. Tu aurais pu utiliser une balise <section> pour clarifier la structure. Bien joué pour la partie CSS !"
}`;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0',  // Utilisez le modèle correct
      contents: [{ role: 'user', parts: [{ text: prompt }] }], 
    });

    const text = result.text;  // Récupère la réponse brute de l'API
    console.log('Réponse complète de Gemini:', text);

    // Extraction du JSON dans le texte retourné
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error('Aucun JSON détecté dans la réponse AI');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.score !== 'number' || typeof parsed.feedback !== 'string') {
      throw new Error('Le JSON ne contient pas les bons champs');
    }

    return parsed;
  } catch (error) {
    console.error('Erreur pendant l’évaluation du code:', error);

    return {
      score: 0,
      feedback: 'Erreur lors de l’évaluation. Assure-toi que ton code est valide.',
    };
  }
};
