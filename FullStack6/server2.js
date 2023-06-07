const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());

app.post("/signin", function (req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
        res.status(400).send("Missing username or password");
        return;
    }

    console.log(`${name}, ${password}`);

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "bat7",
        database: "project6",
    });
    // ביצוע שאילתת SELECT לבדיקת קיום המשתמש
    connection.query('SELECT * FROM project6.passwords WHERE username = ?', ['new_user'], (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      if (results.length > 0) {
        // המשתמש כבר קיים בטבלה
        console.log('User already exists.');
      } else {
        // המשתמש אינו קיים בטבלה - ביצוע הוספה
        connection.query('INSERT INTO project6.passwords (username, password) VALUES (?, ?)', ['new_user', 'new_password'], (error, results, fields) => {
          if (error) {
            console.error(error);
          } else {
            // הוספה בוצעה בהצלחה
            console.log('User added successfully!');
          }
        });
    }
  
    // סגירת החיבור לבסיס הנתונים
    connection.end();
}
});

});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
