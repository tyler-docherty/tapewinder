require("dotenv").config();
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const functions = require("firebase-functions");
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const app = express();
const firebaseConfig = {
	apiKey: process.env.apiKey,
	authDomain: "tapewinder-node.firebaseapp.com",
	projectId: "tapewinder-node",
	storageBucket: "tapewinder-node.appspot.com",
	messagingSenderId: "850697091268",
	appId: "1:850697091268:web:699e0eebd05279744cf191"
};
const firebaseApp = initializeApp(firebaseConfig);

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

exports.app = functions.https.onRequest(app);
