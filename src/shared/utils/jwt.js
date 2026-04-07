import jwt from 'jsonwebtoken';
import config from '../../config/env.js';

const generateAccessToken = (payload) =>
  jwt.sign(payload, config.accessTokenKey, { expiresIn: '3h' });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, config.refreshTokenKey);

const verifyAccessToken = (token) => jwt.verify(token, config.accessTokenKey);

const verifyRefreshToken = (token) => jwt.verify(token, config.refreshTokenKey);

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
