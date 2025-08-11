import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');
  const [filtro, setFiltro] = useState('todas'); // Estado para filtro
  const [filtroMes, setFiltroMes] = useState("");

  useEffect(() => {
    axios.get('https://todolistbackend-nabu.onrender.com/api/tasks')
      .then(res => {
        setTareas(res.data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error al traer tareas:', err);
        setCargando(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;

    try {
      const fechaActual = new Date().toISOString().split('T')[0];

      const res = await axios.post('https://todolistbackend-nabu.onrender.com/api/tasks', {
        texto: nuevaTarea.trim(),
        fecha: fechaActual
      });
      setTareas([...tareas, res.data]);
      setNuevaTarea('');
    } catch (error) {
      console.error('Error creando tarea:', error);
    }
  };

  const toggleCompletada = async (id, completadaActual) => {
    try {
      const res = await axios.put(`https://todolistbackend-nabu.onrender.com/api/tasks/${id}`, {
        completada: !completadaActual,
      });
      setTareas(tareas.map(tarea => tarea._id === id ? res.data : tarea));
    } catch (error) {
      console.error('Error actualizando tarea:', error);
    }
  };

  const eliminarTarea = async (id) => {
    const confirmar = window.confirm('¿Estás seguro que desea eliminar esta tarea?');

    if (!confirmar) return;

    try{
      await axios.delete(`https://todolistbackend-nabu.onrender.com/api/tasks/${id}`);
      setTareas(tareas.filter(tarea => tarea._id !== id));
    } catch (error) {
      console.error('Error eliminando la tarea: ', error);
    }
  };

  const comenzarEdicion = (id, texto) => {
    setEditandoId(id);
    setTextoEditado(texto);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTextoEditado('');
  };

  const guardarEdicion = async (id) => {
    if (!textoEditado.trim()) return;

    try {
      const res = await axios.put(`https://todolistbackend-nabu.onrender.com/api/tasks/${id}`, {
        texto: textoEditado.trim(),
      });
      setTareas(tareas.map(tarea => tarea._id === id ? res.data : tarea));
      cancelarEdicion();
    } catch (error) {
      console.error('Error actualizando tarea:', error);
    }
  };

  if (cargando) {
    return <div>Cargando tareas...</div>;
  }

  // Aplicamos el filtro para mostrar solo las tareas correspondientes
  const tareasFiltradas = tareas.filter(tarea => {
    // Filtrar por tipo de tarea
    if (filtro === 'pendientes' && tarea.completada) return false;
    if (filtro === 'completadas' && !tarea.completada) return false;

    // Filtrar por mes si está seleccionado
    if (filtroMes) {
      if (!tarea.createdAt) return false;
      const mesTarea = new Date(tarea.createdAt).getMonth() + 1;
      if (mesTarea !== Number(filtroMes)) return false;
    }

    return true; // si pasa los filtros, la incluimos
  });


  return (
    <div className="App" style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Lista de tarea a realizar</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={nuevaTarea}
          onChange={e => setNuevaTarea(e.target.value)}
          style={{ padding: 8, width: '80%', marginRight: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Agregar</button>
      </form>

      {/* Botones para filtrar */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setFiltro('todas')}
          disabled={filtro === 'todas'}
          style={{ marginRight: 8 }}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro('pendientes')}
          disabled={filtro === 'pendientes'}
          style={{ marginRight: 8 }}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltro('completadas')}
          disabled={filtro === 'completadas'}
        >
          Completadas
        </button>
      </div>

      {/* Selector para filtrar por mes */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="mesFiltro" style={{ marginRight: 8 }}>Filtrar por mes:</label>
        <select
          id="mesFiltro"
          value={filtroMes}
          onChange={e => setFiltroMes(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>

      {tareasFiltradas.length === 0 ? (
        <p>No hay tareas para mostrar.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tareasFiltradas.map(tarea => (
            <li
              key={tarea._id}
              style={{
                marginBottom: 10,
                color: tarea.completada ? 'gray' : 'black',
                userSelect: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {editandoId === tarea._id ? (
                <>
                  <input
                    type="text"
                    value={textoEditado}
                    onChange={e => setTextoEditado(e.target.value)}
                    style={{ flexGrow: 1, padding: 6, marginRight: 8 }}
                  />
                  <button onClick={() => guardarEdicion(tarea._id)} style={{ marginRight: 4 }}>
                    Guardar
                  </button>
                  <button onClick={cancelarEdicion}>Cancelar</button>
                </>
              ) : (
                <>
                  <span
                    onClick={() => toggleCompletada(tarea._id, tarea.completada)}
                    style={{
                      cursor: 'pointer',
                      flexGrow: 1,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ textDecoration: 'none', marginLeft: 1 }}>
                      {tarea.completada ? '✅' : <span style={{ color: 'red' }}>❌</span>}
                    </span>
                    <span style={{ textDecoration: tarea.completada ? 'line-through' : 'none', marginLeft: 8 }}>
                      {tarea.texto}
                    </span>
                    <small style={{ marginLeft: 12, color: '#666', fontSize: '0.85em' }}>
                      {tarea.createdAt ? new Date(tarea.createdAt).toLocaleDateString() : 'Sin fecha'}
                    </small>
                  </span>

                  <button
                    onClick={() => comenzarEdicion(tarea._id, tarea.texto)}
                    style={{
                      marginLeft: 10,
                      background: 'transparent',
                      border: 'none',
                      color: 'blue',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                    aria-label="Editar tarea"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarTarea(tarea._id)}
                    style={{
                      marginLeft: 10,
                      background: 'transparent',
                      border: 'none',
                      color: 'red',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                    aria-label="Eliminar tarea"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
