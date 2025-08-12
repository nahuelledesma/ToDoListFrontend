import axios from "axios";

const API_URL = "https://todolistbackend-nabu.onrender.com/api/tasks";

export const getTareas = () => axios.get(API_URL);

export const crearTarea = (texto, fecha) =>
  axios.post(API_URL, { texto, fecha });

export const actualizarTarea = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

export const eliminarTareaAPI = (id) =>
  axios.delete(`${API_URL}/${id}`);
