"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");



// router.get('/test/:username', async (req, res, next) => {
//   let username = req.params.username;
//   let response = await User.checkAdmin(username)
//   return res.json(response)
// })

// Middleware to check if a user in an admin
async function ensureAdmin(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
      if (res.locals.user.isAdmin) {
        return next()
      } else {
        return res.status(403).send({ error: { status: 403, message: 'Access denied. Must be an Admin to access.' } });
      }
    }
    return next();
  } catch (err) {
    return next();
  }
}



/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
      // console.log(res.locals.user.isAdmin)
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  ensureAdmin,
  authenticateJWT,
  ensureLoggedIn,
};
