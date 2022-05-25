const Movie = require('../models/movie');

const ServerError = require('../errors/ServerError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// returns movies saved by the current user
const getMovies = (req, res, next) => {
  // find in db (обьект в обьекте!)
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(() => next(new ServerError('Ошибка на сервере')));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
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
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner,
    movieId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(new ServerError(err)));
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  // use the method from magnus (one document according to the condition)
  Movie.findOne({ _id: req.params.movieId })
    .orFail(() => {
      throw new NotFoundError('Такого фильма не существует');
    })
    .then((movie) => {
      if (String(movie.owner) !== owner) {
        throw new ForbiddenError('Удалять можно только свои фильмы');
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
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
