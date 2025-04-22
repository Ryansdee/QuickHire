// pages/api/response/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { submitResponse, getResponsesByEmployer, acceptResponse, rejectResponse } from '../../../../lib/response';  // Assurez-vous que le chemin est correct

// Récupérer toutes les réponses pour un test
export async function GET(request: NextRequest) {
    try {
      const { author } = request.query;
  
      if (!author) {
        return NextResponse.json({ error: 'author est requis' }, { status: 400 });
      }
  
      const responses = await getResponsesByEmployer(author as string); // Récupère les réponses de l'employeur
      return NextResponse.json(responses);
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des réponses' }, { status: 500 });
    }
  }

// Soumettre une réponse
export async function POST(request: NextRequest) {
  try {
    const { testId, candidateId, code } = await request.json();

    if (!testId || !candidateId || !code) {
      return NextResponse.json({ error: 'Tous les champs doivent être remplis' }, { status: 400 });
    }

    const result = await submitResponse(testId, candidateId, code);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erreur lors de la soumission de la réponse:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur inconnue' }, { status: 500 });
  }
}

// Accepter une réponse
export async function PUT(request: NextRequest) {
  try {
    const { responseId } = await request.json();

    if (!responseId) {
      return NextResponse.json({ error: 'responseId est requis' }, { status: 400 });
    }

    const result = await acceptResponse(responseId);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la réponse:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Rejeter une réponse
export async function DELETE(request: NextRequest) {
  try {
    const { responseId } = await request.json();

    if (!responseId) {
      return NextResponse.json({ error: 'responseId est requis' }, { status: 400 });
    }

    const result = await rejectResponse(responseId);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erreur lors du rejet de la réponse:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
