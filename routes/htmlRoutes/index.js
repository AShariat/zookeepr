const path = require('path');
const router = require('express').Router();

router.get('/', (req, res) => {
  // Notice in the res.sendFile() that we're using the path module again to ensure that we're finding the correct location for the HTML code we want to display in the browser. This way, we know it will work in any server environment!
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// The * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response. The * route should always come last. Otherwise, it will take precedence over named routes, and you won't see what you expect to see on routes like /zookeeper.
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;