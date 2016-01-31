var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {

	var looksQuery = 'SELECT * FROM looks ORDER BY created DESC';

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(looksQuery, function(err, looks) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
			} else {

				looks.rows.forEach(function(look){
					var peopleQuery = 'SELECT people.id, nickname';
					peopleQuery += 'FROM looks_person, people ';
					peopleQuery += 'WHERE looks_person.person=people.id AND looks_person.look=' + look.id;

					console.log("PPP", peopleQuery);
					// client.query(peopleQuery, function(err, re2) {
					// 	done();
					// 	if (err) {

					// 	} else {
					// 		console.log('people return', re2);
					// 	}

					// });

				});

				response.render('pages/index', { looks: looks.rows });
			}
		});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/**
 * ================== API
 */

app.get('/api/looks', function(request, response){
	var data;
	data = {
		test: "dummy"
	}
	response.send(data);
});
