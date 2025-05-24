import connectDB from "@/app/lib/db";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  correo: String,
  password: String,
});
const User = mongoose.models.User || mongoose.model("User", UserSchema, "login");

// Metodo para registrar un nuevo usuario
export async function POST(req) {
  await connectDB();
  const { correo, password } = await req.json();

  console.log("REGISTER Recibido:", correo, password);

  // Verifica si el usuario ya existe
  const exists = await User.findOne({ correo });
  console.log("REGISTER Usuario ya existe:", exists);

  if (exists) {
    return new Response(JSON.stringify({ error: "El usuario ya existe" }), { status: 409 });
  }

  // Crea el usuario
  const nuevo = await User.create({ correo, password });
  console.log("REGISTER Usuario creado:", nuevo);

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}