const express = require("express");
const { nanoid } = require("nanoid");
const db = require("./db");

const app = express();
const port = 3001;


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/shorten", async (req, res) => {
  const { fullUrl } = req.body;
  console.log("fullUrl:", fullUrl);
  const shortId = nanoid(7);
  console.log("shortId:", shortId);


   try {
    
    await db.none('INSERT INTO urls(short_id, full_url) VALUES($1, $2)', [shortId, fullUrl]);

    const shortlink = `http://localhost:${port}/${shortId}`;

    res.render('result', { shortId, shortlink });
  } catch (error) {
    console.error('Error inserting URL into database:', error);
    res.sendStatus(500);
  }
});

app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;


  try {
    
    const result = await db.oneOrNone('SELECT full_url FROM urls WHERE short_id = $1', [shortId]);

    if (result) {
      res.redirect(result.full_url);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error retrieving URL from database:', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`le serveur est lancé sur http://localhost:${port}`);
});
