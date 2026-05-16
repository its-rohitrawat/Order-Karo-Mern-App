import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load env from every place people commonly put it; later paths override earlier (backend/.env wins).
const envPaths = [
  path.resolve(__dirname, "../../../.env"), // repo root (next to /backend)
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend", ".env"),
  path.resolve(__dirname, "../../.env"), // backend/.env
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true, quiet: true });
  }
}
// dotenv.config()
export const PORT = process.env.PORT;
export const MONGODB_URL = (
  process.env.MONGODB_URL ||
  process.env.MONGO_URI ||
  process.env.DATABASE_URL ||
  ""
).trim();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const FRONTEND_URL = process.env.FRONTEND_URL;

export const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE;
export const NODEMAILER_PORT = process.env.NODEMAILER_PORT;
export const NODEMAILER_SECURE = process.env.NODEMAILER_SECURE;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

/** Groq Cloud API key (starts with gsk_); server-side only. */
export const GROQ_API_KEY = (
  process.env.GROQ_API_KEY || process.env.GROQ_CLOUD_API_KEY || ""
).trim();
/** Groq model id — see https://console.groq.com/docs/models */
export const GROQ_MODEL =
process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

// console.log("MONGODB_URL:", process.env.MONGODB_URL);
// console.log("MONGO_URI:", process.env.MONGO_URI);
