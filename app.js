const express = require("express");
const app = express();
const db = require("./database.js");

app.set("view engine", "ejs");
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index", { activePage: "home" });
});

app.get("/contact", function (req, res) {
  res.render("partials/contact", { activePage: "contact" });
});

app.post("/contact", function (req, res) {
  res.render("partials/contact-answer", {
    activePage: "contact",
    formData: req.body,
  });
});

app.get("/create-post", function (req, res) {
  res.render("partials/create-post", { activePage: "create-post" });
});

app.post("/create-post", function (req, res) {
  res.render("partials/post-created", {
    activePage: "create-post",
    formData: req.body,
  });
});

app.get("/posts", function (req, res) {
  var sql = "SELECT * FROM posts";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400);
      res.send("database error:" + err.message);
      return;
    }
    res.render("posts", { activePage: "posts", posts: rows });
  });
});

app.get("/new-post", function (req, res) {
  res.render("new-post", { activePage: "new-post" });
});

app.post("/new-post", function (req, res) {
  var data = [req.body.title, req.body.author, req.body.body];
  var sql = "INSERT INTO posts (title, author, body) VALUES (?,?,?)";
  db.run(sql, data, function (err, result) {
    if (err) {
      res.status(400);
      res.send("database error:" + err.message);
      return;
    }
    res.render("new-post-answer", {
      activePage: "new-post",
      formData: req.body,
    });
  });
});

app.get("/posts/:id/edit", function (req, res) {
  var sql = "SELECT * FROM posts WHERE id = ?";
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400);
      res.send("database error:" + err.message);
      return;
    }
    res.render("edit-post", { post: row, activePage: "posts" });
  });
});

app.post("/posts/:id/edit", function (req, res) {
  var data = [req.body.title, req.body.author, req.body.body, req.params.id];
  db.run(
    `UPDATE posts SET
   title = COALESCE(?,title),
   author = COALESCE(?,author),
   body = COALESCE(?,body)
   WHERE id = ?`,
    data,
    function (err, result) {
      if (err) {
        res.status(400);
        res.send("database error:" + err.message);
        return;
      }
      res.redirect("/posts");
    }
  );
});

app.get("/posts/:id/delete", function (req, res) {
  var sql = "DELETE FROM posts WHERE id = ?";
  var params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400);
      res.send("database error:" + err.message);
      return;
    }
    res.redirect("/posts");
  });
});

app.listen(3000);
