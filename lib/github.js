const CLI = require('clui');
const Configstore = require('configstore');
const { Octokit } = require('@octokit/rest');
const Spinner = CLI.Spinner;
const { createBasicAuth } = require('@octokit/auth-basic');

const inquirer = require('./inquirer');
const packageJson = require('../package.json');

const conf = new Configstore(packageJson.name);

let octokit;

module.exports = {
  getInstance: () => {
    return octokit;
  },

  getStoredGithubToken: () => {
    return conf.get('github.token');
  },

  getPersonalAccesToken: async () => {
    const credentials = await inquirer.askGithubCredentials();
    const spinner = new Spinner('Authenticating you, please wait...');

    spinner.start();

    const auth = createBasicAuth({
      username: credentials.username,
      password: credentials.password,
      async on2Fa() {
        spinner.stop();
        const res = await inquirer.getTwoFactorAuthenticationCode();
        spinner.start();
        return res.twoFactorAuthenticationCode;
      },
      token: {
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'ginit, the command-line tool for initalizing Git repos',
      },
    });

    try {
      const res = await auth();

      if (res.token) {
        conf.set('github.token', res.token);
        return res.token;
      } else {
        throw new Error('GitHub token was not found in the response');
      }
    } finally {
      spinner.stop();
    }
  },

  githubAuth: (token) => {
      octokit = new Octokit({
          auth: token
      });
  },
};
