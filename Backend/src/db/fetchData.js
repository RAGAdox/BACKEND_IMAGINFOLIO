const queryExecutor = require("./queryExecutor");
exports.getUser = async (username) => {
  const { rows } = await queryExecutor.query(
    `SELECT USERNAME,FULL_NAME,EMAIL_ID,DATE_OF_JOIN FROM USERS WHERE USERNAME=$1`,
    [username]
  );
  return rows[0];
};
exports.getFeed = async (username, offset = 0, limit = 100) => {
  const { rows } = await queryExecutor.query(
    `SELECT p.POST_ID,p.USERNAME,p.CREATED_AT,u.FULL_NAME FROM POSTS p 
INNER JOIN FOLLOW_RELATIONS r ON r.FOLLOWEE_ID=p.USERNAME AND r.FOLLOWER_ID=$1
INNER JOIN USERS u ON u.USERNAME=r.FOLLOWEE_ID
ORDER BY p.CREATED_AT DESC
OFFSET $2
LIMIT $3;
`,
    [username, offset, limit]
  );
  return rows;
};
exports.getCredentials = async (username) => {
  const { rows } = await queryExecutor.query(
    `SELECT password_hash from USERS where USERNAME = $1`,
    [username]
  );
  return rows;
};
