const express = require('express');
const app = express();
const paginate = require('express-paginate')


//Ejecuto el llamado a mis rutas

//Aquí pueden colocar las rutas de las APIs
const movieApiRoutes =  require('./routes/api.v1/movies.routes')
app.use(express.json())



// view engine setup

//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
app.use(express.urlencoded({ extended: false }));

//Aquí estoy disponiendo la posibilidad para utilizar el seteo en los formularios para el usod e los metodos put ó delete

// paginate trae el concepto de limit de sql, en este caso el limit el el 8
app.use(paginate.middleware(8,50)) // 8 son los elementos minimos que me manda y 50 son los maximos

app.use('/api/v1/movies', movieApiRoutes);
app.use('*',(req,res) => res.status(404).json({
    ok:false,
    status:404,

    error : 'Not Found'
}))

//Activando el servidor desde express
app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));
