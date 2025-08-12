import React, { useState } from "react";
import "./TareaItem.css";

function TareaItem({
  tarea,
  editandoId,
  textoEditado,
  onToggle,
  onEditar,
  onGuardar,
  onCancelar,
  onEliminar,
  setTextoEditado
}) {
  const [saliendo, setSaliendo] = useState(false);

  const handleEliminar = () => {
    const confirmar = window.confirm("¿Seguro que desea eliminar la tarea?");
    if (confirmar){
      setSaliendo(true);
    }
  };

  const onAnimationEnd = () => {
    if (saliendo) {
      onEliminar(tarea._id);
    }
  };

  return (
    <li
      className={`tarea-item ${tarea.completada ? "tarea-completada" : ""} ${saliendo ? "saliendo" : ""}`}
      onAnimationEnd={onAnimationEnd}
    >
      {editandoId === tarea._id ? (
        <>
          <input
            type="text"
            value={textoEditado}
            onChange={(e) => setTextoEditado(e.target.value)}
            className="tarea-input-editar"
          />
          <button className="btn-guardar" onClick={() => onGuardar(tarea._id)}>Guardar</button>
          <button className="btn-cancelar" onClick={onCancelar}>Cancelar</button>
        </>
      ) : (
        <>
          <span
            onClick={() => onToggle(tarea._id, tarea.completada)}
            className="tarea-toggle"
          >
            {tarea.completada ? "✅" : <span className="tarea-pendiente">❌</span>}
            <span className={`tarea-texto ${tarea.completada ? "tachado" : ""}`}>
              {tarea.texto}
            </span>
            <small className="tarea-fecha">
              {tarea.createdAt
                ? new Date(tarea.createdAt).toLocaleDateString()
                : "Sin fecha"}
            </small>
          </span>
          <button 
            onClick={() => onEditar(tarea._id, tarea.texto)} 
            className="btn-editar"
            aria-label="Editar tarea"
          >
            Editar
          </button>
          <button 
            onClick={handleEliminar}
            className="btn-eliminar"
            aria-label="Eliminar tarea"
          >
            Eliminar
          </button>
        </>
      )}
    </li>
  );
}

export default TareaItem;
