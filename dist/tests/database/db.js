// src/tests/database/db.json
var users = [];
var metrics = [];
var db_default = { users, metrics };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  metrics,
  users
});
