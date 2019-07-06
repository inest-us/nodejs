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
var credentials = require('./lib/credentials');
app.use(require('cookie-parser')(credentials.cookiesSecret));
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookiesSecret
}));

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
    
    //if there is a flash message, transfer it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
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

var VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' + 
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' + 
    '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?) + $'); 

app.post('/newsletter', function(req, res) { 
    var name = req.body.name || '', email = req.body.email || ''; 
    // input validation 
    if(!email.match(VALID_EMAIL_REGEX)) { 
        if(req.xhr) {
            return res.json({ error: 'Invalid name email address.' }); 
        }
        req.session.flash = { 
            type: 'danger', 
            intro: 'Validation error!', 
            message: 'The email address you entered was not valid.' 
        }; 
        return res.redirect(303, '/newsletter/archive'); 
    } 
    
    new NewsletterSignup({ name: name, email: email }).save(function(err) { 
        if(err) { 
            if(req.xhr) {
                return res.json({ error: 'Database error.' }); 
            }
            req.session.flash = { 
                type: 'danger', 
                intro: 'Database error!', 
                message: 'There was a database error; please try again later.' 
            };
            return res.redirect(303, '/newsletter/archive');
        } 
        if(req.xhr) { 
            return res.json({ success: true }); 
        }
        req.session.flash = { 
            type: 'success', 
            intro: 'Thank you!', 
            message: 'You have now been signed up for the newsletter.' 
        }; 
        return res.redirect(303, '/newsletter/archive'); 
    }); 
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
