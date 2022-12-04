const express = require("express");
const path = require("path");
const PORT = 8080;
const app = express();

app.use("/static/", express.static("static"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
	const indexPath = path.resolve("./index.pug");
	res.render(indexPath, {rootPath: __dirname}); // eslint-disable-line no-undef
});

app.get("/noPug", (req, res) => {
	const indexPath = path.resolve("./index.html");
	res.sendFile(indexPath);
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
