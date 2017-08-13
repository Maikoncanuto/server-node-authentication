const express     = require('express');
const bodyParser  = require('body-parser');
const server      = express();
const router      = express.Router();

//Config
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());
server.use('/api', router);

const port = process.env.PORT || 8080;

//Routes
router.get('/', (req, res) => {
    res.json({message: 'Deu certo'});
});


//Start server
server.listen(port, () => {
    console.log("Running server...");
});