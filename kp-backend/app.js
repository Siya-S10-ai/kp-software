const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Backend is running!');
});
// Export this file so other files can use it.
module.exports = app;
