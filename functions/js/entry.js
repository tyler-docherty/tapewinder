const form = document.getElementById("signupForm");
if (form) form.addEventListener("submit", validate);

function validate(event) {
	// this function is called direct from entry.pug
	const username = "@" + document.getElementById("signupUsername").value;
	const email = document.getElementById("signupEmail").value;
	fetch("https://shr4pnel.com/api/isUnique", {
		method: "POST",
		redirect: "follow",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"username": username, "email": email})
	})
		// im not sure why i have to structure this with 2 .then's.
		// but doing it this way resolves the .json promise (?)
		.then((res) => res.json())
		.then((data) => {
			if (data.usernameUnique && data.emailUnique) {
				clearInputFieldDanger();
				form.submit();
				return;
			}
			else {
				displayErrors(data.usernameUnique, data.emailUnique);
				event.preventDefault();
			}
		})
		.catch((err) => {
			console.error("ENTRY.JS - FETCH FAILED");
			console.error(err);
			document.getElementById("signupErrors").innerHTML = "<p class=\"text-danger\">An unknown error occurred. Please try again in a few minutes.</p>";
		});
	event.preventDefault();
}

function displayErrors(isUsernameUnique, isEmailUnique) {
	clearInputFieldDanger();
	if (!isUsernameUnique) {
		document.getElementById("signupUsernameSpan").classList.add("inputfielddanger");
		document.getElementById("signupUsername").classList.add("inputfielddanger");
		document.getElementById("signupErrors").innerHTML += "<p class=\"text-danger\">This username is already in use. Please try another.</p>";
	}
	if (!isEmailUnique) {
		document.getElementById("signupEmail").classList.add("inputfielddanger");
		document.getElementById("signupErrors").innerHTML += "<p class=\"text-danger\">This email is already in use. Please try another.</p>";
	}
}

function clearInputFieldDanger() {	
	document.getElementById("signupErrors").innerHTML = "";
	document.getElementById("signupUsernameSpan").classList.remove("inputfielddanger");
	document.getElementById("signupUsername").classList.remove("inputfielddanger");
	document.getElementById("signupEmail").classList.remove("inputfielddanger");
}