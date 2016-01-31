var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(request, response) {

	var looksQuery = 'SELECT * FROM looks ORDER BY created DESC';

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(looksQuery, function(err, looks) {
			done();
			if (err) {
				console.error(err);
				response.send("Error " + err);
			} else {
				var data = looks.rows;

				data.forEach(function(look){
					var pilQuery = 'SELECT people.id, nickname ';
						pilQuery += 'FROM looks_person, people ';
						pilQuery += 'WHERE looks_person.person=people.id ';
						pilQuery += 'AND looks_person.look=' + look.id;

					client.query(pilQuery, function(error, person) {
						done();
						if (err) {
							console.error(err);
						} else {
							if (!look.people) {
								look.people = [];
							}
							look.people.push(person.nickname);
						}
					});
				});

				response.send(data);

				// response.render('pages/index', { looks: looks.rows });
			}
		});
	});
});


