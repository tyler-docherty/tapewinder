const express = require("express");
const path = require("path");
const helmet = require("helmet");
const PORT = 8080;
const app = express();

app.use("/static/", express.static("static"));
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			"script-src": ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"]
		}
	})
)
app.set("view engine", "pug");

app.get("/", (req, res) => {
	const indexPath = path.resolve("./index.pug");
	res.render(indexPath, {rootPath: __dirname}); // eslint-disable-line no-undef
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
