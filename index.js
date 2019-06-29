var express = require('express'); 
var app = express(); 
app.set('port', process.env.PORT || 3000); 
app.use(express.static(__dirname + '/public'));
var fortune = require('./lib/fortune');

// set up handlebars view engine 
var handlebars = require('express-handlebars').create({ 
    defaultLayout: 'main' 
}); 
app.engine('handlebars', handlebars.engine); 
app.set('view engine', 'handlebars');

app.use(function (req, res, next) { 
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'; 
    next(); 
});

app.get('/', function (req , res) { 
    res.render('home');
}); 

app.get('/about', function (req , res) { 
    var randomFortune = fortune.getFortune();
    res.render('about', { 
        fortune: randomFortune,
        pageTestScript: '/qa/tests-about.js'
    });
}); 

// custom 404 page 
app.use(function (req , res) { 
    res.status(404); 
    res.render('404');
}); 

//custom 500 page
app.use(function(err, req, res, next) { 
    console.error(err.stack); 
    res.status(500); 
    res.render('500');
}); 

app.listen(app.get('port'), function () { 
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.'); 
}); 

