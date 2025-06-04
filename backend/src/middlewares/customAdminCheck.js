export function adminCheck(req, res, next) {
  
  
  if ( req.headers["x-role"] !== "admin" ) {
    return res.status(403).json({ error: "Access denied." });
  }
  next();
}