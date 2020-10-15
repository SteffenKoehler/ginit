const CLI = require('clui');
const Configstore = require('configstore');
const { Octokit } = require('@octokit/rest');
const Spinner = CLI.Spinner;
const { createTokenAuth } = require("@octokit/auth-token");

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
    const credentials = await inquirer.askForGithubAccessToken();
    const spinner = new Spinner('Authenticating you, please wait...');

    spinner.start();

    const auth = createTokenAuth(credentials.githubAccessToken);

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
