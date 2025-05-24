import mongoose from "mongoose";

// Coneccion a la base de datos de MongoDB
//localhost:27017/gestor cambiar el localhost segun en donde alojaran para hacer la prueba
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gestor";

// Verifica si la URI de MongoDB está definida
// Si no está definida, lanza un error
export default async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}