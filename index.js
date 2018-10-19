'use strict';

require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Node server running on http://localhost:' + port);
});
