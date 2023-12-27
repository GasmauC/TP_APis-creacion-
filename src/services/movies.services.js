

const db = require('../database/models');  // nos comunicamos con la base de datos!!
//un servivio seria traeme todas las peliculas!!!
const createError = require('http-errors')
const getAllMovies = async (limit,offset) => { //al limit y al offset lo tomo del req.querry.limit del que me viene por el controlador
    
    try { 
        // try purueba la logica y si falla lo agarra chatch!! por eso siepre es try-catch
        const movies =  await db.Movie.findAll({
            limit,
            offset,
            attributes:{
                exclude:['created_at','updated_at','genre_id']
            },
            include: [{
                association:'genre',
                attributes:['id','name']
            },
            {
                association:'actors',
                attributes:['id','first_name','last_name']
            }
        ]
        })
        const total = await db.Movie.count()

        return {
            movies,
            total
        }
    }catch(error){
        console.log(error);
        throw{  //arrojame el error
            status : 500, // los errores 500 son del tipo de servidor!
            message : error.message // aca guardo el error!!
        }
    }
}
const getMovieById = async(id) => {
    try { 
        if(!id){
            throw createError(400,'ID inexistente')
        }
        // try purueba la logica y si falla lo agarra chatch!! por eso siepre es try-catch
        const movie =  await db.Movie.findByPk(id,{
            attributes:{
                exclude:['created_at','updated_at','genre_id']
            },
            include: [{
                association:'genre',
                attributes:['id','name']
            },
            {
                association:'actors',
                attributes:['id','first_name','last_name'],
                through : {
                    attributes : []
                }
            }
        ]
        })
        
        if(!movie) throw createError(404,'no existe una pelicula con ese ID')
        return movie

    }catch(error){
        console.log(error);
        throw{  //arrojame el error
            status : error.status || 500, // los errores 500 son del tipo de servidor!
            message : error.message || 'Ups hubo un error!!'// aca guardo el error!!
        }
    }
}
const createMovie = async (dataMovie,actors) =>{     // en dataMovie viene el body de movie controller
    try{

        const newMovie = await db.Movie.create(dataMovie);
        if(actors.length){
          const actorsDB = actors.map(actor =>{
            return {
                movie_id : newMovie.id,
                actor_id : actor
            }
          })
          await db.Actor_movie.bulkCreate(actorsDB,{
            validate : true
          })

        }else{
            return res.redirect("/movies")
        }
        return newMovie 
    }catch(error){
        console.log(error);
        throw{  //arrojame el error
            status : error.status || 500, // los errores 500 son del tipo de servidor!
            message : error.message || 'Ups hubo un error!!'// aca guardo el error!!
        }
    }
    
}
const updateMovie = async(id,dataMovie) => {
    try{
        const {title, awards,rating,length,release_date,genre_id,actors} = dataMovie
        const movie = await db.Movie.findByPk(id)
        
        movie.title = title || movie.title;
        movie.awards = awards || movie.awards;
        movie.awards = rating || movie.rating;
        movie.awards = length || movie.length;
        movie.awards = release_date || movie.release_date;
        movie.awards = genre_id || movie.genre_id;
        movie.awards = actors || movie.actors;

        await movie.save() // se modifican los datos y despues los salvo con save()

        if(actors){
            await db.Actor_Movie.destroy({
                where : {
                    movie_id : id
                }
            })
            const actorsArray = actors.map(actor => {
                return {
                movie_id : id,
                actor_id : actor,

                }
            })
            await db.Actor_Movie.bulkCreate(actorsArray,{
                validate : true
            })
        }
       
        console.log(actorsFromMovie);

         return movie

    }catch(error){
        throw{  //arrojame el error
            status : error.status || 500, // los errores 500 son del tipo de servidor!
            message : error.message || 'Ups hubo un error!!'// aca guardo el error!!
        }
    }
}
const deleteMovie = async (id) => {
    try {
        await db.Actor_Movie.destroy({
            where: {
                movie_id : id
            }
        })

        const movie = await db.Movie.findByPk(id)
        await movie.destroy()
           
        
        return null
    }catch(error){
        throw{  //arrojame el error
            status : error.status || 500, // los errores 500 son del tipo de servidor!
            message : error.message || 'Ups hubo un error!!'// aca guardo el error!!
        }
    }
}
module.exports ={
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
}
