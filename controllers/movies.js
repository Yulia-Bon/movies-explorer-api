const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const NotAllowedError = require('../errors/NotAllowedError');
const {
  movieDataErrorMessage,
  movieOwnerErrorMessage,
  movieIdErrorMessage,
} = require('../utils/constants');

// returns movies saved by the current user
const getMovies = (req, res, next) => {
  // find in db (обьект в обьекте!)
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner = req.user._id,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner,
    movieId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotFoundError(movieDataErrorMessage));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  // use the method from magnus (one document according to the condition)
  Movie.findOne({ _id: req.params.movieId })
    .orFail(() => {
      throw new NotFoundError(movieIdErrorMessage);
    })
    .then((movie) => {
      if (String(movie.owner) !== owner) {
        throw new NotAllowedError(movieOwnerErrorMessage);
      }
      // use the method from magnus (find a matching document, remove it)
      return Movie.findByIdAndRemove(movie._id).select('-owner');
    })
    .then((movie) => {
      res.status(200).send({
        message: 'фильм удалён',
        deleteMovie: movie,
      });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
