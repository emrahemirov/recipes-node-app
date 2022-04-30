const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const dbString = process.env.DB_STRING;

mongoose.connect(dbString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', function () {
  console.log('Connected successfully');
});

const RecipeSchema = new mongoose.Schema({
  imageSource: {
    type: String
  },
  header: {
    type: String
  },
  date: {
    type: Date
  },
  introParagraph: {
    type: String
  },
  howToMake: {
    type: String
  },
  ingredients: [
    {
      type: String
    }
  ],
  category: {
    type: String
  }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

app.get('/recipes', async (req, res) => {
  const { pageIndex, category, headerIncludes } = req.query;

  const recipes = await Recipe.find({
    header: { $regex: headerIncludes, $options: 'i' },
    category: category
  })
    .select('_id imageSource header category')
    .skip(pageIndex * 20)
    .limit(20);

  res.status(200).json(recipes);
});

app.get(['/recipes/:id'], async (req, res) => {
  const { id: recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  res.status(200).json(recipe);
});

app.listen(process.env.PORT || 8081, () => {
  console.log(`app listening on port 8081`);
});
