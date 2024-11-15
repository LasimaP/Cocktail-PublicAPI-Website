import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

// API request to get a random cocktail
app.get("/randomCocktail", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.redirect("/");
  }
});

// API request to get random cocktail based on spirit
app.post("/randomCocktail", async (req, res) => {
  // First gets list of cocktails based on spirit chosen in menu
  try {
    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${req.body["spirit"]}`
    );
    const drinks = response.data.drinks;
    var randomDrink = Math.floor(Math.random() * drinks.length);
    var randomDrinkId = drinks[randomDrink].idDrink;

    // Then uses id from random drink in list to get full cocktail details
    try {
      const response = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${randomDrinkId}`
      );
      const result = response.data;
      res.render("index.ejs", { data: result });
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.redirect("/");
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
