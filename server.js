const express = require('express');
const fs = require('fs');
const path = require('path');
// The require() statements will read the index.js files in each of the directories indicated. This mechanism works the same way as directory navigation does in a website: If we navigate to a directory that doesn't have an index.html file, then the contents are displayed in a directory listing. But if there's an index.html file, then it is read and its HTML is displayed instead. Similarly, with require(), the index.js file will be the default file read if no other file is provided, which is the coding method we're using here.
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

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

// We add some more middleware to our server and used the express.static() method. The way it works is that we provide a file path to a location in our application (in this case, the public folder) and instruct the server to make these files static resources. This means that all of our front-end code can now be accessed without having a specific server endpoint created for it!
app.use(express.static('public'));

// This is our way of telling the server that any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes. If / is the endpoint, then the router will serve back our HTML routes.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// Now we just need to use one method to make our server listen. We're going to chain the listen() method onto our server to do it. To do that, add the following code to the end.
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});