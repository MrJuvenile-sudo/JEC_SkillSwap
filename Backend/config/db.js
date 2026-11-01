const mysql = require("mysql2/promise");

let pool;

if (process.env.DATABASE_URL) {
  // Supports single cloud URI connection string (e.g. TiDB Cloud, Aiven, Railway)
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === "false" ? undefined : { rejectUnauthorized: false },
  });
} else {
  const host = process.env.DB_HOST || "localhost";
  const isCloudHost = host !== "localhost" && host !== "127.0.0.1";
  const enableSsl = process.env.DB_SSL === "true" || (isCloudHost && process.env.DB_SSL !== "false");

  pool = mysql.createPool({
    host: host,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "skillswap",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: enableSsl ? { rejectUnauthorized: false } : undefined,
  });
}

module.exports = pool;
