# Waker
Waker (**W**eb service m**aker**) is a tool to create RESTful API servers. Waker is using (Hapi.js, Couchbase, Elastisearch, Redis) stack. 

## Install
`npm install waker`

## Initiate new web service
In your project's root directory run:
`./node_modules/.bin/waker init`

This will ask you some questions about basic configurations and then creates a pure project structure.

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
│   ├── server.js
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
 
### Enable pre-defined Hapi.js modules and server methods
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

## Add your Hapi.js modules
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
