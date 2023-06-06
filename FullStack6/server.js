const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());

app.post("/login", function (req, res) {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).send("Missing username or password");
    return;
  }

  console.log(`${name}, ${password}`);

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "avigayiltess",
    database: "project6",
  });

  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL server: " + err.stack);
      return;
    }
    console.log("Connected to MySQL server");

    const query = `SELECT * FROM passwords NATURAL JOIN users WHERE username = '${name}' LIMIT 1`;

    // Execute the query
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }

      if (results.length === 1 && results[0].password === password) {
        res.status(200).json(results[0]);
      } else {
        res.status(401).send("Wrong username or password");
        return;
      }

      connection.end((err) => {
        if (err) {
          console.error("Error closing connection: " + err.stack);
          return;
        }
        console.log("MySQL connection closed");
      });
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// const path = require("path");
// var fs = require("fs");

// app.use(express.static("public"));

// app.get("/pages", function (req, res) {
//   res.sendFile(path.join(__dirname, "public", "pages.html"));
// });

// app.get("/pages/:page", function (req, res) {
//   const page = req.params.page;
//   res.sendFile(path.join(__dirname, "public", "pages", `${page}.html`));
// });

// app.get("/contacts/:contactNumber", function (req, res) {
//   const contactNumber = parseInt(req.params.contactNumber);

//   if (isNaN(contactNumber)) {
//     res.status(400).json({ error: "Invalid contact number" });
//     return;
//   }

//   const contact = contacts[contactNumber - 1];

//   if (!contact) {
//     res.status(404).json({ error: "Contact not found" });
//     return;
//   }

//   res.json(contact);
// });
