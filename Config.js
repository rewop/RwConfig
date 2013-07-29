/**
 * RwConfig module.
 * Provides functionalities to handle configuration files in json
 *
 * @module RwConfig
 */

/**
 * Module dependencies.
 */
var fs = require('fs')
var Objects = require('RwUtils').Objects;

/**
 * Open a configuration. Different environments are managed. 
 * Shared environment is appended as configuration for each environment
 *
 */
function RwConfig() {

    /**
     * Loaded configuration
     */
    var configurations = {};

    /**
     * Load the configuration from the file
     *
     * @param  {string}     path      the path to load
     * @param  {undefined}  env       should the configuration take care of the environments?
     * @param  {Function}   callback  the callback
     * @return {object}               the configuration object
     */
    this.load = function (path, env, callback) {

        // if there is no callback, throw error
        if (typeof path !== "function" && typeof env !== "function" && typeof callback !== "function") throw new Error("Invalid argument");

        // only the callback given
        else if (typeof path === "function") {

            // set the callback
            callback = path;

            // set the default path and env
            path = env = undefined;
        }

        // the path and the callback given
        else if (typeof path === "string" && typeof env === "function") {

            // set the callback
            callback = env;

            // set the default env
            env = undefined;
        }

        // the env and the callback are given
        else if (typeof path == "boolean" && typeof env === "function") {

            // set the callback
            callback = env;

            // set the env
            env = path;

            // set the default path
            path = undefined;
        }

        // set the default parameters
        path = path || __dirname+"/config.json";
        env = env || false;

        // if a configuration path is already loaded, return it calling the callback
        if (configurations[path]) return callback(undefined, configurations[path]);

        // read configuration file 
        fs.readFile(path, function (err, data) {

            // is there an error?
            if (err) return callback(err);

            // set variables
            var config = JSON.parse(data.toString());
            var environment = process.env.NODE_ENV || config.environment;
            var result;

            // should we take care of the environment?
            if (!env) {

                // save this configuration
                configurations[path] = config;

                // done
                return callback(undefined, config);
            }

            // if no environment set, returns error
            if (!environment)
                return callback(new Error("No configuration environment is set in the configuration file or NODE_ENV."));

            // if no environment keys set in the config file, returns error
            else if (!config[environment])
                return callback(new Error("Environment '" + environment + "' is not defined in the configuration."));

            // merge shared section with environment section of the config file
            result = Objects.merge(config.shared, config[environment]) || {};

            // set up the environment
            result.environment = environment;

            // save this configuration
            configurations[path] = result;

            // done
            return callback(null, result);
        });
    }
};

// exports the module
module.exports = RwConfig

/**
 * Initialize module
 */

/**
 * Environment
 */
module.exports.env = process.env.NODE_ENV || 'dev';

/**
 * Module name.
 */
module.exports.fullname = "RwConfig";

/**
 * Module version.
 */
module.exports.version = '0.0.1';
