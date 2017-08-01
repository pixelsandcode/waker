# <%= app %> API

## Setting up for first time
Make sure you have git, nvm, node, elasticsearch, couchbase, waker-cli installed

## Get the project and install npms 

- Clone the project `git clone <%= repository %>`
- Create bucket in couchbase and index in elasticsearch named *<%= app %>*
- In project's root do `curl -XPUT http://localhost:9200/_template/<%= app %>?pretty=true -d @setup/app.template.json`
- Make sure you have copied the elasticsearch configurations of XDCR from `setup/elasticsearch.yml` in to your `elasticsearch.yml` file of elasticsearch
- Create XDCR between couchbase and elasticsearch
- in `core` do following steps:
    - `npm run install-modules`
    - `npm run install-configs`

## Run the application
- Run following command:
	- `waker run`
- To run server in environments other than development environment, pass `-e <environment>` flag to run command. For example to run servers in `functionaltest` environment:
	- `waker run -e functionaltest`
- To run server in background mode, make sure to have pm2 npm installed globally and then run:
    - `waker run -b`
