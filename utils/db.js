const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://CommonGround-relationships_owner:npg_qA8bHrvnEMg7@ep-dry-snow-a1r0cs03.ap-southeast-1.aws.neon.tech/CommonGround-relationships?sslmode=require",
  ssl: true, // Use SSL for secure connections
});

pool.connect()
  .then(() => console.log("Connected to Neon DB"))
  .catch((err) => console.error("Connection error", err));
