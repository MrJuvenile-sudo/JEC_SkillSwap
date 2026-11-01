const mysql = require("mysql2/promise");

function getSslConfig() {
  const host = process.env.DB_HOST || "localhost";
  const isCloudHost =
    (host !== "localhost" && host !== "127.0.0.1") ||
    Boolean(process.env.DATABASE_URL) ||
    Boolean(process.env.DB_HOST && process.env.DB_HOST.includes("."));

  // If explicitly disabled with DB_SSL=false
  if (process.env.DB_SSL === "false") {
    return undefined;
  }

  // TiDB Cloud, Aiven, AWS RDS, Render, etc.
  if (process.env.DB_SSL === "true" || isCloudHost) {
    return {
      minVersion: "TLSv1.2",
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === "false" ? false : true,
    };
  }

  return undefined;
}

let pool;

if (process.env.DATABASE_URL) {
  // Supports single cloud URI connection string
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: getSslConfig(),
  });
} else {
  const host = process.env.DB_HOST || "localhost";
  let port = parseInt(process.env.DB_PORT || (host.includes("tidbcloud.com") ? "4000" : "3306"), 10);
  
  // Auto-detect TiDB Cloud default port 4000 if not specified or mistakenly set to 3306
  if (host.includes("tidbcloud.com") && port === 3306) {
    port = 4000;
  }

  // TiDB Cloud default database is 'test' if DB_NAME is not set
  const database = process.env.DB_NAME || (host.includes("tidbcloud.com") ? "test" : "skillswap");

  pool = mysql.createPool({
    host: host,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: database,
    port: port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: getSslConfig(),
  });
}

module.exports = pool;
