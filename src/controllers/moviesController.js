const paginate = require('express-paginate')
const createError = require('http-errors')
const { getAllMovies, getMovieById,createMovie,updateMovie, deleteMovie } = require('../services/movies.services');


//cuadno devolvemos un json, estamos devolviendo informacion y no vista!!

const moviesController = {
    list: async(req, res) => {
       try{
            const {movies, total} = await getAllMovies(req.query.limit,req.skip) // promesa, status (200) significa que todo esta ok
            const pageCount = Math.ceil(total /req.query.limit)
            const currentPage = req.query.page
            const pages = paginate.getArrayPages(req)(pageCount,pageCount,currentPage) //primero va la cantidad de paginas que voy a mostrar y la segunda es el total de paginas, ambas coinciden con pagesCount
            return res.status(200).json({       //devolvermos una estructura json con las peliculas (data:movie) y el ok es para indicar que todo salio bien!!
                ok : true,
                meta:{
                    total,
                    pageCount,
                    currentPage,
                    pages
                },
                data : movies,
            })
       }catch(error){
        return res.status(error.status || 500).json({  // si no viene status en error, viene un error 500
            ok:false,
            status :  error.status || 500,
            error : error.message || "Ups, hubo un error :("
        })                                     
       
    }
        
    },
    detail: async(req, res) => {
        try{
            const movie = await getMovieById(req.params.id) // promesa, status (200) significa que todo esta ok
            return res.status(200).json({       //devolvermos una estructura json con las peliculas (data:movie) y el ok es para indicar que todo salio bien!!
                ok : true,
                
                data : movie
            })
       }catch(error){
        return res.status(error.status || 500).json({  // si no viene status en error, viene un error 500
            ok:false,
            status :  error.status || 500,
            error : error.message || "Ups, hubo un error :("
        })                                     
       
    }
    },
   
    create: async(req,res) => {
        try {
            const {title,release_date, awards,rating,length,genre_id,actors} = req.body
            if([title, release_date, awards, rating].includes('' || undefined)){
                throw createError(400,'Los campos title, relase_date, awards,rating.Son obligatoriso')
            }
                
            const newMovie = await createMovie({
                title,
                release_date,
                awards,
                rating,
                length,
                genre_id
            },actors)
            return res.status(200).json({       
                ok : true,
                
                msg : "pelicula creada con exito",
                //devuelve la pelicula recien agregada con datos extras
                url : `${req.protocol}://${req.get('host')}/api/v1/movies/${newMovie.id}`         // protocol --> protocolo http!
            })
                 
            
        }catch(error){
            return res.status(error.status || 500).json({  // si no viene status en error, viene un error 500
                ok:false,
                status :  error.status || 500,
                error : error.message || "Ups, hubo un error :("
            })                                     
           
        }
    },
  
    update : async (req,res) => {
        try {
            const movieUpdated =  await updateMovie(req.params.id,req.body)
            return res.status(200).json({       
                ok : true,
                msg : "pelicula actualizada con exito",
                //devuelve la pelicula recien agregada con datos extras
                url : `${req.protocol}://${req.get('host')}/api/v1/movies/${movieUpdated.id}`         // protocol --> protocolo http!
            })

        }catch (error){
            return res.status(error.status || 500).json({  // si no viene status en error, viene un error 500
                ok:false,
                status :  error.status || 500,
                error : error.message || "Ups, hubo un error :("
            })
        }
    },    
    
    destroy: async (req,res) => {
       try {
         await deleteMovie(req.params.id)
            return res.status(200).json({       
                ok : true,
                msg : "pelicula eliminada con exito",
                //devuelve la pelicula recien agregada con datos extras
            })

       }catch(error){
        return res.status(error.status || 500).json({  // si no viene status en error, viene un error 500
            ok:false,
            status :  error.status || 500,
            error : error.message || "Ups, hubo un error :("
        })
       }

},
}

module.exports = moviesController;