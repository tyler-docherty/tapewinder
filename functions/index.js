import * as dotenv from "dotenv";
dotenv.config({path: "./GCPCREDENTIALS.env"});
import * as functions from "firebase-functions";
import admin from "firebase-admin";
const { firestore } = admin;
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { onRequest } from "firebase-functions/v1/https";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { body, validationResult } from "express-validator";
import express from "express";
import path from "path";
import helmet from "helmet";
const app = express();
const firebaseConfig = {
	apiKey: process.env.FIREBASEAPIKEY, // eslint-disable-line
	authDomain: "tapewinder-node.firebaseapp.com",
	projectId: "tapewinder-node",
	storageBucket: "tapewinder-node.appspot.com",
	messagingSenderId: "850697091268",
	appId: "1:850697091268:web:699e0eebd05279744cf191"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
app.use("/static/", express.static("static"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			"script-src": ["'self'"],
			"img-src": ["'self'"],
			"font-src": ["*"],
			"object-src": ["'self'"],
			"default-src": ["'none'"]
		}
	})
);
app.set("view engine", "pug");

app.get("/", (req, res) => {
	const auth = getAuth();
	const user = auth.currentUser;
	if (user) {
		const indexPath = path.resolve("./pug/landing.pug");
		res.render(indexPath);
	} else {
		const indexPath = path.resolve("./pug/landing.pug");
		res.render(indexPath);
	}
});

app.get("/failure/password", (req, res) => {
	const indexPath = path.resolve("./pug/failure.pug");
	res.render(indexPath, {error: "Passwords do not match. Please try again."});
});

app.get("/failure/registration", (req, res) => {
	const indexPath = path.resolve("./pug/failure.pug");
	res.render(indexPath, {error: "An error occured during account registration, please try again."});
});

app.get("/failure/registration/insecure", (req, res) => {
	const indexPath = path.resolve("./pug/failure.pug");
	res.render(indexPath, {error: "An error occured during account registration. Automatically generated passwords may not fit password criteria, was your password secure enough?"});
});

app.get("/failure/registration/email", (req, res) => {
	const indexPath = path.resolve("./pug/failure.pug");
	res.render(indexPath, {error: "An error occured. An account using this email address already exists in our database, please register using a different email address."})
});

app.get("/success", (req, res) => {
	const indexPath = path.resolve("./pug/success.pug");
	const auth = getAuth();
	const user = auth.currentUser;
	const username = user ? user.displayName : undefined;
	res.render(indexPath, {username: username});
});

app.post(
	"/api/signup",
	body("signupEmail").isEmail(),
	body("signupUsername").matches(/^[a-zA-Z0-9._-]{3,20}$/), // A-Z, a-z, 0-9, between 3 and 20 characters
	body("signupPassword").isStrongPassword().isLength({min: 8, max: 255}),
	(req, res) => {
		if (req.body.signupPassword !== req.body.signupConfirmPassword) {
			res.redirect("/failure/password");
			return;
		}
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.error(errors);
			res.redirect("/failure/registration/insecure");
			return;
		}
		const auth = getAuth(firebaseApp);
		createUserWithEmailAndPassword(auth, req.body.signupEmail, req.body.signupPassword)
			.then(async (userCredential) => {
				const user = userCredential.user;
				const username = "@" + req.body.signupUsername;
				const defaultImg = "https://shr4pnel.com/img/tapewinder_profilepicture.jpg";
				updateProfile(auth.currentUser, {
					displayName: username,
					photoURL: defaultImg
				});
				try {
					const docRef = await addDoc(collection(db, "users", user.uid), {
						email: req.body.signupEmail,
						displayName: username,
						photoURL: defaultImg
					})
						.catch((error) => {
							console.error("document creation fucked lul");
							console.error(error.code);
							res.redirect("/failure/registration");
						});
				} catch(e) {
					console.error(e);
				}
				// collection("users").add({
				// 	email: req.body.signupEmail,
				// 	displayName: username,
				// 	photoURL: defaultImg
				// }).catch(() => {
				// 	console.error("username taken bozo!");
				// 	res.redirect("/failure/registration");
				// 	return;
				//});
				sendEmailVerification(auth.currentUser);
				res.redirect(`/success?user=${encodeURI(username)}`);
				return;
			})
			.catch((error) => {
				console.log("i am in the final catch block");
				console.error(error);
				switch (error.code) {
				case "auth/email-already-in-use":
					res.redirect("/failure/registration/email");
					break;
				default:
					res.redirect("/failure/registration");
				}
				return;
			});
	});

export const exportApp = onRequest(app);

export const enforceUniqueUsername = functions.firestore
	.document("users/{userID}")
	.onWrite(async (change) => {
		console.log("enforceUniqueUsername has fired!");
		const data = change.after.data();
		const snapshot = await firestore()
			.collection("users")
			.where("displayName", "==", data.displayName)
			.get();
		if (snapshot.size > 0) {
			return change.after.ref.set(null, {merge: true});
		}
		return null;
	});
