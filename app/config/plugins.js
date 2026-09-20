module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      ratelimit: {
        interval: 60000,
        max: 20,
      },
    },
  },
});