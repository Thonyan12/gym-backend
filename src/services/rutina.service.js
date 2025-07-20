const Rutina = require('../models/rutina.models');
const AsignacionRutina = require('../models/asignacionRutina.models');

const RutinaService = {
    // Servicios para Rutinas
    getAllRutinas: async () => {
        try {
            return await Rutina.getAll();
        } catch (error) {
            console.error('Error en RutinaService.getAllRutinas:', error);
            throw new Error('Error al obtener las rutinas');
        }
    },

    getRutinaById: async (id_rutina) => {
        try {
            if (!id_rutina) {
                throw new Error('ID de rutina es requerido');
            }
            return await Rutina.getById(id_rutina);
        } catch (error) {
            console.error('Error en RutinaService.getRutinaById:', error);
            throw new Error('Error al obtener la rutina');
        }
    },

    createRutina: async (rutinaData) => {
        try {
            const { nivel, tipo_rut, descripcion_rut, duracion_rut } = rutinaData;
            
            if (!nivel || !tipo_rut || !descripcion_rut || !duracion_rut) {
                throw new Error('Todos los campos son requeridos');
            }

            return await Rutina.create(rutinaData);
        } catch (error) {
            console.error('Error en RutinaService.createRutina:', error);
            throw new Error('Error al crear la rutina');
        }
    },

    updateRutina: async (id_rutina, rutinaData) => {
        try {
            if (!id_rutina) {
                throw new Error('ID de rutina es requerido');
            }

            const { nivel, tipo_rut, descripcion_rut, duracion_rut } = rutinaData;
            
            if (!nivel || !tipo_rut || !descripcion_rut || !duracion_rut) {
                throw new Error('Todos los campos son requeridos');
            }

            return await Rutina.update(id_rutina, rutinaData);
        } catch (error) {
            console.error('Error en RutinaService.updateRutina:', error);
            throw new Error('Error al actualizar la rutina');
        }
    },

    deleteRutina: async (id_rutina) => {
        try {
            if (!id_rutina) {
                throw new Error('ID de rutina es requerido');
            }
            return await Rutina.delete(id_rutina);
        } catch (error) {
            console.error('Error en RutinaService.deleteRutina:', error);
            throw new Error('Error al eliminar la rutina');
        }
    },

    // Servicios para Asignaciones de Rutinas
    getRutinasByMiembro: async (id_miembro) => {
        try {
            if (!id_miembro) {
                throw new Error('ID de miembro es requerido');
            }
            return await AsignacionRutina.getByMiembro(id_miembro);
        } catch (error) {
            console.error('Error en RutinaService.getRutinasByMiembro:', error);
            throw new Error('Error al obtener las rutinas del miembro');
        }
    },

    getAllAsignaciones: async () => {
        try {
            return await AsignacionRutina.getAll();
        } catch (error) {
            console.error('Error en RutinaService.getAllAsignaciones:', error);
            throw new Error('Error al obtener las asignaciones');
        }
    },

    asignarRutina: async (asignacionData) => {
        try {
            const { id_miembro, id_rutina, descripcion_rut, fecha_inicio } = asignacionData;
            
            if (!id_miembro || !id_rutina || !descripcion_rut || !fecha_inicio) {
                throw new Error('Todos los campos son requeridos');
            }

            // Verificar si ya existe una asignación activa
            const existingAssignment = await AsignacionRutina.checkExistingAssignment(id_miembro, id_rutina);
            if (existingAssignment) {
                throw new Error('Ya existe una asignación activa de esta rutina para este miembro');
            }

            // Verificar si la rutina existe
            const rutina = await Rutina.getById(id_rutina);
            if (!rutina) {
                throw new Error('La rutina especificada no existe');
            }

            return await AsignacionRutina.create(asignacionData);
        } catch (error) {
            console.error('Error en RutinaService.asignarRutina:', error);
            throw new Error(error.message || 'Error al asignar la rutina');
        }
    },

    getAsignacionById: async (id_asignacion) => {
        try {
            if (!id_asignacion) {
                throw new Error('ID de asignación es requerido');
            }
            return await AsignacionRutina.getById(id_asignacion);
        } catch (error) {
            console.error('Error en RutinaService.getAsignacionById:', error);
            throw new Error('Error al obtener la asignación');
        }
    },

    updateAsignacion: async (id_asignacion, asignacionData) => {
        try {
            if (!id_asignacion) {
                throw new Error('ID de asignación es requerido');
            }

            const { id_rutina, descripcion_rut, fecha_inicio } = asignacionData;
            
            if (!id_rutina || !descripcion_rut || !fecha_inicio) {
                throw new Error('Todos los campos son requeridos');
            }

            // Verificar si la rutina existe
            const rutina = await Rutina.getById(id_rutina);
            if (!rutina) {
                throw new Error('La rutina especificada no existe');
            }

            return await AsignacionRutina.update(id_asignacion, asignacionData);
        } catch (error) {
            console.error('Error en RutinaService.updateAsignacion:', error);
            throw new Error(error.message || 'Error al actualizar la asignación');
        }
    },

    deleteAsignacion: async (id_asignacion) => {
        try {
            if (!id_asignacion) {
                throw new Error('ID de asignación es requerido');
            }
            return await AsignacionRutina.delete(id_asignacion);
        } catch (error) {
            console.error('Error en RutinaService.deleteAsignacion:', error);
            throw new Error('Error al eliminar la asignación');
        }
    }
};

module.exports = RutinaService;
