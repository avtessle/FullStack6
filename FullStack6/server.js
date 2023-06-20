const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());

const sqlPassword = "bat7Yoffe";

//login & register
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

      const insertQuery = `INSERT IGNORE INTO passwords (id,username, password) VALUES (?,?,?)`;
      const insertValues = [user.id, name, password];
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

//todos
app.get("/todos/:id/:completed", (req, res) => {
  const todoId = req.params.id;
  const completed=req.params.completed;
  if (!todoId||!completed) {
    res.status(400).send("Missing todo id");
    return;
  }
  console.log(completed);
  const query = `SELECT * FROM todos WHERE userId = '${todoId}' AND completed = '${completed}' ORDER BY id`;

  sqlConnect(query)
    .then((results) => {
      if (results.length > 0) {
        res.status(200).json(results);
        return;
      } else {
        res.status(401).send("Wrong username or password");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.get("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  if (!todoId) {
    res.status(400).send("Missing todo id");
    return;
  }
  console.log(todoId);
  const query = `SELECT * FROM todos WHERE userId = '${todoId}' ORDER BY id`;

  sqlConnect(query)
    .then((results) => {
      if (results.length > 0) {
        res.status(200).json(results);
        return;
      } else {
        res.status(401).send("Wrong username or password");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.put("/todos/update-title/:id", (req, res) => {
  const todoId = req.params.id;
  const userUpdate = req.body;
  if (!todoId || !userUpdate) {
    res.status(400).send("Missing todo id");
    return;
  }
  const query = `UPDATE todos SET title = '${userUpdate.title}' WHERE id = ${todoId};`;
  sqlConnect(query)
    .then((results) => {
      console.log("Update successful");
      res.status(200).json(userUpdate);
    })
    .catch((error) => {
      console.error("Error updating todos:", error);
      res.status(500).send("An error occurred");
    });
});

app.put("/todos/update-completed/:id", (req, res) => {
  const todoId = req.params.id;
  const userUpdate = req.body;
  if (!todoId) {
    res.status(400).send("Missing todo id/completed");
    return;
  }
  const query = `UPDATE todos SET completed = ${userUpdate.completed} WHERE id = ${todoId};`;
  sqlConnect(query)
    .then((results) => {
      console.log("Update successful");
      res.status(200).json(userUpdate);
    })
    .catch((error) => {
      console.error("Error updating todos:", error);
      res.status(500).send("An error occurred");
    });
});

app.delete("/todos/delete/:id", (req, res) => {
  const todoId = req.params.id;
  const query = `DELETE FROM todos WHERE id = ${todoId}`;
  sqlConnect(query)
    .then((results) => {
      res.status(200).json({ message: "todo deleted successfully" });
    })
    .catch((error) => {
      console.error("Error delete todos:", error);
      res.status(500).send("An error occurred");
    });
});

app.post("/todos", function (req, res) {
  const todo = req.body;
  if (!todo) {
    res.status(400).send("Missing todo body");
    return;
  }
  const query = `INSERT INTO todos (userId, title, completed) VALUES (?, ?, ?)`;
  const values = [todo.userId, todo.title, todo.completed];
  sqlConnect(query, values)
    .then((results) => {
      todo.id = results.insertId;
      res.status(200).json(todo);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

//posts
app.get("/posts", function (req, res) {
  const userId = req.query.userId;

  const query = `SELECT * FROM posts WHERE userId = ${userId}`;

  sqlConnect(query)
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.post("/posts", function (req, res) {
  const post = req.body;

  const query = `INSERT INTO posts (userId, title, body) VALUES (?, ?, ?)`;
  const values = [post.userId, post.title, post.body];

  sqlConnect(query, values)
    .then((results) => {
      post.id = results.insertId;
      res.status(200).json(post);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.put("/posts/:id", function (req, res) {
  const postId = req.params.id;
  const updatedPost = req.body;

  const query = `UPDATE posts SET userId = ?, title = ?, body = ? WHERE id = ?`;
  const values = [
    updatedPost.userId,
    updatedPost.title,
    updatedPost.body,
    postId,
  ];

  sqlConnect(query, values)
    .then(() => {
      res.status(200).json(updatedPost);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.delete("/posts/:id", function (req, res) {
  const postId = req.params.id;

  let query = `DELETE FROM comments WHERE postId = ${postId}`;
  sqlConnect(query)
    .then(() => {
      query = `DELETE FROM posts WHERE id = ${postId}`;
      sqlConnect(query).then(() => {
        res.status(200).json({ message: "Post deleted successfully" });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
    
});

//comments
app.get("/comments", function (req, res) {
  const postId = req.query.postId;

  const query = `SELECT * FROM comments WHERE postId = ${postId}`;

  sqlConnect(query)
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.post("/comments", function (req, res) {
  const comment = req.body;

  const query = `INSERT INTO comments (postId, name, email, body) VALUES (?, ?, ?, ?)`;
  const values = [comment.postId, comment.name, comment.email, comment.body];

  sqlConnect(query, values)
    .then((results) => {
      comment.id = results.insertId;
      res.status(200).json(comment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.put("/comments/:id", function (req, res) {
  const commentId = req.params.id;
  const updatedComment = req.body;

  const query = `UPDATE comments SET name = ?, email = ?, body = ? WHERE postId=? AND id = ?`;
  const values = [
    updatedComment.name,
    updatedComment.email,
    updatedComment.body,
    updatedComment.postId,
    commentId,
  ];

  sqlConnect(query, values)
    .then(() => {
      res.status(200).json(updatedComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.delete("/comments/:id", function (req, res) {
  const commentId = req.params.id;

  let query = `DELETE FROM comments WHERE id = ${commentId}`;
  sqlConnect(query)
    .then(() => {
      res.status(200).json({ message: "Comment deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
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
