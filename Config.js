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
var utils = require("util");

/**
 * Loaded configuration
 */
var configurations = {};

/**
 * Open a configuration. Different environments are managed. 
 * Shared environment is appended as configuration for each environment
 * 
 * @param {string}  path (Optional) The path to the config file. Default "[process path]/config.json"
 * @param {boolean} info (Optional) Print information. Default false
 * @param {Function} callback A callback called when config is loaded.
 * @error Returns errors returned by the fs module
 * @error Returns error if the environment is not set
 * @error Returns error if the envoronment is not present as key in the config file
 */

function RwConfig(path, info) {

    // is the path a boolean?
    if (typeof path === 'boolean') {

        // then we do not have the path.
        info = path;

        // path default
        path = undefined;
    }

    // set default values
    path = path || process.cwd() + "/config.json";
    info = info || false;

    /**
     * Load the configuration from the file
     * 
     * @param  {Function} callback [description]
     * @return {object}            the configuration object
     */
    this.load = function (callback) {

        // if a configuration path is already loaded, return it calling the callback
        if (configurations[path]) return callback(null, configurations[path]); 

        // read configuration file 
        fs.readFile(path, function (err, data) {

            // is there an error?
            if (err) return callback(err);
            
            // set variables
            var config = JSON.parse(data.toString());
            var environment = process.env.NODE_ENV || config.environment;
            var result;

            // if no environment set, returns error
            if (!environment)
                return callback(new Error("No configuration environment is set in the configuration file or NODE_ENV."));

            // if no environment keys set in the config file, returns error
            else if (!config[environment])
                return callback(new Error("Environment '" + environment + "' is not defined in the configuration."));

            // prints info information if requested
            if (info)
                console.log("Configuration:", "Selecting environment setting '" +
                    environment + "' as configured in '" +
                    (process.env.NODE_ENV ? "NODE_ENV" : "Configuration file") + "'");

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
