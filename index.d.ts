interface Config {
  key?: string
  time?: number
  option: any
}

interface MySQL {
  master: Array<string>
  slave: Array<string>
  username: string
  password: string
  database: string
}

declare function getMySQLPool(config: Config | MySQL, key?: string);

export = getMySQLPool
