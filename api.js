// ------------------- /api/peopleinlook/:id

app.get('/api/peopleinlook/:id', function(request, response){

	var pilQuery = 'SELECT people.id, nickname ';
		pilQuery += 'FROM looks_person, people ';
		pilQuery += 'WHERE looks_person.person=people.id ';
		pilQuery += 'AND looks_person.look=' + request.params.id;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(pilQuery, function(err, people) {
			done();
			if (err) {
				response.send({ error: err });
			} else {
				response.send({ people : people.rows });
			}
		});
	});
});

// ------------------- /api/looks

app.get('/api/looks', function(request, response){

	var looksQuery = 'SELECT * FROM looks ORDER BY created DESC';

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(looksQuery, function(err, looks) {
			done();
			if (err) {
				returnError(response, err);
			} else {
				response.send({ looks : looks.rows });
			}
		});
	});
});
