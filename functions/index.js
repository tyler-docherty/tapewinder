// IMPORTANT
// USE NODE 14 BUT SPECIFY nodejs16 IN FIREBASE.JSON
// CANNOT FIND ANY DOCUMENTED OCCURENCES OF THIS BUG
// BUT ENDPOINTS WILL NOT BE SERVED OTHERWISE
import * as dotenv from "dotenv";
dotenv.config({path: "./GCPCREDENTIALS.env"});
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs  } from "firebase/firestore";
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
			"script-src-attr": ["'self'"],
			"img-src": ["'self'"],
			"font-src": ["*"],
			"object-src": ["'self'"],
			"default-src": ["'self'"] // ["'none'"] DEPLOY THIS. NOT THAT!!!
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
	res.render(indexPath, {error: "An error occured. An account using this email address already exists in our database, please register using a different email address."});
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
		const auth = getAuth();
		const username = `@${req.body.signupUsername}`;
		createUserWithEmailAndPassword(auth, req.body.signupEmail, req.body.signupPassword)
			.then((userCredential) => {
				updateProfile(userCredential, {
					displayName: username,
					photoURL: "https://shr4pnel.com/img/tapewinder_profilepicture.jpg"
				})
					.then(() => {
						console.log(`SUCCESS - Account created with credentials\nemail: ${req.body.email}\nusername: ${username}`);
					})
					.catch((err) => {
						console.error("ERROR - updateProfile():");
						console.error(err.code);
						console.error(err.message);
					});
			})
			.catch((err) => {
				console.error("ERROR - createUserWithEmailAndPassword():");
				console.error(err.code);
				console.error(err.message);
			});
	});

app.post("/api/isUnique", async (req, res) => {
	// username database query
	const response = {};
	const username = req.body.username;
	const email = req.body.email;
	const usernameQuery = query(collection(db, "users"), where("displayName", "==", username));
	const usernameQuerySnapshot = await getDocs(usernameQuery);
	// if no other matching usernames, the username is unique. returns this
	response["usernameUnique"] = usernameQuerySnapshot.empty;
	// email database query
	const emailQuery = query(collection(db, "users"), where("email", "==", email));
	const emailQuerySnapshot = await getDocs(emailQuery);
	response["emailUnique"] = emailQuerySnapshot.empty;
	res.send(JSON.stringify(response));
});

app.post("/api/userHasMixtapes", (req, res) => {
	const auth = getAuth();
	if (auth.currentUser === null) {
		res.send(JSON.stringify({userHasMixtapes: false, mixtapeCount: 0}));
	}
	res.send(JSON.stringify({userHasMixtapes: true, mixtapeCount: undefined}));
});

export const exportApp = onRequest(app);