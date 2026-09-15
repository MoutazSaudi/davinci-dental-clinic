const crypto = require("crypto");

function generate(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 64);
  const hash = key.toString("base64");
  console.log(`ADMIN_PASSWORD_SALT=${salt}`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
}

if (process.argv.length < 3) {
  console.error("Usage: node scripts/generate-admin-credentials.js <password>");
  process.exit(1);
}

generate(process.argv[2]);
