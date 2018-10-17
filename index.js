'use strict';


const app = require('./app');
const config = require('./config');



app.listen(config.PORT, () => {
    console.log('Node server running on http://localhost:' + config.PORT);
});
