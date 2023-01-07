# tapewinder - music centric social networking

## directory structure

`./functions`

Contains the express.js entrypoint, as well as unbundled js and template files.

`./static`

Contains assets to be uploaded to firebase hosting, favicons, css, the bundle file and images.

## project details

tapewinder is a social networking platform designed from the ground up using node.js. It leverages the pug templating engine to deliver dynamic content without the memory overhead of a frontend framework like angular or vue. It is deployed on the Google Cloud Platform and uses Google Firebase as a solution for user storage, static asset hosting, content delivery and cloud functions which i use to serve my express.js endpoints.
