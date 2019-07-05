var express = require('express'); 
var app = express(); 
var formidable=require('formidable');
var jqupload = require('jquery-file-upload-middleware');
app.set('port', process.env.PORT || 3000); 
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({ extended : true })); 
app.use('/upload', function(req, res, next) { 
    var now = Date.now(); 
    jqupload.fileHandler({ 
        uploadDir: function() { 
            return __dirname + '/public/uploads/' + now; 
        }, 
        uploadUrl: function() { 
            return '/uploads/' + now; 
        } 
    })(req, res, next); 
});

var fortune = require('./lib/fortune');
var weather = require('./lib/weather');
var tours = [
    {id: 0, name: 'Hood River', price: 99.99},
    {id: 1, name: 'Oregon Coast', price: 149.95}
];
// set up handlebars view engine 
var handlebars = require('express-handlebars').create({ 
    defaultLayout: 'main',
    helpers: { 
        section: function (name, options) { 
            if(!this._sections) {
                this._sections = {};
            }; 
            this._sections[name] = options.fn(this); 
            return null; 
        } 
    }
}); 
app.engine('handlebars', handlebars.engine); 
app.set('view engine', 'handlebars');

app.use(function (req, res, next) { 
    //res.locals is an object containing default context for rendering views
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1'; 

    if (!res.locals.partials) {
		res.locals.partials = {}; 
    }
	res.locals.partials.weatherContext = weather.getWeatherData(); 
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

app.get('/jquery-test', function(req, res) { 
    res.render('jquery-test', {layout: 'sectionlayout'} ); 
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

app.get('/newsletter', function (req , res) { 
    res.render('newsletter', { csrf : 'CSRF token goes here' }); 
}); 

app.get('/thank-you', function (req , res) { 
    res.render('thank-you', {user: req.query.user}); 
}); 

app.post('/process', function (req, res) { 
    if(req.xhr || req.accepts('json, html') ==='json') { 
        //if there were an error, we would send { error: 'error description' } 
        res.send({success: true}); 
    } else { 
        //if there were an error, we would redirect to an error page 
        res.redirect(303, '/thank-you'); 
    }
}); 

app.get('/contest/vacation-photo', function(req, res) { 
    var now=new Date(); 
    res.render('contest/vacation-photo', { year: now.getFullYear(), month:now.getMonth() }); 
}); 

app.post('/contest/vacation-photo/:year/:month', function(req, res) { 
    var form = new formidable.IncomingForm(); 
    form.parse(req, function(err, fields, files) { 
        if(err) { 
            return res.redirect(303, '/error'); 
        }
        console.log('received fields:'); 
        console.log(fields); 
        console.log('received files:'); 
        console.log(files); 
        res.redirect(303, '/thank-you'); 
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
