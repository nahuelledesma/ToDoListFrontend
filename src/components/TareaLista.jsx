import React from "react";
import TareaItem from "./TareaItem";
import "./TareaLista.css";

function TareaLista({
  tareas,
  editandoId,
  textoEditado,
  onToggle,
  onEditar,
  onGuardar,
  onCancelar,
  onEliminar,
  setTextoEditado
}) {
  if (tareas.length === 0) return <p>No hay tareas para mostrar.</p>;

  return (
    <ul className="tarea-lista">
      {tareas.map((tarea) => (
        <TareaItem
          key={tarea._id}
          tarea={tarea}
          editandoId={editandoId}
          textoEditado={textoEditado}
          onToggle={onToggle}
          onEditar={onEditar}
          onGuardar={onGuardar}
          onCancelar={onCancelar}
          onEliminar={onEliminar}
          setTextoEditado={setTextoEditado}
        />
      ))}
    </ul>
  );
}

export default TareaLista;
