// src/infra/database/db.json
var users = [{ id: 1, name: "John Doe", isAdmin: false, password: "$2a$06$JTkakiET1QKLLUQbDEpXs..VSuYpxcvWVnfS0hVuxxi6PvQz5U2uK", job: "Desenvolvedor", permissions: { canUpdate: false, canDelete: false } }];
var metrics = [];
var db_default = { users, metrics };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  metrics,
  users
});
