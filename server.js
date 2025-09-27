const express = require('express');
const cors = require('cors'); 
require('dotenv').config();
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler'); // Importado
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const app = express();

const port = process.env.PORT || 3000;

app
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false // Cambiar a true si usas HTTPS en producción
        }
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        // Middleware para configurar encabezados CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
        );
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next(); 
    })
    .use("/", require("./routes/index"));
    
    // Configuración de Passport GitHub Strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    // Rutas de autenticación
    app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged out'); });
    
    app.get('/github/callback', 
        passport.authenticate('github', { failureRedirect: '/api-docs' }),
        (req, res) => {
            req.session.user = req.user;
            res.redirect('/');
        });

    app.use(errorHandler);


mongodb.initDb((err) => {
    console.log('Conectado a la base de datos'); 
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {
            console.log(`Todo en orden en el puerto ${port}`)
        });
    }
});
