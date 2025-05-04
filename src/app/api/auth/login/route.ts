// Fichier : app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // On récupère les données envoyées (username, password)
  const body = await request.json();
  const { username, password } = body;

  // Mock database
  const mockUser = {
    username: "admin",
    password: "password123"
  };

  // Simulation d'une authentification
  if (username === mockUser.username && password === mockUser.password) {
    return NextResponse.json({ message: "Connexion réussie" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Nom d'utilisateur ou mot de passe incorrect" }, { status: 401 });
  }
}
