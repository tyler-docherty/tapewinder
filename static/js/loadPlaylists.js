const placeholders = ["blue", "green", "orange", "pink", "red"];

// eslint-disable-next-line no-unused-vars
getRandomPlaceholder => `/static/tapewinder_placeholder_${placeholders[Math.floor(Math.random()*5)]}`;
