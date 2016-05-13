"use strict";
let express 	= 	require("express"),
	app			= 	express(),
	puerto 		= 	process.env.PORT || 8081,
	bodyParser 	= 	require('body-parser'),
	mysql   	= 	require('mysql');

//Realizar la conexión a la base de datos Mysql.....
let conexion = mysql.createConnection({
	host     	: 'localhost',
	user     	: 'root',
	password 	: '',
	database 	: 'encuestas',
	multipleStatements : true,
	port : 3306
});

var fecha = new Date();
var ano = fecha.getFullYear();
var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
var dia = ("0" + fecha.getDate()).slice(-2);
var fechaHoy = ano + "/" + mes + "/" + dia;



conexion.connect();
//Para indicar que se envía y recibe información por medio de Json...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Servicios REST, traer todas las encuestas...
app.get('/polls', (req, res) =>
{

	queryMysql(`select * from encuesta`, (err, pregunta) =>
	{
		if (err) throw err;
		res.json(pregunta);	
	});

	
});

//Crear una encuesta...
app.post('/createPoll', (req, res) =>
{
	crearEncuesta(req.body, (err, data) =>
	{
		res.json(data);
	});
});


app.put('/updatePoll', (req, res) =>
{
	//Saber si existe la encuesta y además que no tenga votos...

	actualizarEncuesta(req.body, (err, data) =>
	{
		res.json(data);
	});


});

app.put('/votePOll', (req, res) =>
{
	votar(req.body, (err, data) =>
	{
		res.json(data);
	});
});

app.delete('/deletePoll/:id', (req, res) =>
{
	eliminaEncuesta(req.param("id"), (err, data) =>
	{
		res.json(data);
	});



});

app.get('/showPoll/:id', (req, res) =>
{
	muestraEncuesta(req.param("id"), (err, data) =>
	{
		res.json(data);
	});
});

//Para cualquier url que no cumpla la condición...
app.get("*", function(req, res)
{
	res.status(404).send("Página no encontrada :( en el momento");
});

//Elimina Encuesta

function eliminaEncuesta (token,callback) 
{

	queryMysql(`DELETE from encuesta where token = '${token}'`, (err, pregunta) =>
	{
		if (err) throw err;
	});
	
}


//Crea una encuesta
function crearEncuesta (data,callback)
{

	//se esta creando una nueva tarea...
	var token = guid();
	queryMysql(`INSERT INTO encuesta (id_encuesta, token,titulo,pregunta,visible,fecha,total_puntua) VALUES 
									('${data.id_encuesta}','${token}','${data.titulo}','${data.pregunta}','${data.visible}','${fechaHoy}','${data.total_puntua}')`, (err, encuesta_creada) =>
	{
		if (err) throw err;
		callback(err, data);
	});
};


//Actualizar Encuesta 

function actualizarEncuesta (data,callback) 
{

	//No se pide el id_encuesta y total_puntua se reinicia a 0
	queryMysql(`UPDATE encuesta SET titulo = '${data.titulo}',
							pregunta='${data.pregunta}',
							visible= '${data.visible}',
							fecha= '${fechaHoy}',
							total_puntua=  '${data.total_puntua}'
							WHERE token ='${data.token}'`, (err, encuesta_actualizada) =>
	{
		if (err) throw err;
		callback(err, data);
	});

		


}

// VOtar por una opcion en X encuestas
var puntaje=0;
function votar (data,callback) 
{
	
	//No estoy seguro del incremente a la variable
	
	queryMysql(`UPDATE opciones SET total = '${puntaje++}'
								WHERE id_encuesta ='${data.id_encuesta}'
								AND id_opciones = '${data.id_opciones}'`, (err, votar) =>
	{
		if (err) throw err;
		callback(err, data);
	});
	

}






//Para mostrar una encuesta dado el ID de la misma...
let muestraEncuesta = (token, callback) =>
{
	let encuesta = [];
	console.log(token);
	queryMysql(`select * from encuesta where token = '${token}'`, (err, pregunta) =>
	{


		if (err) throw err;
		if(pregunta.length !== 0)
		{
			encuesta = pregunta[0];

			//Traer las opciones de respuesta...
			queryMysql(`select * from opciones where id_encuesta = ${pregunta[0].id_encuesta}`, (err, opciones) =>
			{
				if (err) throw err;
				let opcionesRespuesta = [];
				for(let i = 0; i < opciones.length; i++)
				{
					opcionesRespuesta.push(opciones[i]);
				}
				encuesta.opciones = opcionesRespuesta;
				callback(false, encuesta);
			});
		}
		else
		{
			callback(false, encuesta);
		}
	});
};

//Realiza la consulta a la base de datos...
let queryMysql = (sql, callback) =>
{
	conexion.query(sql, (err, rows, fields) =>
	{
		if (err) throw err;
		callback(err, rows);
	

	});
};

//Genera un token único..
let guid = () =>
{
	let s4 = () =>
	{
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

app.listen(puerto);
console.log(`Express server iniciado en el ${puerto}`);
