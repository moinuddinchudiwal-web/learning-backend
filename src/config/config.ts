import dotenv from "dotenv";

dotenv.config({ quiet: true });

interface Config {
  port: number;
  NODE_ENV: string;
  DB_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URI: process.env.DB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
};

export default config;
