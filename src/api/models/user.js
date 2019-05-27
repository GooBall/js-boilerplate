const database = require('diskdb');

const db = database.connect('./src/api/db', ['users']);

function findByUsername(username) {
  return db.users.find({ username: username });
}

function findById(userId) {
  return db.users.find({ id: userId });
}

function authId(userId, callback) {
  const user = findById(userId);
  // console.log(user);

  if (user.id) return callback(null, user);
  return callback(new Error('User ' + userId + ' does not exist'));
}

function authUsername(username, callback) {
  const user = findByUsername(username);
  if (user.username) return callback(null, user);
  return callback(null, null);
}

module.exports.findByUsername = findByUsername;
module.exports.findById = findById;
module.exports.authId = authId;
module.exports.authUsername = authUsername;
