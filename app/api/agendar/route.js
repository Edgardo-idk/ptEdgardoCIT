import connectDB from "@/app/lib/db";
import mongoose from "mongoose";
import { verifyJWT } from "@/app/lib/verificarJwt";

const CitaSchema = new mongoose.Schema({
  usuario: String,
  fecha: String,
  hora: String,
  especialidad: String,
});
const Cita = mongoose.models.Cita || mongoose.model("Cita", CitaSchema, "citas");

// Sirve para agendar una cita
export async function POST(req) {
  await connectDB();

  // Verificar el token JWT antes de enviar la cita
  const user = verifyJWT(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  const { usuario, fecha, hora, especialidad } = await req.json();

  console.log("CITA Recibida:", usuario, fecha, hora, especialidad);

  // Validación simple de datos enviados
  if (!usuario || !fecha || !hora || !especialidad) {
    return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
  }

  // Validar que no exista una cita para el mismo usuario, fecha, hora y especialidad
  const citaExistente = await Cita.findOne({ usuario, fecha, hora, especialidad });
  if (citaExistente) {
    return new Response(JSON.stringify({ error: "Ya tienes una cita agendada en esa fecha y hora." }), { status: 409 });
  }

  // Guardar la cita
  const nuevaCita = await Cita.create({ usuario, fecha, hora, especialidad });
  console.log("CITA Guardada:", nuevaCita);

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}

// Obtener citas por usuario (GET)
export async function GET(req) {
  await connectDB();

  const user = verifyJWT(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const usuario = searchParams.get("usuario");
  if (!usuario) {
    return new Response(JSON.stringify({ error: "Usuario requerido" }), { status: 400 });
  }
  const citas = await Cita.find({ usuario });
  return new Response(JSON.stringify(citas), { status: 200 });
}

// Eliminar cita por Id
export async function DELETE(req) {
  await connectDB();

  const user = verifyJWT(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });
  }
  await Cita.findByIdAndDelete(id);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}