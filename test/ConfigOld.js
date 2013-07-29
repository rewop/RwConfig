// the dependency
var Config = require("../Config.js");
var fs = require("fs");
var config;

exports.Config = {
    setUp : function (callback) {
        
        config = {
            shared : {
                config1 : "shared",
                config2 : "shared",
                config3 : "shared",
                config4 : "shared"
            },
            development : {
                config2 : "dev",
                config3 : "dev"
            },
            production : {
                config3 : "prod",
                config4 : "prod"
            }
        };

        // create the config file for testing
        fs.writeFile("test/config.json", JSON.stringify(config), function (err) {
            
            // is there an error?
            if (err) callback(err);

            // add production environment
            config.environment = "production";

            fs.writeFile("test/config_prod.json", JSON.stringify(config), function(err){

                 //done
                callback(err);
            });
        });
    },
    tearDown : function (callback) {

        // remove the NODE_ENV variable
        delete process.env["NODE_ENV"];

        callback();
    },
    "Return error when the file does not exist" : function (test) {

        // the config object
        var conf = new Config("foo.bar");

        // load the config
        conf.load(function (err) {

            test.ok (err instanceof Error);

            test.done();
        });
    },
    "Return error when the environment does not exist" : function (test) {

        // the config object
        config = new Config();

        // load the configuration
        config.load(function (err, config) {

            test.ok (err instanceof Error);

            test.done();
        });
    },
    "Load configuration from process env variable" : function (test) {

        // set process env variable
        process.env['NODE_ENV'] = "development";

        // the config object
        var conf = new Config("test/config.json");

        // make test
        conf.load(function(err, config){

            //no error
            test.ifError(err);
            test.equal(config.config1, "shared");
            test.equal(config.config2, "dev");
            test.equal(config.config3, "dev");
            test.equal(config.config4, "shared");
            test.equal(config.environment, "development");
            test.equal(Object.keys(config).length, 5);
            // done
            test.done();
        });
    },
    "Load configuration from environment attributes in config file" : function (test) {

        // the config object
        var conf = new Config("test/config_prod.json");

        // make test
        conf.load(function(err, config){

            //no error
            test.ifError(err);
            test.equal(config.config1, "shared");
            test.equal(config.config2, "shared");
            test.equal(config.config3, "prod");
            test.equal(config.config4, "prod");
            test.equal(config.environment, "production");
            test.equal(Object.keys(config).length, 5);

            // done
            test.done();
        });
    }
}