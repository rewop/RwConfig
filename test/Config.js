/**
 * Script to test Config.json
 */

/*jshint expr:true */
/*global describe:false, it:false, beforeEach:false*/

var expect = require("chai").expect;
var fs = require("fs");
var Config = require("../Config.js");

describe("Config checks", function () {

    // before all test
    before(function(done) {

        var config = {
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
                done();
            });
        });
    });

    //after all test remove created files
    after(function() {

        // remove the created files
        fs.unlinkSync("test/config_prod.json");
        fs.unlinkSync("test/config.json");
    });

    // after each test remove env variable
    afterEach(function () {

        // remove the NODE_ENV variable
        delete process.env["NODE_ENV"];
    });

    describe("#load()", function () {

        it("Should throw error when the callback is not given", function () {

            // the configuration
            var conf = new Config();

            // test load without argument
            var testFunction = function () {
                conf.load();
            };

            // without callback should throw an error
            expect(testFunction).to.throw(/Invalid argument/);

            // test function with arguments no callback
            testFunction = function () {
                conf.load("test");
            }

            // without callback should throw an error
            expect(testFunction).to.throw(/Invalid argument/);
        });

        it("Should not throw error when the callback is given", function () {

            // the configuration
            var conf = new Config();

            // test load with only callback
            var testFunction =  function () {
                conf.load(function(err) {});
            }

            // there should not be an error
            expect(testFunction).to.not.throw(Error);

            // test load function with path and callback
            testFunction = function () {
                conf.load("conf.json", function(err){});
            }

            // there should not be an error
            expect(testFunction).to.not.throw(Error);

            // test load function with env and callback
            testFunction = function () {
                conf.load(true, function(err){});
            }

            // there should not be an error
            expect(testFunction).to.not.throw(Error);

            // test load function with path env and callback
            testFunction = function () {
                conf.load("conf.json", true, function(err){});
            }

            // there should not be an error
            expect(testFunction).to.not.throw(Error);
        });

        it("Should return error when the file does not exist", function (done) {

            // the configuration
            var confFactory = new Config();

            // load the configuration
            confFactory.load("foo.bar", function (err, conf) {

                // the error should be given
                expect(err).to.exist;

                // should be instance of error
                expect(err).to.be.an.instanceOf(Error);

                // done
                done();
            });
        });

        it("Should load the configuration without merging environments", function (done) {

            // the configuration factory
            var confFactory =  new Config();

            // load the configuration
            confFactory.load(__dirname+"/config.json", false, function(err, conf) {

                // no error should be given
                expect(err).to.not.exist;

                // configuratipon should be given
                expect(conf).to.exist;

                // configuration should have the shared field
                // this means the envs where not merged
                expect(conf).to.have.property("shared");
                expect(conf).to.have.property("development");
                expect(conf).to.have.property("production");

                // done
                done();
            });
        });

        it("Should return error when the environment does not exist", function (done) {

            // the config factory
            var confFactory = new Config();

            // load the configuration
            confFactory.load(function(err, conf) {

                // an error should have been given
                expect(err).to.exist;

                // should be an error
                expect(err).to.be.an.instanceOf(Error);

                // done
                done();
            });
        });

        it("Should load the configuration from process env variable", function (done) {

            // set process env variable
            process.env['NODE_ENV'] = "development";

            // the config object
            var conf = new Config();

            // make test
            conf.load(__dirname+"/config.json", true, function(err, config) {

                // no error should be returned
                expect(err).to.not.exist;

                // the configuration should be given
                expect(config).to.exist;

                expect(config).to.have.property("config1", "shared");
                expect(config).to.have.property("config2", "dev");
                expect(config).to.have.property("config3", "dev");
                expect(config).to.have.property("config4", "shared");
                expect(config).to.have.property("environment", "development");

                // done
                done();
            });
        });

        it("Should load the configuration from environment attributes in config file", function (done) {

            // the config object
            var conf = new Config();

            // make test
            conf.load(__dirname+"/config_prod.json", true, function(err, config){

                // no error should be returned
                expect(err).to.not.exist;

                // the configuration should be given
                expect(config).to.exist;

                expect(config).to.have.property("config1", "shared");
                expect(config).to.have.property("config2", "shared");
                expect(config).to.have.property("config3", "prod");
                expect(config).to.have.property("config4", "prod");
                expect(config).to.have.property("environment", "production");

                // done
                done();
            });
        });
    });
});