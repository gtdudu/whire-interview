var express       = require('express');
var http          = require('http');
var bodyParser    = require('body-parser');
var logger        = require('morgan');
var mongoose      = require('mongoose');
var app           = express();

// connect to mongod default port:27017
mongoose.connect('mongodb://localhost:27017/whire', function(err) {
    if (err)
      throw err;
    console.log('Successfully connected to MongoDB');
});

// logs usefull intel for every requested routes
app.use(logger('dev'));


/*
 * populates the req.body property with the parsed body, or an empty object ({})
 * if there was no body to parse (or an error was returned).
*/
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));



// serves all html files
app.use(express.static(__dirname + '/client/views'));

// serves processed css and js
app.use(express.static(__dirname + '/client/dist'));


var comment = require('./server/routes/comment.js');

app.get('/api/comments', comment.getAll);
app.post('/api/comment/', comment.create);
app.put('/api/comment/:id', comment.update);
app.delete('/api/comment/:id', comment.delete);



// if we're not working with our rest api send index.html
// this is necessary because we use html5mode(true) on client side
// otherwise our app will break on page refresh
app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/client/views/index.html');
});


http.createServer(app).listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
