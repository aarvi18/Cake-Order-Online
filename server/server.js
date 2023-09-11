// This file is in es6 form
import  express  from 'express';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();


// rest object
const app = express();

// rest api
const PORT = process.env.PORT || 8080;

// Define a route
app.get('/', (req, res) => {
  // res.send(htmlContent);
  res.send('<h1>Hello, Express!</h1>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is on ${process.env.DEV_MODE} running on http://localhost:${PORT}`.bgBlue.black);
});
