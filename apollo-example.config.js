// rename this file to apollo.config.js
// and use your own credentials below

module.exports = {
  client: {
    service: {
      name: 'service-name',
      url: 'change-me.com',
    },
    includes: ['src/**/*.{vue,ts,tsx,js,jsx}'],
  },
};
