const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

// Location of ParcelJS files
app.use(express.static(path.join(__dirname, '../../dist')));

app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`)
});
