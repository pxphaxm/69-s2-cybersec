'use strict';

const POLICY = {
  minLength: 10,
  requireUpper: true,
  requireLower: true,
  requireDigit: true,
  requireSpecial: true,
};

const validatePassword = (password) => {
  const errors = [];

  if (typeof password !== 'string' || password.length < POLICY.minLength) {
    errors.push(`at least ${POLICY.minLength} characters`);
  }
  if (POLICY.requireUpper && !/[A-Z]/.test(password)) {
    errors.push('one uppercase letter');
  }
  if (POLICY.requireLower && !/[a-z]/.test(password)) {
    errors.push('one lowercase letter');
  }
  if (POLICY.requireDigit && !/[0-9]/.test(password)) {
    errors.push('one number');
  }
  if (POLICY.requireSpecial && !/[^a-zA-Z0-9]/.test(password)) {
    errors.push('one special character');
  }

  if (errors.length > 0) {
    const boom = new Error(`Password policy violated. Must include: ${errors.join(', ')}.`);
    boom.statusCode = 400;
    throw boom;
  }
};

module.exports = (plugin) => {
  const auth = plugin.controllers.auth;

  if (auth) {
    const withPolicy = (handler) =>
      async function (ctx) {
        const password = ctx.request.body && ctx.request.body.password;
        validatePassword(password);
        return handler(ctx);
      };

    if (auth.register) {
      auth.register = withPolicy(auth.register);
    }
    if (auth.resetPassword) {
      auth.resetPassword = withPolicy(auth.resetPassword);
    }
    if (auth.changePassword) {
      auth.changePassword = withPolicy(auth.changePassword);
    }
  }

  return plugin;
};