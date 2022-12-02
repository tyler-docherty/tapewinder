let path = require("path");
const placeholders = ["blue", "green", "orange", "pink", "red"];


function getRandomPlaceholder() { // eslint-disable-line no-unused-vars
	let currentWorkingDirectory = __dirname; // eslint-disable-line no-undef
	let randomImagePath = `/static/tapewinder_placeholder_${placeholders[Math.floor(Math.random()*5)]}`;
	const fullPath = path.resolve(currentWorkingDirectory + randomImagePath);
	return `${fullPath}`;
}
