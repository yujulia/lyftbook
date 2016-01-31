var express = require('express');
var app = express();
var pg = require('pg');
var api = require('./routes/api');

// --- test data for local heroku
// var testData = require('./fixtures/looks.json');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(request, response){
   var data = api.getLooks(request, response);
   console.log('got data', data);
   response.send(data)
   // response.render('pages/index', data);
});

// app.get('/', api.getLooks);

// app.get('/', function(request, response) {

//    var looksQuery = 'SELECT looks.id, looks.image, looks.title, looks.info, people.nickname '
//       looksQuery += 'FROM looks, looks_person, people ';
//       looksQuery += 'WHERE looks.id = looks_person.look AND looks_person.person = people.id '
//       looksQuery += 'ORDER BY looks.created DESC';

//    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//       client.query(looksQuery, function(err, looks) {
//          done();
//          if (err) {
//             console.error(err);
//             response.send("Error " + err);
//          } else {
//             var data = [];
//             var lookup = {};

//             // transform this data;
//             looks.rows.forEach(function(look) {
//                if (lookup[look.id]) {
//                   lookup[look.id].people.push(look.nickname);
//                } else {
//                   lookup[look.id] = {
//                      title: look.title,
//                      info: look.info,
//                      image: look.image,
//                      people: [ look.nickname ]
//                   }
//                   data.push(lookup[look.id]);
//                }
//             });

//             response.send(data);
//             // response.render('pages/index', { looks: data });
//          }
//       });
//    });

//    // response.render('pages/index', { looks: testData });
// });


