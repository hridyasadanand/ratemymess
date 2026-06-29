const jwt = require('jsonwebtoken');

// middleware runs BETWEEN receiving request and calling controller
// req = request, res = response, next = "go to next step"
const protect = (req, res, next) => {
  // client sends token in header like this:
  // Authorization: Bearer eyJhbGci...
  const authHeader = req.headers.authorization;

  // check if header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    // split "Bearer TOKEN" → get just the TOKEN part
    const token = authHeader.split(' ')[1];

    // verify checks if token is valid and not expired
    // throws error if invalid — caught below
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach decoded user info to req so controllers can use it
    // now any protected route knows WHO is making the request
    req.user = decoded;

    // next() = middleware done, go to controller now
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };