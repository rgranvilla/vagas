// src/core/database/db.json
var users = [
  {
    id: 1,
    name: "John Doe",
    isAdmin: true,
    password: "$2a$06$JTkakiET1QKLLUQbDEpXs..VSuYpxcvWVnfS0hVuxxi6PvQz5U2uK",
    job: "Desenvolvedor",
    permissions: { canUpdate: true, canDelete: true }
  },
  {
    id: 3,
    name: "Mary Doe",
    isAdmin: false,
    password: "$2a$06$FknlBK4zaXqURMmFeRpUOupYPX.aL5H8hEtIMwdIyhG83hKBCrx42",
    job: "Desenvolvedor",
    permissions: { canUpdate: true, canDelete: false }
  },
  {
    id: 4,
    name: "User Name",
    isAdmin: false,
    password: "$2a$06$sa18oXZYPUXBA7rbUcLd0eQB6tBtt95qSj2LthsBjspqLVENQaml6",
    job: "Developer",
    permissions: { canUpdate: false, canDelete: false }
  }
];
var metrics = [
  { id: 1, readCount: 37 },
  { id: 2, readCount: 1 },
  { id: 3, readCount: 9 },
  { id: 4, readCount: 3 }
];
var db_default = {
  users,
  metrics
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  metrics,
  users
});
