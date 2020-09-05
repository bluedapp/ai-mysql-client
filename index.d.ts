interface Config {
  key?: string;
  option: any;
  time?: number;
}

interface MySQL {
  master: {
    host: string;
    port: string;
  };
  slaves: {
    host: string;
    port: string;
  }[];
  username: string;
  password: string;
  database: any;
  modelPath: any;
}

declare function aiMysqlClient(config: Config | MySQL, cache?: string);

export = aiMysqlClient
