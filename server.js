const express = require('express');
const fs = require('fs');
const path = require('path');

// Creating a route that the front-end can request data from.
const { animals } = require('./data/animals');

// Applications served over Heroku as well as most hosts must run on port 80. If the host uses HTTPS, then the port would be set to 443.
const PORT = process.env.PORT || 3001;

// To instantiate the server.
const app = express();

// parse incoming string or array data. The express.urlencoded({extended: true}) method is a method built into Express.js. It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object. The extended: true option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data. The express.json() method we used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object. Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data.
app.use(express.json());

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
};

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
};

function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  // Here, we're using the fs.writeFileSync() method, which is the synchronous version of fs.writeFile() and doesn't require a callback function. If we were writing to a much larger data set, the asynchronous version would be better. But because this isn't a large file, it will work for our needs.
  fs.writeFileSync(
    // We want to write to our animals.json file in the data subdirectory, so we use the method path.join() to join the value of __dirname, which represents the directory of the file we execute the code in, with the path to the animals.json file.
    path.join(__dirname, './data/animals.json'),
    // We need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. The other two arguments used in the method, null and 2, are means of keeping our data formatted. The null argument means we don't want to edit any of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our values to make it more readable. If we were to leave those two arguments out, the entire animals.json file would work, but it would be really hard to read.
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
};

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
};

app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();
  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
  // add animal to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);
  res.json(animal);
  }
});

// Now we just need to use one method to make our server listen. We're going to chain the listen() method onto our server to do it. To do that, add the following code to the end.
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});