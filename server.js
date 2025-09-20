const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const errorHandler = require('./middleware/errorHandler');
const app = express();

const port = process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');

app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use('/', require('./routes'))
    .use(errorHandler); // Middleware para manejo de errores



mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {
            console.log(`Todo en orden en el port ${port}`)
        });
    }
});