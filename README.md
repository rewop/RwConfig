RwConfig
========

Handle different environment configurations of your apps

How to install in your module
-----------------------------
This repository is not publish in npm.     
Therefore to install it through npm you can do the follwing:
```
npm install git://github.com/rewop/RwConfig.git
```

If you want to insert this module in the dependencies of your repository, just add the following line in the dependencies of your package.json
```
RwUtils: git://github.com/rewop/RwConfig.git
```

Feel free to fork and contributing in the development of this package.


Create different configurations for different environments
----------------------------------------------------------
RwConfig module lets you create as many JSON configuration environments as you want. 
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
You can switch to different configuration by just restarting your application with a different environment.
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

Create shared or default configurations for different environments
------------------------------------------------------------------
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

How does RwConfig overrides the configuration attributes?
---------------------------------------------------------
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


