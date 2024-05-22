import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const port = 3000;
const app = express();

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "caramelcheese",
    port: 5432,
  });
  
db.connect();

var countries = ["AE", "AF"];

app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        visitedCountries : countries,
        total : countries.length,
    });
})

app.listen(port, () => {
    console.log(`Server running in port ${port}`);
});
