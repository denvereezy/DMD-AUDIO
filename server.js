const express          = require('express'),
	  app              = express(),
	  bodyParser 	   = require('body-parser'),
	  cookieParser 	   = require('cookie-parser'),
	  compression 	   = require('compression'),
	  multer 		   = require('multer'),
	  exhbs            = require('express-handlebars'),
	  server      	   = require('http').createServer(app),
	  io			   = require('socket.io')(server),
	  router		   = express.Router(),
	  connection       = require('./routes/index'),
	  music            = require('./routes/music'),
	  MusicDataService = require('./data-services/musicDataService'),
      routing 		   = require('./routes/routing'),
	  remote		   = require('./utils/remoteServer');


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
router.post('/music', multer({ dest: './public/uploads/'}).array('audio'), music.add);
router.post('/delete/:id', music.delete);

app.use('/api', router);

io.sockets.on('connection', socket => {
	console.log('socket connection established');
	remote.control(socket);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log('App running on port', port);
});
