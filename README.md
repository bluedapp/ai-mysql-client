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

const mysqlClient = key => {
  // https://www.npmjs.com/package/@blued-core/qconf
  return createMySQLClient({
    key,
    option: qconf
  })

  // or

  return createMySQLClient({
    master: ['127.0.0.1:3306'],
    slave: ['127.0.0.1:3306', '127.0.0.1:3306', '127.0.0.1:3306'],
    username: 'root',
    password: 'your@123',
    database: 'db',
  }, key)
}

async function getTest() {
  const defaultMySQL = mysqlClient('default')()

  const sql = 'SELECT * FROM test_user LIMIT 0,10'
  const res = await defaultMySQL.query(sql).catch(err => {
    console.error(err, { tips: 'test -> query error' })
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
  time?: number
  option: any
}

// or

interface MySQL {
  master: Array<string>
  slave: Array<string>
  username: string
  password: string
  database: string
}
```

## License

  [MIT License](http://www.opensource.org/licenses/mit-license.php)

[npm-image]: https://img.shields.io/npm/v/ai-mysql-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ai-mysql-client
