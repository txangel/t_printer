## How to set it up:

`npm install` (for recent Linuxes you will need to do `npm install --python=python2` because node-gpy used by jQuery's
installation is a Python 2 piece of software)


## How to run it:

1. Start the app:

`node bin/www`

2. Go to: `http://localhost:3000/coke` (other keywords also work and the port can be configured using the default express PORT environment variable)


### Missing still:

1. Automated tests (for instance the comparator seems finally right but it might not be)
2. Serializing the collection to some more permanent storage (there are a few npm packages because few people use backbone directly with nodejs (and in production you end up with a DB in the backend anyways. Writing and testing a custom adapter is easy but it takes a few hours)

### Things I wasted time on:

Finding out why I am getting two GET requests when refreshing the page after adding the rendering code (it might be a wierd interaction between express, backbone, and epiphany)