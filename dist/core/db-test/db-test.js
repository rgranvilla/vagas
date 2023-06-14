// src/core/db-test/db-test.json
var users = [
  {
    id: 1,
    name: "admin",
    isAdmin: true,
    password: "$2a$06$JTkakiET1QKLLUQbDEpXs..VSuYpxcvWVnfS0hVuxxi6PvQz5U2uK",
    job: "Admin",
    permissions: { canUpdate: true, canDelete: true }
  }
];
var metrics = [];
var db_test_default = {
  users,
  metrics
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  metrics,
  users
});
