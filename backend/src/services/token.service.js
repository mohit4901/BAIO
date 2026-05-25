const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

const generateTokenPair = (id, role) => {
  const accessToken = generateAccessToken(id, role);
  const refreshToken = generateRefreshToken(id, role);
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const setCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge,
});

const setAuthCookies = (res, accessToken, refreshToken, isAdmin = false) => {
  const prefix = isAdmin ? 'admin' : '';
  const accessKey = isAdmin ? 'adminAccessToken' : 'accessToken';
  const refreshKey = isAdmin ? 'adminRefreshToken' : 'refreshToken';

  res.cookie(accessKey, accessToken, setCookieOptions(15 * 60 * 1000)); // 15 min
  res.cookie(refreshKey, refreshToken, setCookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 days
};

const clearAuthCookies = (res, isAdmin = false) => {
  const accessKey = isAdmin ? 'adminAccessToken' : 'accessToken';
  const refreshKey = isAdmin ? 'adminRefreshToken' : 'refreshToken';
  res.clearCookie(accessKey);
  res.clearCookie(refreshKey);
};

module.exports = {
  generateTokenPair,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRandomToken,
  hashToken,
  setAuthCookies,
  clearAuthCookies,
};
