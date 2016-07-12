# highlight

## Setting it up

Make sure you have mongo, node and grunt-cli installed then run (https://github.com/gruntjs/grunt-cli)

```
git clone https://github.com/gtdudu/whire-interview.git
cd whire-interview
npm install
```

In order for grunt to launch mongod you will need to create a data/db folder at the root of the project
```
  mkdir -p data data/db
```

You're all set.

## Run

To start your project just run
```
grunt
```

Grunt is setup to:
- launch mongod
- check that all js files respect best code practices with jshint
- process less files into css
- concat and minify css into one file
- concat and minify js into one file
- execute server.js
- reload application on file change
