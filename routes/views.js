
var api = require('./routes/api');

exports.allLooks = function(request, response) {

   var data = api.getLooks();
   response.render('pages/index', { looks: data });
};