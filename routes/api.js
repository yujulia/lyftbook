var pg = require('pg');
var q = require('q');
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// --- test data for local heroku
var fakeData = require('../fixtures/looks.json');

// TODO ----------------------------------------------
//
// move api endpoints to one module and routes to another, make shared functions into its own module

var getLooksQuery = function() {
   var looksQuery = 'SELECT looks.show, looks.id, looks.image, looks.title, looks.info, people.nickname '
      looksQuery += 'FROM looks, looks_person, people ';
      looksQuery += 'WHERE looks.id = looks_person.look AND looks_person.person = people.id '
      looksQuery += 'ORDER BY looks.show_order ASC';

   return looksQuery;
};

var getDetailQuery = function(id) {
   var detailQuery = 'SELECT looks.show, looks.id, looks.image, looks.title, looks.info, people.nickname '
      detailQuery += 'FROM looks, looks_person, people ';
      detailQuery += 'WHERE looks.id='+id+' ';
      detailQuery += 'looks.id = looks_person.look AND looks_person.person = people.id ';
      detailQuery += 'ORDER BY looks.show_order ASC';

   return detailQuery;
};

// ---------------------------------------------- do the query to get looks data

var getData = function(data_query) {
   var deferred = q.defer();
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
            var lookDate = new Date(look.show);

            lookup[look.id] = {
               title: look.title,
               info: look.info,
               image: look.image,
               people: [ look.nickname ],
               date: {
                  year: lookDate.getFullYear(),
                  month: monthNames[lookDate.getMonth()],
                  day: lookDate.getDate()
               }
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
      client.query(data_query, queryDone);
   };

   pg.connect(process.env.DATABASE_URL, pgConnected);

   return deferred.promise;
};

// ---------------------------------------------- return looks data

exports.getLook = function(request, response) {
   getData(getDetailQuery(request.params.id)).then(function(data){
      response.send(data);
   });
};

// ---------------------------------------------- return looks data

exports.getLooks = function(request, response) {
   getData(getLooksQuery()).then(function(data){
      response.send(data);
   });
};

// ---------------------------------------------- render looks

exports.renderLooks = function(request, response) {
   // response.render('pages/index', { looks: fakeData });
   getData(getLooksQuery()).then(function(data){
      response.render('pages/index', { looks: data });
   });
};

// ---------------------------------------------- render login

exports.renderLogin = function(request, response) {
   response.render('pages/login');
};

// ---------------------------------------------- render detail page

exports.renderLogin = function(request, response) {
   response.render('pages/detail');
};