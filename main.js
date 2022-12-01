const express = require("express");
const PORT = 80;
const app = express();

app.get("/", (req, res) => {
	res.sendFile("index.html");
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
