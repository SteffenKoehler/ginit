const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
  askForGithubAccessToken: () => {
      return inquirer.prompt({
          name: 'githubAccessToken',
          type: 'input',
          message: 'Enter your GitHub Access Token - you can generate one here https://github.com/settings/tokens',
          validate: function (value) {
              if (value.length) {
                  return true;
              } else {
                  return 'Please enter your GitHub Access Token.';
              }
          }
      })
  },

  askRepoDetails: () => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the repository:',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a name for the repository.';
          }
        },
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Optionally enter a description of the repository:',
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private:',
        choices: ['public', 'private'],
        default: 'public',
      },
    ];
    return inquirer.prompt(questions);
  },

  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components'],
      },
    ];
    return inquirer.prompt(questions);
  },
};
