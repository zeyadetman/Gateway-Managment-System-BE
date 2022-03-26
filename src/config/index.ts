import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT || 3001,
  api: {
    prefix: "/api",
  },
  db: {
    uri: process.env.DB_URI || "mongodb://localhost/test",
  },
};
