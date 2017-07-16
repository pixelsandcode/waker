let kue     = require('kue')
let Promise = require('bluebird')

module.exports = (server, config) => {

  let queue = kue.createQueue({
    prefix: config.helpers.jons.kue_prefix,
    redis: {
      port: config.main.cache.port,
      host: config.main.cache.host
    }
  })

  server.method('job.remove', (job_id) => {
    if(job_id === null || job_id === undefined) return Promise.resolve(true)
    return new Promise( (resolve, reject) => {
      kue.Job.get(job_id, (error, job) => {
        if(error) resolve(null)
        else
          job.remove( (error) => {
            if(error) resolve(null)
            else resolve(job)
          })
      })
    })
  })

  server.method('job.once', (name, data, time, uname, job_id) => {
    server.methods.job.remove(job_id)
      .then( () => {
        return new Promise( (resolve, reject) => {
          queue.create(name, data).priority('normal').delay(time).save( (error, job) => {
            if(error) reject( new Error(error) )
            else resolve(job)
          })
        })
      })
  })

  server.method('job.queue', (name, data, priority='normal') => {
    return new Promise( (resolve, reject) => {
      queue.create(name, data).priority(priority).save( (error, job) => {
        if(error) reject( new Error(error) )
        else resolve(job)
      })
    })
  })

  server.method('job.process', (name, instances, fn=null) => {
    if (fn==null) {
      fn = instances
      instances = 1
    }
    queue.process(name, instances, (job, done) => {
      Promise.resolve( fn(job) )
        .then( () => done() )
        .catch( (error) => done(error) )
        .done()
    })
  })
}
