import bcrypt from "bcrypt";

const password = process.argv[2] || "password123";

const hash = await bcrypt.hash(password, 10);

console.log("\n=================================");
console.log("Password Hash Generator");
console.log("=================================\n");
console.log(`Password: ${password}`);
console.log(`Hash: ${hash}\n`);
console.log("Use this hash in your MongoDB user document.\n");

