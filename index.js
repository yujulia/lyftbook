var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var api = require('./routes/api');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', api.renderLooks);
app.get('/login', api.renderLogin);

app.get('/api/looks', api.getLooks);
app.get('/api/look/:id', api.getLook);