import jwt from "jsonwebtoken";

// definir el token
const SECRET = process.env.JWT_SECRET || "claveprueba";

// Verifica si el token es valido
export function verifyJWT(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}