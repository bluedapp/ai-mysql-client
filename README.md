# ai-mysql-client

[![npm version][npm-image]][npm-url]

A mysql client tools for nodejs and want to look for a girlfriend...

## Installation

``` js
$ npm i ai-mysql-client
```

## Example

``` js
import createMySQLClient from 'ai-mysql-client'

// https://www.npmjs.com/package/@blued-core/qconf
qconf.flag: isLocalPro ? 'production' : '',

const mysqlClient = key => {
  return createMySQLClient({
    key,
    option: qconf,
    connections: 20,
    time: 60,
  })()

  // or

  return createMySQLClient({
    master: ['127.0.0.1:3306'],
    slave: ['127.0.0.1:3306', '127.0.0.1:3306', '127.0.0.1:3306'],
    username: 'root',
    password: 'your@123',
    database: 'test',
    time: 60,
    connections: 20,
  }, key)()
}

async function getTest() {
  const defaultMySQL = mysqlClient('default')

  const sql = 'SELECT * FROM test_user LIMIT 0,10'
  const res = await defaultMySQL.query(sql).catch(err => {
    console.error(err, { tips: 'query error' })
  })

  console.log(res)

  return res
}
```

## Options

``` js
// options
interface Config {
  key?: string
  option: any
  connections?: number
  time?: number
}

// or

interface MySQL {
  master: Array<string>
  slave: Array<string>
  username: string
  password: string
  database: string
  connections?: number
  time?: number
}
```

## License

  [MIT License](http://www.opensource.org/licenses/mit-license.php)

[npm-image]: https://img.shields.io/npm/v/ai-mysql-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ai-mysql-client
