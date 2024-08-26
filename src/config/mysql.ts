import mysql from 'mysql2/promise'
import TransportStream, { TransportStreamOptions } from 'winston-transport'

// MySQL 连接池配置
const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
}

// 创建连接池
const pool = mysql.createPool(mysqlConfig)

interface MySQLTransportOptions extends TransportStreamOptions {
  table: string
}

// MySQL Transport 类
class MySQLTransport extends TransportStream {
  private pool: mysql.Pool
  private table: string

  constructor(opts: MySQLTransportOptions) {
    super(opts)
    this.pool = pool
    this.table = opts.table
  }
}

export { pool, MySQLTransport }
