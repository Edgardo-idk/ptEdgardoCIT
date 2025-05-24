"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const especialidades = [
  "Cardiología",
  "Dermatología",
  "Pediatría",
  "Oftalmología",
  "Ginecología",
  "Medicina General"
];

export default function Home() {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    especialidad: especialidades[0],
  });
  const [mensaje, setMensaje] = useState("");
  const [citas, setCitas] = useState([]);
  const usuario = typeof window !== "undefined" ? window.localStorage.getItem("correo") : null;
  const router = useRouter();

  // Obtener citas del usuario
  const fetchCitas = async () => {
    if (!usuario) return;
    // Verificar autenticacion del usuario
    const token = window.localStorage.getItem("token");
    const res = await fetch(`/api/agendar?usuario=${usuario}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setCitas(data);
    }
  };

  // Sirve para cargar las citas al iniciar la pagina y cada vez que se agende o borre una cita
  useEffect(() => {
    fetchCitas();
    // eslint-disable-next-line
  }, [mensaje]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Metodo para manejar el envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) {
      setMensaje("Error: No se encontró el usuario. Inicia sesión nuevamente.");
      return;
    }
    const token = window.localStorage.getItem("token");
    const res = await fetch("/api/agendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, usuario }),
    });
    if (res.ok) {
      setMensaje("¡Cita agendada exitosamente!");
      setForm({ fecha: "", hora: "", especialidad: especialidades[0] });
      fetchCitas();
    } else {
      const data = await res.json();
      setMensaje(data.error || "Error al agendar la cita");
    }
  };

  // Cancelar Citas
  const cancelarCita = async (id) => {
    const token = window.localStorage.getItem("token");
    const res = await fetch(`/api/agendar?id=${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (res.ok) {
      setMensaje("Cita cancelada");
      fetchCitas();
    }
  };

  // Cerrar sesion eliminando el token y el correo
  const handleLogout = () => {
    window.localStorage.removeItem("correo");
    window.localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          Cerrar sesión
        </button>
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-10 w-full max-w-2xl flex flex-col items-center gap-8 border border-blue-100">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg mb-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#fff" />
              <path d="M12 7v5l4 2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-700">¡Hola!</h1>
          <p className="text-gray-600 text-center">Bienvenido al gestor de citas médicas. Aquí puedes agendar, consultar o cancelar tus citas fácilmente.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 bg-white rounded-xl shadow p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-700 mb-2">Agendar nueva cita</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-700 mb-1">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-700 mb-1">Hora</label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-700 mb-1">Especialidad</label>
              <select
                name="especialidad"
                value={form.especialidad}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              >
                {especialidades.map((esp) => (
                  <option key={esp} value={esp}>{esp}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Agendar cita
          </button>
          {mensaje && <div className="text-green-600 text-center">{mensaje}</div>}
        </form>
        <h2 className="text-xl font-bold text-blue-700 mt-8 mb-2">Tus citas agendadas</h2>
        <div className="w-full">
          {citas.length === 0 ? (
            <div className="text-gray-500 text-center">No tienes citas agendadas.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {citas.map((cita) => (
                <div
                  key={cita._id}
                  className="flex flex-col gap-2 bg-white border border-blue-100 rounded-xl shadow-md p-4 relative"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <rect x="3" y="5" width="18" height="16" rx="3" fill="#2563eb" opacity="0.15" />
                        <rect x="3" y="5" width="18" height="16" rx="3" stroke="#2563eb" strokeWidth="2" />
                        <path d="M8 3v4M16 3v4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-700">{cita.especialidad}</div>
                      <div className="text-gray-600 text-sm flex items-center gap-2">
                        <span>
                          <svg className="inline mr-1" width="16" height="16" fill="none" viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="1.5" />
                          </svg>
                          {cita.fecha} {cita.hora}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => cancelarCita(cita._id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-xs shadow"
                    title="Cancelar cita"
                  >
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}