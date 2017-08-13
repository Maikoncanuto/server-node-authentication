const express     = require('express');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const jwt         = require('jsonwebtoken');
const bcrypt      = require('bcrypt-nodejs');
const mpromise    = require('mpromise');
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
    res.json({
        message: 'Rota padrão - API'
    });
});

server.use('/api', router);

router.post('/auth', (req, res) => {
    Usuario.findOne({
        nome: req.body.nome
    }, (error, user) => {
        if(error){
            res.json({
                success: false,
                error: error
            });

            throw error;
        }

        if(!user){
            res.json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        if(!bcrypt.compareSync(req.body.senha, user.senha)){
            res.json({
                success: false,
                message: 'Senha inválida'
            });
        }

        let token = jwt.sign(user, server.get('superNode-auth'), {
            expiresIn: 1440
        });

        res.json({
            success: true,
            message: 'Usuário validado com sucesso',
            token: token
        });

    });
});


router.get('/create', (req, res) => {
    let usuario = new Usuario({
        nome: 'maikoncanuto',
        senha: bcrypt.hashSync('123'),
        admin: true
    });

    usuario.save()
    .then((data) => {
        res.json({
            success: true,
            data: data
        });
    }).catch((error) => {
        res.json({
            error: error
        });
    });
});

router.get('/users', (req, res) => {
    Usuario.find({}, (error, users) => {
        res.json(users);
    });
});


/** 
* Iniciando servidor
*/
server.listen(port, () => {
    console.log('Running in '+ port + '...');
});
