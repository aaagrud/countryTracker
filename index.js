import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const port = 3000;
const app = express();

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "",
    port: 5432,
});
  
db.connect();
  
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static("public"));

app.get("/",  async (req, res) => {
    var countries = [];
    const result = await db.query("SELECT country_code FROM visited_countries");
    result.rows.forEach((row) => {
        countries.push(row.country_code);
    }); 
    console.log(countries);
    res.render("index.ejs", {
        visitedCountries : countries,
        total : countries.length,
    });
})

app.post("/add", async (req, res) => {
    const input = req.body["country"];
    console.log(input);  
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) = $1;",
      [input.toLowerCase()]
    );
    
  
    if (result.rows.length !== 0) {
      const data = result.rows[0];
      const countryCode = data.country_code;
  
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
        countryCode,
      ]);
      res.redirect("/");
    }

    else{
      console.log("invalid country name");
      res.redirect("/");
    }
  });

app.listen(port, () => {
    console.log(`Server running in port ${port}`);
});
