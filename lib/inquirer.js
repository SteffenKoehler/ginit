const inquirer = require('inquirer');

module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your GitHub username or e-mail address:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your username or e-mail address.';
          }
        },
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password.';
          }
        },
      },
    ];

    return inquirer.prompt(questions);
  },

  getTwoFactorAuthenticationCode: () => {
    return inquirer.prompt({
      name: 'twoFactorAuthenticationCode',
      type: 'input',
      message: 'Enter your two-factor authentication code:',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your two-factor authentication code.';
        }
      },
    });
  },
};
