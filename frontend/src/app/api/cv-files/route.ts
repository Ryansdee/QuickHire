import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const directoryPath = path.join(process.cwd(), 'public/uploads');
    const files = fs.readdirSync(directoryPath);
    return NextResponse.json({ files });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Impossible de récupérer les fichiers.' }, { status: 500 });
  }
}
