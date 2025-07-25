const {
  client,
  seed,
} = require('./db');
const express = require('express');
const app = express();
//body parsing middleware
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

//use api routes
app.use('/api', require('./api'))

//custom error handling route
app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async()=> {
  const PORT = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  await seed();

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
  });
};

init();

