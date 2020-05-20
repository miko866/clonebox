import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

/**
 * passwordHashed() do hashed password for organization with argon2i
 * @param {String} password
 * @return {String} result
 */
export const passwordHashed = async password => {
  return await argon2.hash(password, {
    // Is slower and resistant against tradeoff attacks,
    // which is preferred for password hashing and key derivation
    type: argon2.argon2i,
    hashLength: 1024,
  });
};

/**
 * comparePassword() compare two password
 * @param {String} userPassword
 * @param {String} password
 * @return {Boolean}
 */
export const comparePassword = async (userPassword, password) => {
  return argon2.verify(userPassword, password);
};

/**
 * validateEmail()
 * @param {String} email
 * @return {String} email
 */
export const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

/**
 * jwtSignUser() set JWTToken with one week expires
 * @param {Object} data
 * @return {String} JWT Token
 */
export const jwtSignUser = data => {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(data, process.env.VUE_APP_SERVER_JWT_SECRET, {
    expiresIn: ONE_WEEK,
  });
};
