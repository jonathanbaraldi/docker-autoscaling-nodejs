var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');

var redis = require('redis');
var client = redis.createClient('6379', 'redis');
var port = 8080; 

// Parsear o conteudo
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  	extended: true
}));

// Configuração da requisição, cabeçalhos, etc. CORS
app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	// Métodos que queremos permitir
  	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});

// Counter
app.get('/',function(req,res){

	client.incr('counter', function(err, counter) {
    	if(err) return next(err);
    	var data = {
			"data":"",
			"hostname":process.env.HOSTNAME
		};
		data["data"] = 'API chamada  ' + counter + ' vezes!';
    	res.json(data);
    	console.log(data);
 	});
	/*
		process.env
		{ NODE_VERSION: '4.6.0',
		  HOSTNAME: '17f9839f6626',
		  NPM_CONFIG_LOGLEVEL: 'info',
		  PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
		  PWD: '/src',
		  SHLVL: '1',
		  HOME: '/root',
		  _: '/usr/local/bin/node' }
	*/
});

app.listen(port,function(){
	console.log("Conectado e escutando na porta "+port);
});