const PerfilFisicoModel = require('../models/perfilFisico.models');
const MiembroModel = require('../models/miembro.models');

// Servicio para obtener perfil completo del miembro
exports.getCompleteProfile = async (id_miembro) => {
    try {
        // 1. Obtener información básica del miembro
        const miembro = await MiembroModel.find(id_miembro);
        if (!miembro) {
            return { success: false, message: 'Miembro no encontrado' };
        }

        // 2. Obtener perfil físico actual
        const perfilActual = await PerfilFisicoModel.findCurrentByMemberId(id_miembro);
        
        // 3. Obtener historial de perfiles físicos
        const historialPerfiles = await PerfilFisicoModel.findHistoryByMemberId(id_miembro);
        
        // 4. Obtener historial de rutinas
        const historialRutinas = await PerfilFisicoModel.findRoutineHistory(id_miembro);
        
        // 5. Calcular IMC y categoría actuales
        let imcActual = null;
        let categoriaIMC = null;
        
        if (perfilActual) {
            imcActual = perfilActual.imc_calculado;
            categoriaIMC = perfilActual.categoria_imc;
        } else if (miembro.altura && miembro.peso) {
            // Si no hay perfil físico, usar datos del registro inicial
            imcActual = parseFloat((miembro.peso / Math.pow(miembro.altura / 100, 2)).toFixed(2));
            categoriaIMC = this.getCategoriaIMC(imcActual);
        }

        // 6. Obtener estadísticas del perfil
        const statsProfile = await PerfilFisicoModel.getProfileStats(id_miembro);

        return {
            success: true,
            data: {
                miembro: {
                    id_miembro: miembro.id_miembro,
                    cedula: miembro.cedula,
                    nombre_completo: `${miembro.nombre} ${miembro.apellido1} ${miembro.apellido2 || ''}`.trim(),
                    nombre: miembro.nombre,
                    apellido1: miembro.apellido1,
                    apellido2: miembro.apellido2,
                    edad: miembro.edad,
                    direccion: miembro.direccion,
                    altura_inicial: miembro.altura,
                    peso_inicial: miembro.peso,
                    contextura: miembro.contextura,
                    objetivo: miembro.objetivo,
                    sexo: miembro.sexo,
                    fecha_inscripcion: miembro.fecha_inscripcion,
                    estado: miembro.estado,
                    correo: miembro.correo
                },
                perfil_fisico_actual: perfilActual || {
                    mensaje: 'No hay perfil físico registrado',
                    altura: miembro.altura,
                    peso: miembro.peso,
                    fecha_registro: miembro.fecha_inscripcion
                },
                historial_perfiles: historialPerfiles || [],
                historial_rutinas: historialRutinas || [],
                imc_actual: imcActual,
                categoria_imc: categoriaIMC,
                estadisticas: {
                    total_perfiles: statsProfile.total_registros || 0,
                    peso_minimo: statsProfile.peso_minimo,
                    peso_maximo: statsProfile.peso_maximo,
                    peso_promedio: statsProfile.peso_promedio,
                    primer_registro: statsProfile.primer_registro,
                    ultimo_registro: statsProfile.ultimo_registro
                },
                tiempo_en_gimnasio: this.calculateTimeInGym(miembro.fecha_inscripcion)
            }
        };
    } catch (error) {
        console.error('Error en getCompleteProfile:', error);
        return { 
            success: false, 
            message: 'Error al obtener perfil completo',
            error: error.message 
        };
    }
};

// Servicio para crear nuevo perfil físico
exports.createProfile = async (id_miembro, profileData) => {
    try {
        // 1. Verificar que el miembro existe
        const miembro = await MiembroModel.find(id_miembro);
        if (!miembro) {
            return { success: false, message: 'Miembro no encontrado' };
        }

        // 2. Validar datos del perfil
        const { altura, peso, observaciones } = profileData;
        
        if (!altura || !peso) {
            return { 
                success: false, 
                message: 'Altura y peso son obligatorios' 
            };
        }

        if (altura < 120 || altura > 250) {
            return { 
                success: false, 
                message: 'La altura debe estar entre 120 y 250 cm' 
            };
        }

        if (peso < 30 || peso > 300) {
            return { 
                success: false, 
                message: 'El peso debe estar entre 30 y 300 kg' 
            };
        }

        // 3. Crear el perfil físico (trigger automático se dispara)
        const nuevoPerfil = await PerfilFisicoModel.create({
            id_miembro,
            altura,
            peso,
            observaciones: observaciones || 'Perfil físico actualizado'
        });

        // 4. Calcular IMC y categoría
        const imc = parseFloat((peso / Math.pow(altura / 100, 2)).toFixed(2));
        const categoria = this.getCategoriaIMC(imc);

        // 5. Obtener perfil completo actualizado
        const perfilCompleto = await this.getCompleteProfile(id_miembro);

        return {
            success: true,
            message: 'Perfil físico creado exitosamente. Sistema evaluando nuevas rutinas automáticamente.',
            data: {
                nuevo_perfil: {
                    ...nuevoPerfil,
                    imc_calculado: imc,
                    categoria_imc: categoria
                },
                perfil_completo: perfilCompleto.data
            }
        };
    } catch (error) {
        console.error('Error en createProfile:', error);
        return { 
            success: false, 
            message: 'Error al crear perfil físico',
            error: error.message 
        };
    }
};

// Servicio para obtener solo historial de perfiles
exports.getProfileHistory = async (id_miembro) => {
    try {
        // Verificar que el miembro existe
        const miembro = await MiembroModel.find(id_miembro);
        if (!miembro) {
            return { success: false, message: 'Miembro no encontrado' };
        }

        const historial = await PerfilFisicoModel.findHistoryByMemberId(id_miembro);
        
        return {
            success: true,
            data: {
                miembro_info: {
                    id_miembro: miembro.id_miembro,
                    nombre_completo: `${miembro.nombre} ${miembro.apellido1} ${miembro.apellido2 || ''}`.trim()
                },
                historial_perfiles: historial,
                total_registros: historial.length
            }
        };
    } catch (error) {
        console.error('Error en getProfileHistory:', error);
        return { 
            success: false, 
            message: 'Error al obtener historial de perfiles',
            error: error.message 
        };
    }
};

// Servicio para obtener solo historial de rutinas
exports.getRoutineHistory = async (id_miembro) => {
    try {
        // Verificar que el miembro existe
        const miembro = await MiembroModel.find(id_miembro);
        if (!miembro) {
            return { success: false, message: 'Miembro no encontrado' };
        }

        const historialRutinas = await PerfilFisicoModel.findRoutineHistory(id_miembro);
        
        return {
            success: true,
            data: {
                miembro_info: {
                    id_miembro: miembro.id_miembro,
                    nombre_completo: `${miembro.nombre} ${miembro.apellido1} ${miembro.apellido2 || ''}`.trim()
                },
                historial_rutinas: historialRutinas,
                total_rutinas: historialRutinas.length,
                rutinas_activas: historialRutinas.filter(r => r.estado_rutina).length
            }
        };
    } catch (error) {
        console.error('Error en getRoutineHistory:', error);
        return { 
            success: false, 
            message: 'Error al obtener historial de rutinas',
            error: error.message 
        };
    }
};

// Servicio para obtener evolución del IMC
exports.getIMCEvolution = async (id_miembro) => {
    try {
        const miembro = await MiembroModel.find(id_miembro);
        if (!miembro) {
            return { success: false, message: 'Miembro no encontrado' };
        }

        const evolucionIMC = await PerfilFisicoModel.getIMCEvolution(id_miembro);
        
        return {
            success: true,
            data: {
                miembro_info: {
                    id_miembro: miembro.id_miembro,
                    nombre_completo: `${miembro.nombre} ${miembro.apellido1} ${miembro.apellido2 || ''}`.trim()
                },
                evolucion_imc: evolucionIMC,
                resumen: {
                    registros_totales: evolucionIMC.length,
                    imc_actual: evolucionIMC.length > 0 ? evolucionIMC[evolucionIMC.length - 1].imc : null,
                    categoria_actual: evolucionIMC.length > 0 ? evolucionIMC[evolucionIMC.length - 1].categoria : null,
                    progreso: this.calculateIMCProgress(evolucionIMC)
                }
            }
        };
    } catch (error) {
        console.error('Error en getIMCEvolution:', error);
        return { 
            success: false, 
            message: 'Error al obtener evolución del IMC',
            error: error.message 
        };
    }
};

// Función auxiliar para determinar categoría de IMC
exports.getCategoriaIMC = (imc) => {
    if (imc < 18.5) return 'Bajo peso';
    if (imc >= 18.5 && imc <= 24.9) return 'Peso normal';
    if (imc >= 25 && imc <= 29.9) return 'Sobrepeso';
    return 'Obesidad';
};

// Función auxiliar para calcular tiempo en gimnasio
exports.calculateTimeInGym = (fechaInscripcion) => {
    const hoy = new Date();
    const inscripcion = new Date(fechaInscripcion);
    const diferenciaTiempo = hoy - inscripcion;
    const dias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const años = Math.floor(meses / 12);
    
    if (años > 0) {
        return `${años} año(s) y ${meses % 12} mes(es)`;
    } else if (meses > 0) {
        return `${meses} mes(es)`;
    } else {
        return `${dias} día(s)`;
    }
};

// Función auxiliar para calcular progreso del IMC
exports.calculateIMCProgress = (evolucionIMC) => {
    if (evolucionIMC.length < 2) {
        return 'Insuficientes datos para calcular progreso';
    }
    
    const primerIMC = evolucionIMC[0].imc;
    const ultimoIMC = evolucionIMC[evolucionIMC.length - 1].imc;
    const diferencia = ultimoIMC - primerIMC;
    
    if (Math.abs(diferencia) < 0.5) {
        return 'IMC estable';
    } else if (diferencia > 0) {
        return `IMC incrementó ${diferencia.toFixed(2)} puntos`;
    } else {
        return `IMC disminuyó ${Math.abs(diferencia).toFixed(2)} puntos`;
    }
};
