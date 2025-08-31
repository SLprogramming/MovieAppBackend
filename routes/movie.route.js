import express from "express"
import { filterByGenres, getUserMediaList, getGenres, getMovieDetail, getMovieTrailers, getTrendingMovies,searchMoviesByName, getCast, getSimilar } from "../controllers/movie.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const movieRouter = express.Router()


//toggle with query.content
movieRouter.get('/content/get-all/:page',getTrendingMovies)

movieRouter.get('/content/search/:page',searchMoviesByName) // keyword

movieRouter.get('/content/genre-filter/:page',filterByGenres) // genre

movieRouter.get('/content/get-genres',getGenres)

movieRouter.get('/content/get-detail/:id',getMovieDetail)

movieRouter.get('/content/get-trailers/:id',getMovieTrailers)

movieRouter.get('/content/get-cast/:id',getCast)

movieRouter.get('/content/get-similar/:id',getSimilar)

movieRouter.get('/content/get/favorite/movie',isAuthenticated,getUserMediaList('favoritesMovies'))

movieRouter.get('/content/get/favorite/tv',isAuthenticated,getUserMediaList('favoritesTV'))

movieRouter.get('/content/get/bookmark/movie',isAuthenticated,getUserMediaList('bookmarksMovies'))

movieRouter.get('/content/get/bookmark/tv',isAuthenticated,getUserMediaList('bookmarksTV'))

movieRouter.get('/content/get/recent/tv',isAuthenticated,getUserMediaList('recentTV'))

movieRouter.get('/content/get/recent/movie',isAuthenticated,getUserMediaList('recentMovies'))

export default movieRouter;