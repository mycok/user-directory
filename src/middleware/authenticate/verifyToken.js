import { JsonWebTokenError, verify } from 'jsonwebtoken';

function verifyToken(req, res, token, next) {
  try {
    const { sub } = verify(token, process.env.PRIVATE_KEY);
    req.loggedInUser = { _id: sub };
    return next();
  } catch (err) {
    if (err instanceof JsonWebTokenError && err.message === 'invalid signature') {
      return res.status(400).json({ message: 'Invalid token signature' });
    }
    return res.status(500).json({ message: err.message });
  }
}

export default verifyToken;
