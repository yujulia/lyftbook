

module.exports = function(api) {
   this.api = api;
};

exports.allLooks = function(request, response) {

   var data = this.api.getLooks();
   response.render('pages/index', { looks: data });
};