const IBMCloudEnv = require('ibm-cloud-env');
IBMCloudEnv.init('/server/config/mappings.json');

const fs = require('fs');
// Вычитывание конфигурации и подключение к БД
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

const dburl= IBMCloudEnv.getString('cloudant_url');
const dbapikey= IBMCloudEnv.getString('cloudant_apikey');
const dbname=IBMCloudEnv.getString('dbname');

const authenticator = new IamAuthenticator({
    apikey: dbapikey
});

const service = new CloudantV1({
    authenticator: authenticator
});

service.setServiceUrl(dburl);



function getMembershipInformation(){ 
    service.getMembershipInformation().then(response => {
        console.log(response.result);
    });
};

/**
 * 
 * @param {object} a_param { count: 10}
 * @return {object} 
 *{
 * uuids: [
 *   '7669429b57f494dec70c8bd137a26f49',
 *   '7669429b57f494dec70c8bd137a27d56',
 *   '7669429b57f494dec70c8bd137a28b83',
 *   '7669429b57f494dec70c8bd137a2942c',
 *   '7669429b57f494dec70c8bd137a2a09c',
 *   '7669429b57f494dec70c8bd137a2a390',
 *   '7669429b57f494dec70c8bd137a2af4c',
 *   '7669429b57f494dec70c8bd137a2bb39',
 *   '7669429b57f494dec70c8bd137a2c1fb',
 *   '7669429b57f494dec70c8bd137a2d11e'
 * ]
 *}
 */
function nextid( a_param ){
    return service.getUuids( a_param )
    .then( res => {
        return Promise.resolve(res.result);
    })
    .catch (err => {
        return Promise.reject(err);
    });
};

/**
 * Создание документа в БД
 */
function docCreate( a_doc ){

    // формирую запрос для вызова API
    var l_dbodoc= {
            db: dbname,
            document: a_doc
    };

    return service.postDocument( l_dbodoc )
    .then( res => {
        return Promise.resolve(res.result);
    })
    .catch (err => {
        return Promise.reject(err);
    });
}

/**
 * Прочитать документ по id
 * @param {Object} a_doc = {dicID: 'r12t34ty4'}
 */
function docGetById( a_doc ){

    // формирую запрос для вызова API
    var l_dbodoc= {
            db: dbname,
            docId: a_doc.docId
    };

    return service.getDocument( l_dbodoc )
    .then( res => {
        return Promise.resolve(res.result);
    })
    .catch (err => {
        return Promise.reject(err);
    });
}

/**
 * 
 * @param {object} a_docref = {docId: "12qwe345", rev: "333444edcvfr"} 
 */
function docDelete( a_docref ){
    // формирую запрос для вызова API
    var l_dbodoc= {
            db: dbname,
            docId: a_docref.docId,
            rev:   a_docref.rev
    };

    return service.deleteDocument( l_dbodoc )
    .then( res => {
        return Promise.resolve(res.result);
    })
    .catch (err => {
        return Promise.reject(err);
    });
}

/**
 * Загрузка файла  в БД
 */
function fileUpload( a_doc ){

    // формирую запрос для вызова API
    var l_dbodoc= {
            db: dbname,
            document: a_doc
    };

    return service.postDocument( l_dbodoc )
    .then( res => {
        return Promise.resolve(res.result);
    })
    .catch (err => {
        return Promise.reject(err);
    });
}

function docSelect( a_selector ){

    // формирую запрос для вызова API
    var l_dbodoc= {
            db: dbname,
            selector: a_selector.selector
    };

    return service.postFind( l_dbodoc )
    .then( res => {
        return Promise.resolve(res.result);
    })
    .catch (err => {
        return Promise.reject(err);
    });
}

/**
 * Проверяет наличие  БД и если нет, то ее создает
 * 
 */
function dbStart(){
    var l_rq = {db: dbname};
    return service.putDatabase(l_rq)
    .then( dbinfo => {
       console.log('db info: ' +  JSON.stringify( dbinfo ));
       if( dbinfo.result.ok ) {  
            console.log('Database ' + dbname + ' created');
            return Promise.resolve({ok: true});
       }
       
    })
    .catch( err =>{
       console.log('error get db info: ' + err.message);
       if (err.code === 412) {
            return Promise.resolve( {ok: true});
       } else {
            return Promise.reject(err);
       };     
    });
 
}

/**
 * Начальная загрузка документов в БД
 */
function dbBulkUpload(){
   
    var l_stream = require( "./data/exch.json" );
    var l_rq = {db: dbname, bulkDocs: l_stream};
    service.postBulkDocs(l_rq)
    .then( res => {
        console.log('upload result: ' + JSON.stringify(res) );
        return Promise.resolve( {ok: true});
    })
    .catch( err => {
        return Promise.reject(err);
    })


}


module.exports.nextid = nextid;
module.exports.docCreate = docCreate;
module.exports.docGetById = docGetById;
module.exports.docDelete = docDelete;
module.exports.fileUpload = fileUpload;
module.exports.docSelect = docSelect;
module.exports.dbStart = dbStart ;
module.exports.dbBulkUpload =  dbBulkUpload;