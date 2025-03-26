import fs from "fs";
import os from "os";
import path from "path";

const networkInterfaces = os.networkInterfaces();

const ip = networkInterfaces.en0.find(
  (iface) => iface.family === "IPv4",
)?.address;

const envPath = path.join(path.dirname("."), "example", ".env.local");
const env = fs.readFileSync(envPath, "utf8");
const newEnv = env
  .replace(/EXPO_PUBLIC_LOCAL=.*/, `EXPO_PUBLIC_LOCAL=http://${ip}:9999`)
  .replace(/EXPO_PUBLIC_ENV=.*/, "EXPO_PUBLIC_ENV=local");
fs.writeFileSync(envPath, newEnv);
