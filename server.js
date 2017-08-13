const express     = require('express');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const jwt         = require('jsonwebtoken');
const morgan      = require('morgan');
const server      = express();
const router      = express.Router();
const config      = require('./config');
const Usuario     = require('./src/models/Usuario');

/** 
* Configurando porta
*/
const port = process.env.PORT || 8080;

/** 
* Conectando ao mongodb. 
* - OBS: não esquecer de subir o servidor do mongod
*/
mongoose.connect(config.database, {
    useMongoClient: true
});

server.set('superNode-auth', config.configName);

/**
 * Usando body-parser para obter informações da requisição post
 */
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

/**
 * Registra as requisições no console.
 */
server.use(morgan('dev'));

/**
 * Rotas
 */
server.get('/', (req, res) => {
    res.send('Rota padrão');
});

server.get('/create', (req, res) => {
    let usuario = new Usuario({
        nome: 'Maikon Canuto',
        senha: 'senha123',
        admin: true
    });

    usuario.save()
    .then((doc) => {
        console.log('Usuário Salvo com sucesso', doc);

        res.json({
            success: true
        });
    }).catch((error) => {
        if(error){
            console.log("ERROR AO SALVAR USUÁRIO");
            throw error;
        }
    });
});


/** 
* Iniciando servidor
*/
server.listen(port, () => {
    console.log('Running...');
});
