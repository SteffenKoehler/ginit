const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const github = require('./lib/github');
const inquirer = require('./lib/inquirer');

clear();

console.log(chalk.yellow(figlet.textSync('Ginit', { horizontalLayout: 'full' })));

if (files.directoryExists('.git2')) {
  console.log(chalk.red('Already a Git repository!'));
  process.exit();
}

const run = async () => {
  let token = github.getStoredGithubToken();
  if (!token) {
      token = await github.getPersonalAccesToken();
  }

  console.log(token);
};

run();
