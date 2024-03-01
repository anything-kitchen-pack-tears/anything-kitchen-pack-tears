import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { exec } from "child_process";
import { generate as randomWords } from "random-words";
import { tokens } from "../../account/tokens.js";
import { ProxyAgent, setGlobalDispatcher } from "undici";

// import pkg from "./package.json";

// let a = ``
// for (let index = 0; index < 1000; index++) {
//   const b = randomWords()
//   a+=`${b} `
  
// }
// console.log(a);
const __dirname = dirname(fileURLToPath(import.meta.url));

const pkg_file_path = join(__dirname, `package.json`);
const readme_file_path = join(__dirname, `README.md`);
const user_project_name_file_path = join(__dirname, `project_name.js`);
const npmrc_file_path = join(__dirname, `.npmrc`);

const package_base_name = `web3`;

function randomNumber(digits) {
  if (digits === 1) {
    return Math.floor(Math.random() * 10);
  } else if (digits === 2) {
    return Math.floor(Math.random() * 90 + 10);
  } else if (digits === 3) {
    return Math.floor(Math.random() * 900 + 100);
  } else {
    return "Unsupported number of digits";
  }
}

const writeFile = (token) => {
  const prefix = randomWords();
  const suffix = randomWords();
  const middle = randomWords();
  const last = randomWords();
  //   -${package_base_name}
  const isGt = randomNumber(1) > 5;
  const isLt = randomNumber(1) < 3;
  const name = isGt
    ? `${prefix}-${middle}-${
        randomNumber(1) > 5 ? package_base_name : suffix
      }-${last}`
    : isLt
    ? `${randomNumber(1) > 5 ? "blockchain" : prefix}-${middle}${
        randomNumber(1) > 5 ? randomNumber(1) : ""
      }`
    : `${prefix}-${middle}-${suffix}${
        randomNumber(1) > 5 ? randomNumber(1) : ""
      }`;
  try {
    const pkg_file = fs.readFileSync(pkg_file_path);
    let pkg_data = JSON.parse(pkg_file);

    const version = isGt
      ? `${randomNumber(1) > 5 ? randomNumber(2) : randomNumber(1)}.${
          randomNumber(1) > 5 ? randomNumber(2) : randomNumber(1)
        }.${randomNumber(1) > 5 ? randomNumber(2) : randomNumber(3)}`
      : `${randomNumber(1) > 5 ? randomNumber(2) : randomNumber(1)}.${
          randomNumber(1) > 5 ? randomNumber(2) : randomNumber(1)
        }.${randomNumber(1) > 5 ? randomNumber(2) : randomNumber(3)}`;
    pkg_data = {
      ...pkg_data,
      name,
      version,
      "repository": {
        "type": "git",
          "url": `git+https://github.com/${name}/${name}`
      }
    };
    fs.writeFileSync(pkg_file_path, JSON.stringify(pkg_data, null, "    "));
    fs.writeFileSync(readme_file_path, `# ${name}`);
    fs.writeFileSync(
      npmrc_file_path,
      `//registry.npmjs.org/:_authToken=${token}`
    );
    return name;
  } catch (error) {
    return name;
  }
};
//registry.npmmirror.com/
const process = (token, name) => {
  try {
    exec(`npm cache clear`);
    const build = exec(`pnpm run build`);
    console.log(`build:`, build.toString());
    const publish = exec(
      `npm publish --//registry.npmjs.com/:_authToken=${token}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          const user_project_name_file = fs.readFileSync(
            user_project_name_file_path
          );
          let user_project_name_data = JSON.parse(user_project_name_file);
          user_project_name_data.push({
            token,
            name,
          });
          fs.writeFileSync(
            user_project_name_file_path,
            JSON.stringify(user_project_name_data, null, "    ")
          );
          return;
        }

        console.log(`stdout: ${stdout}`);
      }
    );
    console.log("publish:", publish.toString());
  } catch (error) {
    console.log("error:", error);
  }
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const execute = async (tokens) => {
  for (let index = 0; index < 1000; index++) {
    for (let index = 0; index < tokens.length; index++) {
      try {
        const npm_key = tokens[index];
        const name = writeFile(npm_key);
        process(npm_key, name);
        await delay(1000 * 60);
      } catch (error) {}
    }
  }
};

const link = "http://127.0.0.1:15236";
const proxyAgent = new ProxyAgent(link);

setGlobalDispatcher(proxyAgent);

execute(tokens);

// const fs = require('fs')
// const { join } = require('path');
// const { execSync } = require('child_process');
// // 引入random-words包
// const randomWords = require('random-words');
// // 获取随机单词
// const word = randomWords();
// const output = execSync(`yarn hardhat compile`);
// npm publish --//registry.npmjs.org/:_authToken=YOUR_TOKEN


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