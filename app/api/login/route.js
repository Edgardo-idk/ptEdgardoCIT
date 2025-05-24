import connectDB from "@/app/lib/db";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "claveprueba";

const UserSchema = new mongoose.Schema({
  correo: String,
  password: String,
});
const User = mongoose.models.User || mongoose.model("User", UserSchema, "login");

//Metodo para la autenticacion del usuario
// Este metodo recibe el correo y la contraseña del usuario y verifica si existe en la base de datos

export async function POST(req) {
  await connectDB();
  const { correo, password } = await req.json();

  console.log("Recibido:", correo, password); 

  const user = await User.findOne({ correo, password });
  console.log("Usuario encontrado:", user); 

  if (!user) {
    return new Response(JSON.stringify({ error: "Credenciales incorrectas" }), { status: 401 });
  }

  const token = jwt.sign({ correo }, SECRET, { expiresIn: "2h" });

  // Si el usuario existe, genera un token y lo devuelve al cliente
  return new Response(JSON.stringify({ success: true, token }), { status: 200 });
}