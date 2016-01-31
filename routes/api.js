var pg = require('pg');
var q = require('q');

// --- test data for local heroku
// var testData = require('./fixtures/looks.json');

// ---------------------------------------------- do the query to get looks data

var getLooksData = function(){
   var deferred = q.defer();

   var looksQuery = 'SELECT looks.id, looks.image, looks.title, looks.info, people.nickname '
      looksQuery += 'FROM looks, looks_person, people ';
      looksQuery += 'WHERE looks.id = looks_person.look AND looks_person.person = people.id '
      looksQuery += 'ORDER BY looks.created DESC';

   var clientQueryDone = null;

   // ------------------------------------- client query is finished

   var queryDone = function(err, looks) {

      clientQueryDone();

      var data = [];
      var lookup = {};

      // ------------------------------------- fix the returned data
      //
      var updateData = function(look) {
         if (lookup[look.id]) {
            lookup[look.id].people.push(look.nickname);
         } else {
            lookup[look.id] = {
               title: look.title,
               info: look.info,
               image: look.image,
               people: [ look.nickname ]
            }
            data.push(lookup[look.id]);
         }
      };

      if (err) {
         console.error(err);
         deferred.reject(err);
      } else {
         looks.rows.forEach(updateData);
         deferred.resolve(data);
      }
   };

   // ------------------------------------- connect to posgres

   var pgConnected = function(err, client, done) {
      clientQueryDone = done;
      client.query(looksQuery, queryDone);
   };

   pg.connect(process.env.DATABASE_URL, pgConnected);

   return deferred.promise;
}

// ---------------------------------------------- return looks data

exports.getLooks = function(request, response) {
   getLooksData().then(function(data){
      response.send(data);
   })
};

// ---------------------------------------------- render looks

exports.renderLooks = function(request, response) {
   getLooksData().then(function(data){
      response.render('pages/index', { looks: data });
   })
}

