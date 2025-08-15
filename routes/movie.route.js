import express from "express"
import { filterByGenres, getUserMediaList, getGenres, getMovieDetail, getMovieTrailers, getTrendingMovies,searchMoviesByName } from "../controllers/movie.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const movieRouter = express.Router()


//toggle with query.content
movieRouter.get('/content/get-all/:page',getTrendingMovies)

movieRouter.get('/content/search/:page',searchMoviesByName) // keyword

movieRouter.get('/content/genre-filter/:page',filterByGenres) // genre

movieRouter.get('/content/get-genres',getGenres)

movieRouter.get('/content/get-detail/:id',getMovieDetail)

movieRouter.get('/content/get-trailers/:id',getMovieTrailers)

movieRouter.get('/content/get/favourite/movie',getUserMediaList('favoritesMovies'))

movieRouter.get('/content/get/favourite/tv',getUserMediaList('favoritesTV'))

movieRouter.get('/content/get/bookmarks/movie',getUserMediaList('bookmarksMovies'))

movieRouter.get('/content/get/bookmarks/tv',getUserMediaList('bookmarksTV'))

export default movieRouter;