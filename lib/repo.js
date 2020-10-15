const CLI = require('clui');
const fs = require('fs');
const simpleGit = require('simple-git');
const git = simpleGit();
const Spinner = CLI.Spinner;
const touch = require('touch');
const _ = require('lodash');
const chalk = require('chalk');

const inquirer = require('./inquirer');
const gh = require('./github');

module.exports = {
  createRemoteRepo: async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: answers.description,
      private: answers.visibility === 'private',
    };

    const spinner = new Spinner('Creating remote repository...');
    spinner.start();

    try {
      const response = await github.repos.createForAuthenticatedUser(data);
      return response.data.ssh_url;
    } finally {
      spinner.stop();
    }
  },

  createGitignore: async () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);

      if (answers.ignore.length) {
        fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
      } else {
        touch('.gitignore');
      }
    } else {
      touch('.gitignore');
    }
  },

  setupRepo: async (url) => {
    const spinner = new Spinner('Initializing local repository and pushing to remote...');
    spinner.start();

    try {
      git
        .init()
        .then(() => git.add('.gitignore'))
        .then(() => git.add('./*'))
        .then(() => git.commit('🎉 Initial commit'))
        .then(() => git.addRemote('origin', url))
        .then(() => git.push('origin', 'master'));
    } catch(err) {
      console.log(chalk.red(err));
    } finally {
      spinner.stop();
    }
  },
};
