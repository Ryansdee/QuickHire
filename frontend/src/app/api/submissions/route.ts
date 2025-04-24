// api/submissions/route.ts
import { NextResponse } from 'next/server';
import { insertFeedback } from '../../../../lib/submissions';  // Importation de la logique d'insertion
import { evaluateCode } from '../../../../lib/genai';

export async function POST(req: Request) {
  try {
    const { code, testId, candidateId, description } = await req.json();
    console.log('Données reçues:', { code, testId, candidateId, description });

    // Évaluation du code
    const evaluation = await evaluateCode(code);
    console.log('Évaluation terminée:', evaluation);
    
    if (!evaluation) {
      return NextResponse.json({ error: 'Erreur dans l\'évaluation du code' }, { status: 500 });
    }

    // Insertion dans la base de données via lib/submissions.ts
    const feedback = evaluation.feedback;
    const score = evaluation.score;

    const insertResult = await insertFeedback(testId, candidateId, code, feedback, score);
    
    if (insertResult.error) {
      return NextResponse.json({ error: insertResult.error }, { status: 500 });
    }

    return NextResponse.json({
      feedback,
      score,
    });
    
  } catch (error) {
    console.error('Erreur dans le traitement de la requête:', error);
    return NextResponse.json({ error: 'Erreur lors du traitement de la requête' }, { status: 500 });
  }
}
