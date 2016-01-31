var pg = require('pg');
var Q = require('q');

// --- test data for local heroku
// var testData = require('./fixtures/looks.json');

var getLooksData = function(callback){
   var looksQuery = 'SELECT looks.id, looks.image, looks.title, looks.info, people.nickname '
      looksQuery += 'FROM looks, looks_person, people ';
      looksQuery += 'WHERE looks.id = looks_person.look AND looks_person.person = people.id '
      looksQuery += 'ORDER BY looks.created DESC';

   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query(looksQuery, function(err, looks) {

         done();

         var data = [];
         var lookup = {};

         if (err) {
            console.error(err);
            data[{ error: err }];
         } else {
            looks.rows.forEach(function(look) {
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
            });
         }

         callback(data);
      });
   });
}

var getLooksData2 = function(){
   var deferred = Q.defer();

   var looksQuery = 'SELECT looks.id, looks.image, looks.title, looks.info, people.nickname '
      looksQuery += 'FROM looks, looks_person, people ';
      looksQuery += 'WHERE looks.id = looks_person.look AND looks_person.person = people.id '
      looksQuery += 'ORDER BY looks.created DESC';

   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query(looksQuery, function(err, looks) {

         done();

         var data = [];
         var lookup = {};

         if (err) {
            console.error(err);
            deferred.reject(err);
         } else {
            looks.rows.forEach(function(look) {
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
            });

            deferred.resovle(data);
         }

      });
   });
   return deferred.promise;
}

// ---------------------------------------------- return looks data

exports.getLooks = function(request, response) {
   getLooksData2().then(function(data){
      response.send(data);
   })
   // var getLooksCallback = function(data) {
   //    response.send(data);
   // }
   // getLooksData(getLooksCallback);
};

// ---------------------------------------------- render looks

exports.renderLooks = function(request, response) {
   var renderLooksCallback = function(data) {
      response.render('pages/index', { looks: data });
   }
   getLooksData(renderLooksCallback);
}

