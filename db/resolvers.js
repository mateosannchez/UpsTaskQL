const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Proyecto = require("../models/Proyecto");
const Tarea = require("../models/Tarea");

require('dotenv').config({path: 'variables.env'})

const crearToken = (usuario, secreta, expiresIn) => {
    const { id, email, nombre } = usuario
    return jwt.sign({id, email, nombre}, secreta ,{expiresIn} )  //crea el token con los datos del
}

const resolvers = {
    Query: {
        obtenerCursos: () => cursos,

        obtenerTecnologia: () => cursos,

        obtenerProyectos: async (_, {}, ctx) => {
            const proyectos = await Proyecto.find({ creador: ctx.usuario.id })

            return proyectos
        },
        obtenerTareas: async (_, {}, ctx) => {
            const tareas = await Tareas.find({ creador: ctx.usuario.id }).where('proyecto').equals(input.proyecto)
            return tareas
        },
    },
    Mutation: {
        crearUsuario: async (_, {input}) => {
            const { email, password } = input
            const existeUsuario = await Usuario.findOne({email})

            if (existeUsuario) {
                throw new Error('El usuario ya está registrado')
            }

            try {

                const salt = await bcrypt.genSalt(10);
                input.password = await bcrypt.hash(password, salt);
                console.log(input);

                const nuevoUsuario = new Usuario(input)

                nuevoUsuario.save();
                return 'Usuario creado correctamente'
            } catch (error) {
                console.log(error);
            }
        },
        autenticarUsuario: async (_, {input}) => {
            const {email, password} = input;

            const existeUsuario = await Usuario.findOne({email})

            if (!existeUsuario) {
                throw new Error('El usuario no existe')
            }

            const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password)

            if (!passwordCorrecto) {
                throw new Error('Password Incorrecto')
            }

            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '4hr')
            }
        },
        nuevoProyecto: async (_, {input}, ctx) => {
            
           try {
            const proyecto = new Proyecto(input)

            proyecto.creador = ctx.usuario.id

            const resultado = await proyecto.save();

            return resultado
           } catch (error) {
            console.log(error);
           }
        },
        actualizarProyecto: async (_, {id, input}, ctx) => {

            let proyecto = await Proyecto.findById(id);

            if (!proyecto) {
                throw new Error('Proyecto no encontrado')
            }

            if (proyecto.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }

            proyecto = await Proyecto.findOneAndUpdate({_id: id}, input, {new: true});
            return proyecto;
        },
        eliminarProyecto: async (_, {id}, ctx) => {
            let proyecto = await Proyecto.findById(id);

            if (!proyecto) {
                throw new Error('Proyecto no encontrado')
            }

            if (proyecto.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }

            await Proyecto.findOneAndDelete({ _id : id });

            return 'Proyecto eliminado'
        },
        nuevaTarea: async (_, {input}, ctx) => {
            try {
                const tarea = new Tarea(input);
                tarea.creador = ctx.usuario.id;
                const resultado = await tarea.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarTarea: async (_, {id, input, estado}, ctx) => {
            let tarea = await Tarea.findById( id )

            if (!tarea) {
                throw new Error('Tarea no encontrada')
            }

            if (tarea.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }

            input.estado = estado;

            tarea = await Tarea.findOneAndUpdate({ _id : id }, input, { new: true })

            return tarea;
        },
        eliminarTarea: async (_, {id}, ctx) => {
            let tarea = await Tarea.findById( id )

            if (!tarea) {
                throw new Error('Tarea no encontrada')
            }

            if (tarea.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }

            await Tarea.findOneAndDelete({_id: id})

            return 'Tarea eliminada';
        },
    }
}

module.exports = resolvers;