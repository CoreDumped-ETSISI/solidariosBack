const app = require('./app');

const server = app.listen(app.get("port"), () => {
	    console.log("App running in port " + app.get("port"));
});

module.exports = server;
