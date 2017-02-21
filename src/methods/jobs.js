let kue     = require('kue')
let Promise = require('bluebird')

module.exports = (server, config, waker_config) => {

  let queue = kue.createQueue({
    prefix: waker_config.kue_prefix,
    redis: {
      port: config.cache.port,
      host: config.cache.host
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

  server.method('job.process', (name, fn) => {
    queue.process(name, (job, done) => {
      Promise.resolve( fn(job) )
        .then( () => done() )
        .catch( (error) => done(error) )
        .done()
    })
  })
}
