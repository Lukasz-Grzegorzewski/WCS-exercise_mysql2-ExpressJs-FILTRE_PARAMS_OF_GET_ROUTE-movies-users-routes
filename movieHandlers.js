const { query } = require("./database");
const database = require("./database");

const getMovies = (req, res) => {
  database
    .query("SELECT * FROM movies")
    .then(([movies]) => {
      res.json(movies)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM movies WHERE id = ?", [id])
    .then(([movies]) => {
      movies[0] != null ?
        res.json(movies[0]) :
        res.status(404).send("Not found");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    })
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  
  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?) ",
    [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error posting the movie");
    });
}

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;
  

  database
    .query("update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?"
      , [title, director, year, color, duration, id])
    .then(([result]) => {
      result.affectedRows === 0 ?
        res.status(404).send("Not Found") :
        res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    })
  
}

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM movies WHERE id = ?"
      , [id])
    .then(([result]) => {
      result.affectedRows === 0 ?
        res.status(404).send("Not Found") :
        res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the movie");
    })
  
}

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
  deleteMovie,
};
