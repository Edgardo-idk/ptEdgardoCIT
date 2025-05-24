"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Metodo para manejar si el formulario se envia a registrar o iniciar sesion
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? "/api/register" : "/api/login";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      if (isRegister) {
        alert("Usuario registrado correctamente");
        setIsRegister(false);
        setForm({ correo: "", password: "" });
      } else {
        // Guardar el token y el correo para usarlo cuando agendamos citas
        const data = await res.json();
        window.localStorage.setItem("correo", form.correo);
        window.localStorage.setItem("token", data.token);
        // Redirigir a la pagina de citas
        router.push("/home");
      }
    } else {
      // Manejo de error
      const data = await res.json();
      alert(data.error || "Error");
    }
  };

  // Estructura y estilos de la pagina de inicio de sesion y registro
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-400">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 flex flex-col gap-8 border border-blue-100">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg mb-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#fff" />
              <path d="M12 7v5l4 2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-700">
            {isRegister ? "Crear cuenta" : "Bienvenido"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isRegister ? "Regístrate para gestionar tus citas" : "Gestor de Citas Médicas"}
          </p>
        </div>
        {/* Formulario de registro o inicio de sesión */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700" htmlFor="correo">
              Correo electrónico
            </label>
            <input
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-blue-700"
              type="email"
              id="correo"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700" htmlFor="password">
              Contraseña
            </label>
            <input
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-blue-700"
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
          >
            {isRegister ? "Registrarse" : "Entrar"}
          </button>
        </form>
        {/* Con este boton se cambia el estado de isRegister para alternar entre tipo de formulario */}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-xs text-blue-500 hover:underline text-center transition"
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  );
}