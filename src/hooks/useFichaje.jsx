import { useState } from 'react';
import { 
  getMisFichajes, 
  createClockRecord, 
  updateClockRecord, 
  deleteClockRecord 
} from '../services/fichajes';
import moment from 'moment';

 
export const useFichaje = () => {
  const [fichajes, setFichajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  
  const cargarMisFichajes = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getMisFichajes(params);
      setFichajes(response || []);
      return response;
    } catch (err) {
      console.error('Error al cargar fichajes:', err);
      setError(err.response?.message || 'Error al cargar fichajes');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
   
  const registrarFichaje = async (fichajeData) => {
    setLoading(true);
    setError(null);
    
    try { 
      if (!fichajeData.fecha) {
        fichajeData.fecha = moment().format('YYYY-MM-DD');
      }
      
      if (!fichajeData.hora) {
        fichajeData.hora = moment().format('HH:mm:ss');
      }
      
      const response = await createClockRecord(fichajeData); 
      await cargarMisFichajes();
      return { success: true, data: response };
    } catch (err) {
      console.error('Error al registrar fichaje:', err);
      setError(err.response?.message || 'Error al registrar fichaje');
      return { success: false, error: err.response?.message || 'Error al registrar fichaje' };
    } finally {
      setLoading(false);
    }
  };
  
   const editarFichaje = async (id, fichajeData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateClockRecord(id, fichajeData);
      // Actualizar lista de fichajes
      await cargarMisFichajes();
      return { success: true, data: response };
    } catch (err) {
      console.error('Error al editar fichaje:', err);
      setError(err.response?.message || 'Error al editar fichaje');
      return { success: false, error: err.response?.message || 'Error al editar fichaje' };
    } finally {
      setLoading(false);
    }
  };
  
  
  const borrarFichaje = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteClockRecord(id); 
      await cargarMisFichajes();
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar fichaje:', err);
      setError(err.response?.message || 'Error al eliminar fichaje');
      return { success: false, error: err.response?.message || 'Error al eliminar fichaje' };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    fichajes,
    loading,
    error,
    cargarMisFichajes,
    registrarFichaje,
    editarFichaje,
    borrarFichaje
  };
};

export default useFichaje;