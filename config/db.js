// const mongoose = require('mongoose')
// require('dotenv').config({ path: 'variables.env' })

// const conectarDB = async () => {
//     try {
//         await mongoose.connect(process.env.DB_MONGO, {
//             // useNewUrlParser: true,
//             // useUnifiedTopology: true,
//             // useFindAndModify: false,
//             // useCreateIndex: true,
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })
//         console.log('DB conectada');
//     } catch (error) {
//         console.log('Hubo un error');
//         console.log(error);
//         process.exit(1);
//     }
// }

// module.exports = conectarDB

const mongoose = require('mongoose');

// Configura la URL de conexión a tu base de datos MongoDB
const mongoURI = 'mongodb+srv://mateosanchezvivas:mateosanchezvivas@cluster0.sekp3nf.mongodb.net/?retryWrites=true&w=majority'; // Cambia esta URL a tu configuración

// Configura las opciones de conexión
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Conecta a la base de datos utilizando las opciones configuradas
mongoose.connect(mongoURI, options)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch(err => console.error('Error de conexión a MongoDB', err));