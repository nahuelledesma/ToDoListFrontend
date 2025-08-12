import React, { useState, useEffect } from "react";
import {
  getTareas,
  crearTarea,
  actualizarTarea,
  eliminarTareaAPI,
} from "./services/tasksService";
import TareaLista from "./components/TareaLista";
import "./App.css"; // Importamos estilos

function App() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [filtroMes, setFiltroMes] = useState("");

  useEffect(() => {
    getTareas()
      .then((res) => {
        setTareas(res.data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;
    const fechaActual = new Date().toISOString().split("T")[0];
    const res = await crearTarea(nuevaTarea.trim(), fechaActual);
    setTareas([...tareas, res.data]);
    setNuevaTarea("");
  };

  const toggleCompletada = async (id, completada) => {
    const res = await actualizarTarea(id, { completada: !completada });
    setTareas(tareas.map((t) => (t._id === id ? res.data : t)));
  };

  const eliminarTarea = async (id) => {
    try{
      await eliminarTareaAPI(id);
      setTareas(tareas.filter((t) => t._id !== id));
    }catch (error){
      console.error("Error eliminando la tarea:", error);
    }
  };

  const comenzarEdicion = (id, texto) => {
    setEditandoId(id);
    setTextoEditado(texto);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTextoEditado("");
  };

  const guardarEdicion = async (id) => {
    if (!textoEditado.trim()) return;
    const res = await actualizarTarea(id, { texto: textoEditado.trim() });
    setTareas(tareas.map((t) => (t._id === id ? res.data : t)));
    cancelarEdicion();
  };

  const tareasFiltradas = tareas.filter((t) => {
    if (filtro === "pendientes" && t.completada) return false;
    if (filtro === "completadas" && !t.completada) return false;
    if (filtroMes && new Date(t.createdAt).getMonth() + 1 !== Number(filtroMes))
      return false;
    return true;
  });

  if (cargando) return <div>Cargando...</div>;

  return (
    <div className="app-container">
      <h1>Lista de tareas</h1>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Nueva tarea"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          className="input-tarea"
        />
        <button type="submit" className="btn-agregar">
          Agregar
        </button>
      </form>

      <div className="filtros">
        <button onClick={() => setFiltro("todas")}>Todas</button>
        <button onClick={() => setFiltro("pendientes")}>Pendientes</button>
        <button onClick={() => setFiltro("completadas")}>Completadas</button>
      </div>

      <div className="filtro-mes">
        <label>Filtrar por mes:</label>
        <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
          <option value="">Todos</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("es", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      <TareaLista
        tareas={tareasFiltradas}
        editandoId={editandoId}
        textoEditado={textoEditado}
        onToggle={toggleCompletada}
        onEditar={comenzarEdicion}
        onGuardar={guardarEdicion}
        onCancelar={cancelarEdicion}
        onEliminar={eliminarTarea}
        setTextoEditado={setTextoEditado}
      />
    </div>
  );
}

export default App;
