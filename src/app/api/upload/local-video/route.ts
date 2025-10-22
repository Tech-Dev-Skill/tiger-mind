import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
    }

    // Ruta de almacenamiento en tu VPS (carpeta /public/videos)
    const uploadDir = path.join(process.cwd(), 'public', 'videos');
    await fs.mkdir(uploadDir, { recursive: true });

    // Guardar el archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    // Crear la URL pública
    const videoUrl = `/videos/${fileName}`;

    return NextResponse.json({ success: true, url: videoUrl });
  } catch (err) {
    console.error('Error al subir video:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
