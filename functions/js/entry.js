document.getElementById("signupForm").addEventListener("submit", validateUsername);

function validateUsername(event) {
	// this function is called direct from entry.pug
	const username = "@" + document.getElementById("signupUsername").value;
	fetch("http://127.0.0.1:5000/api/usernameUnique", {
		method: "POST",
		mode: "same-origin",
		credentials: "omit",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({"username": username})
	})
		// im not sure why i have to structure this with 2 .then's.
		// but doing it this way resolves the .json promise (?)
		.then((res) => res.json())
		.then((data) => {
			if (data.unique) {
				return true;
			}
		})
		.catch(() => {
			console.error("ENTRY.JS - FETCH FAILED");
		});
	document.getElementById("signupUsernameSpan").classList.add("inputfielddanger");
	document.getElementById("signupUsername").classList.add("inputfielddanger");
	document.getElementById("signupErrors").innerHTML = "<p class=\"text-danger\">This username is already in use. Please try another.</p>";
	event.preventDefault();
}