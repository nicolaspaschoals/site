import { pbkdf2Sync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";

const prompt = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
const user = await prompt.question("Login do painel: ");
const password = await prompt.question("Senha do painel: ", { hideEchoBack: true });
prompt.close();
if (!user || password.length < 10) throw new Error("Informe um login e uma senha de pelo menos 10 caracteres.");
const salt = randomBytes(32).toString("hex");
const hash = pbkdf2Sync(password, salt, 100000, 32, "sha256").toString("hex");
console.log(`\nADMIN_USER=${user}\nADMIN_SALT=${salt}\nADMIN_HASH=${hash}`);
