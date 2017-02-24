# Waker
Waker (**W**eb service m**aker**) is a tool to create RESTful API servers. Waker is using (Hapi.js, Couchbase, Elastisearch, Redis) stack.

## Requirements
To use Waker, Couchbase, Elasticsearch and Redis services should be installed and configured properly. 
XDCR replication between Couchbase buckets and Elasticsearch indexes should be created.

## Install
Go to your project's root directory and install Waker:
`npm install waker`

## Initiate new web service
In your project's root directory run:
`./node_modules/.bin/waker init`

This will ask you some questions about project info and Couchbase, Elasticsearch and Redis services and then creates a pure project structure.

## Project structure
```
project_root
├── core
│   ├── configs
│   │   ├── configs.yml.original
│   │   ├── defaults.yml
│   │   ├── methods.js
│   │   ├── modules.js
│   │   ├── modules.yml
│   │   ├── plugins.js
│   │   └── waker.yml.original
│   ├── tasks
│   │   ├── module_template
│   │   │   ├── src
│   │   │   │   ├── environments
│   │   │   │   ├── handlers
│   │   │   │   ├── models
│   │   │   │   ├── validators
│   │   │   │   ├── .npmignore
│   │   │   │   ├── defaults.yml
│   │   │   │   ├── main.js
│   │   │   │   ├── methods.js
│   │   │   │   └── routes.js
│   │   │   ├── .groc.json
│   │   │   ├── init.js
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   ├── create_module.js
│   │   ├── deploy.js
│   │   ├── deploy.yml
│   │   └── link.js
│   ├── gulpfile.js
│   ├── nodemone.json
│   ├── package.json
│   └── server.js
├── modules
│   ├── module_one
│   ├── module_two
│   └── ...
└── .gitignore
```

## Configure your service
There are two main configuration files which should be configured properly before running server. Follow this steps:

- Copy `core/configs/configs.yml.original` to `core/configs/configs.yml`
- Copy `core/configs/waker.yml.original` to `core/configs/waker.yml`

Now you can edit the new files to configure your server.

### Add new database configuration
Databases should be added to `defaults.databases` on `core/configs/config.yml`. For example:
```yaml
default:
  databases:
    analytics:
      host: 192.169.23.21
      name: analytics
      mock: false
```

### Add new search engine configuration
Elasticsearch search engines should be added to `defaults.searchengine` on `core/configs/config.yml`. For example:
```yaml
default:
  searchengine:
    analytics:
      host: 192.169.23.21
      port: 9200
      name: analytics
      log: debug
```

### Add configuration to environments
There are 5 environments which are added to `core/configs/config.yml` by default.
You can define your own environments or use these environments. Any configuration which is added to an environment, will override configuration on `default` part.
For example if you want to set `mock: true` for application database in `unittest` environment:
```yaml
unittest:
  databases:
    application:
      mock: true
```
 
### Enable pre-defined Hapi.js plugins and server methods
There are some Hapi.js modules which are integrated to waker. 
You can enable them by setting `enable: true` for each module on `core/configs/waker.yml`. 
If any module is enabled, its other configurations also should be set. 
For example if you want to enable `icecreambar` plugin to connect your service to your rollbar account, 
and your api key is `12345678`, you should set this configuration:
```yaml
default:
  plugins:
    icecreambar:
      enabled: true
      api_key: 12345678
```
Same rule goes for methods. For example:
```yaml
default:
  methods:
    model:
      enabled: true
```
To set configurations correctly refer to plugins' official documentations and to check plugin version, run `node_modules/.bin/waker plugins` in your project root.

## Running server
To run server in development environment, go to `core` directory and run:
`NODE_ENV=development gulp api:run`
and by node itself, run:
`NODE_ENV=development node ./server.js`

## Add your Hapi.js plugins
`core/configs/plugins.js` is holding an array of Hapi.js plugins registration objects. 
Any plugin which is needed on your project, can be added to the file.
For example to add plugin `hapi-x-plugin`, edit `core/configs/plugins.js` like:
```javascript
module.exports = [
  {
    register: require('hapi-x-plugin'),
    options: {
      //any options which are accepted by hapi-x-plugin
    }
  }
]
```

## Add server methods
If there are methods which are related to core module, they can be added to `core/configs/methods.js`.
For example to add method `core.say_hello`, edit `core/configs/methods.js` like:
```javascript
module.exports = (server) => {
  server.method('core.say_hello', () => {
    return "Hello!"
  })
}
```

## Add new module
To create new modules in project, follow the steps:
- Go to `core` directory
- Run `gulp api:module:create -n <your module name>`

For example if you want to create a module with name `users`, you should run:
- `gulp api:module:create -n users`

## Link modules to core module
Linking modules is done automatically. Also you can link modules to core module manually by running the following command:
- `gulp api:link`

To link a specific module, run:
- `gulp api:link -n <module name>`

To run in sudo mode, run with `-s` flag:
- `gulp api:link -s -n <module name`

## Deploy your server
To deploy your project to test, staging or production server, follow these steps:
- Add your deploy script to `core/tasks/deploy.js`
- Add any required configuration by deploy script to `core/tasks/deploy.yml`
- Run `gulp api:deploy -stage <stage>`

For example, to deploy on production, run:
- `gulp api:deploy -stage production`

## How to implement your service
Assume that you want to implement an API to register users in your system. To implement your API, you should create a module first.
Lets call the module `users`. So we should go to project's core directory and run:
- `gulp api:module:create -n users`

Running this command will create a new module named `users` in your project structure. Your project structure will be sth like:
```
project_root
├── core
└── modules
    └── users
        ├── src
        │   ├── environments
        │   ├── handlers
        │   ├── models
        │   ├── validators
        │   ├── .npmignore
        │   ├── defaults.yml
        │   ├── main.js
        │   ├── methods.js
        │   └── routes.js
        ├── .groc.json
        ├── init.js
        ├── package.json
        └── README.md
```

All your code should be written in `users/src` directory. Lets describe files and sub-directories of `users/src`.

### src/environments
```
environments
├── development.js
└── main.js
```

Environments directory comes with two default `.js` files. 
`users/environments/main.js` is used by `users/main.js` to load environment specific implementation to server.
`users/environments/development.js` should be used to implement `development` environment specific features. 
If you want to implement some features only in e.g. staging environment, 
you should create `users/environments/staging.js` file and have same signature as `users/environments/development.js` has.
Then when you run server with `NODE_ENV=staging gulp api:run` command, your implementation in `staging.js` file will be loaded to server.

### src/handlers
```
handlers
└── main.js
```

Handlers directory comes with default `main.js` file. 
Files inside the directory are implementing handler functions of Hapi.js routes.
`users/handlers/main.js` defines signature of handler files. You can define as many as needed handler files. 
The handler files and implemented functions inside them, will be used in `users/routes.js` file and will be assigned to `users` module's routes.
Read content of `users/handlers/main.js` and `users/routes.js` files to see how it is implemented and used by routes.

### src/models
```
models
└── main.js
```

Handlers directory comes with default `main.js` file. 
Files inside the directory are implementing model classes which are used to manage data.
`users/models/main.js` defines signature of model files. You can define as many as needed model files.
The model files and implemented classes inside them, will be used by handlers to set/get data from/to databases.
Read content of `users/models/main.js` and `users/handlers/main.js` files to see how they are implemented and connected to each other.

### src/validators
```
validators
└── mainValidator.js
```

Validators directory comes with default `mainValidator.js` file.
Files inside the directory are implementing an object which will be used to validate Hapi.js routes' data.
`users/validators/mainValidator.js` defines signature of validator files. You can define as many as needed validator files.
Read content of `users/validators/mainValidator.js` and `users/routes.js` files to see how the validator is implemented and used by routes.

### src/defaults.yml
Module related default values, should be defined inside `src/defaults.yml` file. 
Default values will be available in handlers, models, validators, routes and environments files by `options` parameter which is passing to all files.
For example in `users` module you want to define default value `login.tries = 3` to control login attempts and block robots.
You should put the default value inside `src/defaults.yml` like:
```yaml
defaults:
  login:
    tries: 3
```

### src/methods.js
Module related Hapi.js server methods, should be defined inside `src/methods.js` file.
For example if you want to add server method `users.list`, edit `src/methods.js` like:
```javascript
module.exports = (server, options) => {

  server.method('users.list', () => {
    //Do Something Cool which can be used by other modules
  })

}
```

Define as many as needed server methods inside `src/methods.js`.

### src/routes.js
Module's routes should be defined inside `src/routes.js`. 
The file comes with a default route, implemented inside, to help you know how module's routes should be implemented.
As we talked before, handler and validator files is used by routes. So the files are linked to `src/routes.js` file.
The following snippet is an example of implementing new route `POST /v1/users/login`:
```javascript
module.exports = (server, options) => {

  const Users = require('./handlers/main')(server, options)
  const UsersValidator = require('./validators/mainValidator')(options)

  return [
    {
      method: 'POST',
      path: '/v1/users/login',
      config: {
        handler: Users.login,
        validate: UsersValidator.login,
        description: 'Login user',
        tags: ['users', 'login']
      }
    }
  ]
}
```

`Users.login` handler and `UserValidator.login` validator should be implemented to make the new route to work.
