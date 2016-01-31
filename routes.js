module.exports = function(app){
    var musicians = require('./controllers/musicians');

    app.get('/musicians', musicians.findAll);
    app.get('/musicians/:id', musicians.findById);
}