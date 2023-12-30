var sqlite3 = require("sqlite3").verbose();

var DBSOURCE = "./db/db.sqlite";

var db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    // Модифікований код для створення таблиць
    db.run(
      `
CREATE TABLE posts (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 title TEXT,
 author TEXT,
 body TEXT
)`,
      (err) => {
        if (err) {
          console.log("Table posts already created: " + err.message);
        } else {
          console.log("Table posts is created");
        }
      }
    );

    db.run(
      `
CREATE TABLE comments (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 author TEXT,
 comment TEXT,
 post_id INTEGER,
 FOREIGN KEY(post_id) REFERENCES posts(id)
)`,
      (err) => {
        if (err) {
          console.log("Table comments already created: " + err.message);
        } else {
          console.log("Table comments is created");
        }
      }
    );
  }
});

module.exports = db;
