import verifyToken from './verifyToken';

function authenticate(req, res, next) {
  const authorization = req.get('Authorization');
  if (authorization === undefined) return res.status(401).json({ message: 'The authorization header must be set' });

  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer') return res.status(400).json({ message: 'The authorization header should use the Bearer scheme' });

  const jwtRegex = /^[\w-]+\.[\w-]+\.[\w-.+/=]*$/;
  if (!token || !jwtRegex.test(token)) return res.status(400).json({ message: 'The credentials used in the Authorization header should be a valid bcrypt digest' });

  return verifyToken(req, res, token, next);
}

export default authenticate;
