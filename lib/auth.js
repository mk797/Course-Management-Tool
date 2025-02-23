// auth.js

const jwt = require("jsonwebtoken");
const secretKey = "SuperSecret";

exports.generateAuthToken = function (userId, userRole) {
  const payload = {
    sub: userId,
    role: userRole
  };
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

exports.requireAuthentication = function (req, res, next) {
  const authHeader = req.get("Authorization") || "";
  const authHeaderParts = authHeader.split(" ");
  const token = authHeaderParts[0] === "Bearer" ? authHeaderParts[1] : null;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload.sub;
    req.role = payload.role;
    console.log("Authenticated User ID: ", req.user);
    console.log("Authenticated User Role: ", req.role);
    next();
  } catch (e) {
    console.error("Authentication error: ", e);
    res.status(401).send({
      error: "Non-valid token"
    });
  }
};

exports.requireAdmin = function (req, res, next) {
  console.log('User Admin Status:', req.role); 
  if (req.role !== "admin") {
    return res.status(403).send({
      error: "Admin permissions required"
    });
  }
  next();
};
