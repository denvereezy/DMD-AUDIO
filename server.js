const express          = require('express'),
	  app              = express(),
	  bodyParser 	   = require('body-parser'),
	  cookieParser 	   = require('cookie-parser'),
	  compression 	   = require('compression'),
	  multer 		   = require('multer'),
	  exhbs            = require('express-handlebars'),
	  router		   = express.Router(),
	  connection       = require('./routes/index'),
	  music            = require('./routes/music'),
	  MusicDataService = require('./data-services/musicDataService'),
      routing 		   = require('./routes/routing');


const dbOptions = {
	host      : 'localhost',
    port      : 3306,
    user      : 'admin',
    password  : 'password',
    database  : 'music'
};

const serviceSetupCallBack = function (connection) {
	return {
		musicDataService : new MusicDataService(connection)
	}
};

app.use(connection(dbOptions, serviceSetupCallBack));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use(compression());
app.engine('handlebars', exhbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.get('/', routing.home);

router.get('/edit/:id', music.edit);
router.post('/update/:id', music.update);
router.get('/music', music.songs);
router.post('/music', multer({ dest: './public/uploads/'}).single('audio'), music.add);
router.post('/delete/:id', music.delete);

app.use('/api', router);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('App running on port', port);
});
