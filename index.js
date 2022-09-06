const mysql = require('mysql')
const { promisify } = require('util')
const { checkType, getRandomSubscript } = require('./lib/tool')
const { createCache } = require('./lib/interval-cache-store')

function getMySQLPool(data, key) {
  let target = {}
  let cache = data.key
  const close = data.close || 2
  const interval = 1000 * (data.time || 60)

  target.connections = data.connections || 20

  if (!cache && key) {
    cache = key
  }

  // https://github.com/Qihoo360/QConf
  if (checkType(data.option, 'Object')) {
    target = data.option
  } else {
    target = data
  }

  const pool = createCache(`mysql-${cache}`, () => {
    const config = getMysqlConfig(target, cache)
    if (data.option.charset) Reflect.set(config, 'charset', data.option.charset)
    const mysqlPool = createMysqlPool(config)

    setTimeout(() => {
      try {
        mysqlPool.end()
      } catch (err) {
        console.error(`Close MySQL error → ${cache}, ${err}`)
      }
    }, interval * close)

    return mysqlPool
  }, interval)

  return pool
}

function createMysqlPool(option) {
  const config = {
    user: option.username,
    password: option.password,
    database: option.database,
    connectionLimit: option.connections,
  }
  if (option.charset) Reflect.set(config, 'charset', option.charset)

  const master = Object.assign({
    host: option.master.host,
    port: Number(option.master.port) || 3306,
  }, config)

  const slaves = Object.assign({
    host: option.slave.host,
    port: Number(option.slave.port) || 3306,
  }, config)

  const masterMysqlClient = createPool(master)
  const slaveMysqlClient = createPool(slaves)

  return {
    query(sql, ...args) {
      if (/^[\s\r\n]*SELECT\s/i.test(sql)) {
        return slaveMysqlClient.query(sql, ...args)
      } else {
        return masterMysqlClient.query(sql, ...args)
      }
    },
    end() {
      masterMysqlClient.end()
      slaveMysqlClient.end()
    }
  }
}

function createPool({ host, port, user, password, database, connectionLimit, charset }) {
  const config = {
    host,
    port,
    user,
    password,
    database,
    connectionLimit,
  }
  if (charset) Reflect.set(config, 'charset', charset)
  const pool = mysql.createPool(config)
  pool.query = promisify(pool.query)
  return pool
}

function getMysqlConfig(data, cache) {
  let target = Object.assign({}, data)
  const pass = checkType(data.getMysqlConf, 'Function')

  if (pass) {
    target = data.getMysqlConf(cache)
    target.slave = target.slaves[0]
  } else {
    const m = target.master[getRandomSubscript(target.master.length)]
    const one = m.split(':')

    target.master = {
      host: one[0],
      port: one[1],
    }

    const s = target.slave[getRandomSubscript(target.slave.length)]
    const two = s.split(':')

    target.slave = {
      host: two[0],
      port: two[1],
    }
  }

  target.connections = data.connections

  return target
}

module.exports = getMySQLPool
