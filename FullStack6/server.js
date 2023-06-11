const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());

const sqlPassword = "avigayiltess";

app.post("/login", function (req, res) {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).send("Missing username or password");
    return;
  }

  const query = `SELECT * FROM passwords NATURAL JOIN users WHERE username = '${name}' LIMIT 1`;

  sqlConnect(query)
    .then((results) => {
      if (results.length === 1 && results[0].password === password) {
        res.status(200).json(results[0]);
      } else {
        res.status(401).send("Wrong username or password");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.post("/register", function (req, res) {
  const { name, password } = req.body;
  let user;

  if (!name || !password) {
    res.status(400).send("Missing username or password");
    return;
  }

  const userQuery = `SELECT * FROM users WHERE username = ?`;
  const userValues = [name];

  sqlConnect(userQuery, userValues)
    .then((userResults) => {
      if (userResults.length === 0) {
        res.status(400).send("User is not authorized");
        return;
      } else {
        user = userResults[0];
      }

      const insertQuery = `INSERT IGNORE INTO passwords (username, password) VALUES (?, ?)`;
      const insertValues = [name, password];
      return sqlConnect(insertQuery, insertValues);
    })
    .then((results) => {
      if (results.affectedRows === 1) {
        res.status(200).json(user);
      } else {
        res.status(409).send("Username or password already exists");
      }
    })
    .catch((err) => {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("An error occurred");
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

function sqlConnect(query, values = []) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: sqlPassword,
      database: "project6",
    });

    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL server: " + err.stack);
        reject(err);
        return;
      }
      console.log("Connected to MySQL server");

      connection.query(query, values, (err, results) => {
        if (err) {
          console.error("Error executing query: " + err.code);
          reject(err);
          // return;
        }

        connection.end((err) => {
          if (err) {
            console.error("Error closing connection: " + err.stack);
            // reject(err);
            return;
          }
          console.log("MySQL connection closed");
        });

        resolve(results);
      });
    });
  });
}
