const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    instructions: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient' // Reference to the Ingredient model
    }]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;