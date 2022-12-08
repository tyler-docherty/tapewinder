const functions = require("firebase-functions");
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const app = express();
app.use("/static/", express.static("static"));
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			// allow bootstrap jsdelivr src
			"script-src": ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"],
			"font-src": ["*"]
		}
	})
);

app.set("view engine", "pug");

app.get("/", (req, res) => {
	const indexPath = path.resolve("./index.pug");
	res.render(indexPath, {loggedOut: true});
});

app.use((res, req, next) => {
	res.status(404).send("https://http.cat/404");
});

exports.app = functions.https.onRequest(app);
