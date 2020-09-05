# ai-mysql-client

[![npm version][npm-image]][npm-url]

A mysql tools for nodejs and want to look for a girlfriend...

## Installation

``` js
$ npm i ai-mysql-client
```

## Example

``` js
const mysqlClient = key => {
  if (!(key in datum)) {
    throw new Error( `Can not find the key: [${key}]` )
  }

  // use https://www.npmjs.com/package/@blued-core/qconf
  return createMySQLClient({
    key,
    option: qconf
  })

  // or

  return createMySQLClient({
    master: {
      host: '10.10.10.10',
      port: '3306'
    },
    slaves: [{
      host: '10.10.10.12',
      port: '3306'
    }],
    username: 'test',
    password: 'ELyutPt4yuiySfGRU',
    database: 'activity',
    modelPath: ''
  }, key)
}

async function getTest() {
  const activityMySQL = mysqlClient('activityMySQL')()

  const sql = `SELECT uid FROM test limit 0 ,10`
  const data = await activityMySQL.query(sql).catch(err => {
    console.error(err, {
      tips: 'test -> query error'
    })
  })

  console.log({
    notice: data
  })

  return data
}
```

## Options

``` js
// options
interface Config {
  key ? : string;
  option: any;
  time ? : number;
}

// or

interface MySQL {
  master: {
    host: string;
    port: string;
  };
  slaves: {
    host: string;
    port: string;
  } [];
  username: string;
  password: string;
  database: any;
  modelPath: any;
}
```

## License

  [MIT License](http://www.opensource.org/licenses/mit-license.php)

[npm-image]: https://img.shields.io/npm/v/ai-mysql-client.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ai-mysql-client
