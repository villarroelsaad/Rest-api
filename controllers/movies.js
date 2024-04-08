import { MovieModel } from '../models/Json/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getID (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getId({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Error 404 Not Found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    // Para guardar en la base de datos
    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: result.error.message })
    }

    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, input: result.data })

    return res.json(updatedMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MovieModel.delete({ id })
    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    return res.json({ message: 'movie deleted' })
  }
}
