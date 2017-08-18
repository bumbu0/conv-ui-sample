const Cloudant = require('cloudant');
const async = require('async');

function CloudandStorage(options) {
    const self = this;
    const cloudant = Cloudant({
        url: options.cloudantUrl,
        plugin: 'retry',
        retryAttempts: 10,
        retryTimeout: 500
    }).db;
    let cloudantDb;

    if (!options.initializeDatabase) {
        cloudantDb = cloudant.use(options.cloudantDbName);
    } else {
        const prepareDbTasks = [];
    
        // create the db
        prepareDbTasks.push(
            (callback) => {
                console.log('Creating database...');
                cloudant.create(options.cloudantDbName, (err) => {
                    if (err && err.statusCode === 412) {
                        console.log('Database already exists');
                        callback(null);
                    } else if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
        });

        // use it
        prepareDbTasks.push(
            (callback) => {
                console.log('Setting current database to', options.cloudantDbName);
                cloudantDb = cloudant.use(options.cloudantDbName);
                callback(null);
        });

        // create design documents
        const designDocuments = require('./cloudant-designs.json');
        designDocuments.docs.forEach((doc) => {
            prepareDbTasks.push((callback) => {
                console.log('Creating', doc._id);
                cloudantDb.insert(doc, (err) => {
                    if (err && err.statusCode === 409) {
                        console.log('Design', doc._id, 'already exists');
                        callback(null);
                    } else if (err) {
                        callback(err);
                    } else {
                    callback(null);
                    }
                });
            });
        });

        async.waterfall(prepareDbTasks, (err) => {
            if (err) {
                console.log('Error in database preparation', err);
            } else {
                console.log('Database is ready.');
            }
        });
    }

    // add a new document
    self.insert = function(doc, insertCallback/* err, doc*/) {
        cloudantDb.insert(doc, (err, body) => {
            insertCallback(err, body);
        });
    };

    // get a document
    self.get = function(docId, callback/* err, media*/) {
        cloudantDb.get(docId, {
            include_docs: true
        }, callback);
    };

}

module.exports = function(options) {
  return new CloudandStorage(options);
};


