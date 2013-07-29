RwConfig
========

Handle simple and complicated configurations for your applications.

How to install in your module
-----------------------------
This repository is not publish in npm.     
Therefore to install it through npm you can do the follwing:
```
npm install git://github.com/rewop/RwConfig.git
```

If you want to insert this module in the dependencies of your repository, just add the following line in the dependencies of your package.json
```
RwConfig: git://github.com/rewop/RwConfig.git
```

Feel free to fork and contributing in the development of this package.

Create simple configuration file
----------------------------------------------------------
With RwConfig you can initialize an object with the json configuration.
```
Config = require('RwConfig');

// get the factory
var factory = new Config();

// get the config object
mySimpleConfig = factory.load(__dirname+'/conf.json', function (err, conf) {

    // use here the configuration
})
```

While the callback argument is mandatory the path argument is not.  In case the path is not given,
the file `config.json` will be used. If given, the path should be absolute. In our case we prepened the value of the
global variable `__dirname` to the file name.

```
Config = require('RwConfig');

// get the configuration using the default path
mySimpleConfig = Config.load(function(err, conf) {

    // here the configuration in ./conf.json is loaded.
})
```

Errors are returned to the callback if it was impossible to find the configuration files. If the callback is not
given, an error is thrown.

Create different configurations for different environments
----------------------------------------------------------
RwConfig module can be used to load different configuration environments. You can create as many JSON configuration
environments as you want. For example:
```
{
    development: {
        // my development config
    }
    test: {
        // my test config
    }
    production: {
        // my production config
    }
}
```
In the previous snippets there are three configuration environments: `development`, `test` and `production`.

To create the configuration with different environments, you need to use the function `load()` passing a true boolean argument before the callback:
```
var Config = require('RwConfig');

// get the factory
var factory = new Config();

// get the configuration using the default path
myConfig = factory.load(true, function(err, conf) {

    // here the configuration in ./conf.json is loaded.
    // the first boolean argument says the module that the environments should be handled.
})
```
### Create shared or default configurations for different environments
In the configuration you can define a special environment called `shared`. The configuration in this section will be inserted for every environment, unless the attributes are overridden in specific environment.

```
{
    shared : {
        myconf : 'shared',
        anotherconf : 'shared'
    },
    development : {
        myconf : 'dev',
        devconf: 'dev'
    },
    production : {
        myconf : 'prod'
    }
}
```

In the above example if you load your configuration in production environment the configuration will be the follwing:
```
{
    myconf: 'prod',
    anotherconf : 'shared'
}
```
While in development environment is the following:
```
{
    myconf: 'dev',
    devconf: 'dev',
    anotherconf : 'shared'
}
```
This makes easy to set default values for your configuration, and override only the ones that differ for different environments.

### Loading the configuration for a specified environment

The envLoad can be used as the `load()` function.

The environment can be selected by setting up the `NODE_ENV` environmental variable.
The variable can be set when starting the application:
```
$ NODE_ENV=development node myapp.js
```

while another way is to set the `NODE_ENV` programmatically:
```
Config = require('RwConfig');

// set the NODE_ENV environment variable
process.env['NODE_ENV'] = "development";

// get the configuration using the default path
myConfig = Config.envLoad(function(err, conf) {

    // here the configuration in ./conf.json is loaded.
})
```

You can switch to different configurations by just restarting your application with a different environment,
or giving a new value to the `NODE_ENV` variable, and reloading the configuration.
```
// get the development configuration
Config = require('RwConfig');

// create the config object
myConfig = new Config('./conf.json');

// load the configuration
myConfig.load(function(err, config) {
    
    // throw in case of error
    if (err) throw new Error(err);

    // here i can use my config
});
```

Now you can start your app by setting the NODE_ENV variable
```
$ NODE_ENV=development node myapp.js
```

You can also select an environment by setting the property `environment` in your configuration. In this way only the configuration for that environment can be load.   



### How does RwConfig overrides the configuration attributes?

RwConfig is not able (yet) to handle deep overridden configuration. Therefore if you have an object defined at the first level of the configuration with the same name for both shared and development environments, the object in the shared configuration will be completely overridden. 
```
{
    shared : {
        myconf : {
            shared : 'shared'
        },
    },
    development : {
        myconf : {
            dev: 'dev',
        }
    }
}
```
The above configuration definition in development environment will result in the following configuration:
{
    myconf : {
        dev: 'dev'
    }
}
Therefore to include the shared attribute for myconf object, you have to redefine it also in development.


