var express = require('express'); 
var app = express(); 
app.set('port', process.env.PORT || 3000); 
app.use(express.static(__dirname + '/public'));
var fortune = require('./lib/fortune');
var tours = [
    {id: 0, name: 'Hood River', price: 99.99},
    {id: 1, name: 'Oregon Coast', price: 149.95}
];
// set up handlebars view engine 
var handlebars = require('express-handlebars').create({ 
    defaultLayout: 'main'
    /*helpers:{
        section:function(name, options){
            if(!this._sections){this._sections = {}};
            this._sections[name] = options.fn(this);
            return null;
        }
    }*/
}); 
app.engine('handlebars', handlebars.engine); 
app.set('view engine', 'handlebars');

app.use(function (req, res, next) { 
    //res.locals is an object containing default context for rendering views
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'; 

    if (!res.locals.partials) {
		res.locals.partials = {}; 
    }
	res.locals.partials.weatherContext = getWeatherData(); 
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

app.get('/headers', function (req , res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) {
        s += name + ': ' + req.headers[name] + '\n';
    }
    res.send(s);
}); 

app.get('/no-layout', function(req, res) { 
    res.render('no-layout', {layout: null}); 
}); 

app.get('/api/tours', function(req, res) {
    res.json(tours);
});

app.get('/tours/hood-river', function(req, res) { 
    res.render('tours/hood-river'); 
}); 

app.get('/tours/request-group-rate', function(req, res) { 
    res.render('tours/request-group-rate'); 
});

app.put('/api/tour/:id', function (req , res) { 
    var p = tours.filter(function(t) {
        return t.id == req.params.id
    })[0];
    if (p) {
        if (req.query.name) {
            p.name = req.query.name;
        }
        if (req.query.price) {
            p.price = req.query.price;
        }
        res.json({success: true});
    } else {
        res.json({error: 'No such tour exists.'});
    }
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

function getWeatherData() { 
	return { 
		locations: [ 
			{ 
                name: 'Portland', 
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html', 
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif', 
                weather: 'Overcast', 
                temp: '54.1 F (12.3 C)' 
            }, 
			{ 
                name: 'Bend', 
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html', 
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif', 
                weather: 'Partly Cloudy', 
                temp: '55.0 F (12.8 C)' 
            }, 
			{ 
                name: 'Manzanita', 
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html', 
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif', 
                weather: 'Light Rain', 
                temp: '55.0 F (12.8 C)' 
            } 
		]
	}; 
}

