
import CatchAsyncError from "../middleware/catchAsyncError.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getTrendingMovies = CatchAsyncError(async (req, res) => {
  try {
    let response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/trending/${req.query.content || 'movie'}/day?language=en-US&page=${req.params.page}`
    );
    return res.status(200).json({
      success: true,
      count: response.results.length,
      data: response.results,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const searchMoviesByName = CatchAsyncError(async (req, res, next) => {
  try {
    console.log(req.params.page, req.query.keyword);
    let response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/multi?query=${req.query.keyword}&include_adult=false&language=en-US&page=${req.params.page}`
    );
    console.log("hello");
    console.log(response);
    return res.status(200).json({
      success: true,
      count: response.results.length,
      data: response.results,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const filterByGenres = CatchAsyncError(async (req, res, next) => {
  try {
    let response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/discover/${req.query.content || 'movie'}?include_adult=false&include_video=false&language=en-US&page=${req.params.page}&sort_by=popularity.desc&with_genres=${req.query.genre}`
    );
    return res.status(200).json({
      success: true,
      count: response.results.length,
      data: response.results,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getGenres = CatchAsyncError(async (req, res, next) => {
  try {
    let response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/genre/${req.query.content || 'movie'}/list?language=en`
    );
    return res.status(200).json({ success: true, data: response.genres });
  } catch (error) {
    return next(new ErrorHandler(error, message, 400));
  }
});

export const getSimilar = CatchAsyncError(async (req, res, next) => {
    try {
      
        let response = await fetchFromTMDB(`https://api.themoviedb.org/3/${req.query.content}/${req.params.id}/similar?language=en-US&page=1`)
        return res.status(200).json({success:true,data:response.results})
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getCast = CatchAsyncError(async (req, res, next) => {
    try {
        let response = await fetchFromTMDB(`https://api.themoviedb.org/3/${req.query.content}/${req.params.id}/aggregate_credits?language=en-US`)
        return res.status(200).json({success:true,data:response.cast})
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const getMovieDetail = CatchAsyncError(async (req, res, next) => {
  try {
    let response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/${req.query.content || 'movie'}/${req.params.id}?language=en-US`
    );
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getMovieTrailers = CatchAsyncError(async (req, res, next) => {
  try {
    let response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/${req.query.content || 'movie'}/${req.params.id}/videos?language=en-US`
    );
    return res.status(200).json({ success: true, data: response.results });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getUserMediaList = async (mediaIds, contentType) => {
  try {
    if (!mediaIds || mediaIds.length === 0) return [];

    const requests = mediaIds.map((id) =>
      fetchFromTMDB(`https://api.themoviedb.org/3/${contentType}/${id}?language=en-US`)
        .catch(() => null) // skip failed requests
    );

    const results = await Promise.all(requests);

    // Filter out null values
    const validResults = results.filter((item) => item !== null);

    if (contentType === 'movie') console.log(validResults);

    return validResults;
  } catch (error) {
    return [];
  }
};


