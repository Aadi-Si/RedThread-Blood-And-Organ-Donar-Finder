const supabase = require('../config/supabase')

const protect = async (req, res, next) => {
  // 1. Get the token from the request header
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  // 2. Extract the token (header looks like "Bearer eyJhbG...")
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' })
  }

  // 3. Ask Supabase if this token is valid
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  // 4. Token is valid — attach user to request and move on
  req.user = data.user
  next()
}

module.exports = protect

// What each step does in simple words:

// Step 1 — checks if the request even has a token
// Step 2 — pulls the token out of the header
// Step 3 — asks Supabase "is this token real?"
// Step 4 — if yes, saves the user info and calls next() which means "ok go to the route now"