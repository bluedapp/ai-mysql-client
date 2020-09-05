const mysql = require('mysql')
const { promisify } = require('util')
const { createCache } = require('./utils/interval-cache-store')

function getMySQLPool (data, cache) {
  const interval = 1000 * (data.time || 60)
  let target = {}
  let words = data.key

  // use https://github.com/Qihoo360/QConf
  if (checkType(data.option, 'Object')) {
    target = data.option
  }

  if (checkType(data.master, 'Object')) {
    target = data
  }

  if (target.master && cache) {
    words = cache
  }

  const pool = createCache(`mysql-${words}`, () => {
    const config = checkType(target.getMysqlConf, 'Function') ? target.getMysqlConf(words) : target
    const mysqlPool = createMysqlPool(config)

    setTimeout(() => {
      try {
        mysqlPool.end()
      } catch (err) {
        console.error(`Close MySQL error → ${words}, ${err}`)
      }
    }, interval * 2)

    return mysqlPool
  }, interval)

  return pool
}

function createMysqlPool (option) {
  const config = {
    connectionLimit: 4,
    database: option.database,
    password: option.password,
    user: option.username
  }

  const masert = Object.assign({
    host: option.master.host,
    port: Number(option.master.port) || 3306
  }, config)

  const slaves = Object.assign({
    host: option.slaves[0].host,
    port: Number(option.slaves[0].port) || 3306
  }, config)

  const masterMysqlClient = createPool(masert)
  const slaveMysqlClient = createPool(slaves)

  return {
    query (sql, ...args) {
      if (/^[\s\r\n]*SELECT\s/i.test(sql)) {
        return slaveMysqlClient.query(sql, ...args)
      } else {
        return masterMysqlClient.query(sql, ...args)
      }
    },
    end () {
      masterMysqlClient.end()
      slaveMysqlClient.end()
    }
  }
}

function createPool ({ host, user, password, database, connectionLimit, port }) {
  const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    connectionLimit
  })

  pool.query = promisify(pool.query)

  return pool
}

function checkType (param, type) {
  return Object.prototype.toString.call(param) === `[object ${type}]`
}

module.exports = getMySQLPool
