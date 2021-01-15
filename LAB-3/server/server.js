// import dependencies and initialize express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const localConfig = require('./config/local.json');

const healthRoutes = require('./routes/health-route');
const swaggerRoutes = require('./routes/swagger-route');
const exchrateRoutes = require('./routes/exch-route');


const ui_uploadRoutes = require('./routes/ui_uploadform-route.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes and api calls
app.use('/health', healthRoutes);
app.use('/swagger', swaggerRoutes);
app.use('/exchrate', exchrateRoutes);
//route ui 
app.use('/uploadf', ui_uploadRoutes);


// default path to serve up index.html (single page application)
app.all('', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'));
});

const dbsrvc = require('./controllers/cloudant-srvc.js');
const { callbackify } = require('util');
// проверяем и создаем БД
var dbcrt = function( cb  ){
          //return new Promise( function(resolve, reject) {
          
          dbsrvc.dbStart()
          .then(result=>{
              console.log(' Cloudant: ' + JSON.stringify( result) );
              return dbsrvc. dbBulkUpload();
          })
          .then( res => {
              console.log('Cloudant Bulk update:' + JSON.stringify( res ) );
              //return Promeis.resolve( {ok: true});
              //return {ok: true};
              cb( null, {ok: true} );
          }) 
          .catch( err => {
              console.log('Cloudant Bulk update ERROR:' + JSON.stringify(err));
              //return Promise.reject(err);
              //throw new Error(err.message);
              cb(err, null);
          });
        
       
};



dbcrt(  function( err, res){
     if (err) {
        console.error(error.message); 
        process.exit(1);
    
     } else {
       //
       console.log(  JSON.stringify(res) )
     }

});

// start node server
const port = process.env.PORT || localConfig.port;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
  console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

module.exports = app;
