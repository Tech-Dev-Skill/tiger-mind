// src/app/page.tsx

export const dynamic = 'force-dynamic'; // <-- Añade esta línea

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/student');
}