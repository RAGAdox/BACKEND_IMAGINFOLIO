const queryExecutor = require("./queryExecutor");
exports.saveUser = async (username, hashString, email, fullname) => {
  return queryExecutor
    .query(
      `
  INSERT INTO USERS (username, password_hash, email_id, full_name) VALUES ($1,$2,$3,$4);
  `,
      [username, hashString, email, fullname]
    )
    .catch((error) => {
      return {
        error: "Error while saving user",
        debug: error,
      };
    });
};
exports.savePost = async ({ username, post_url, caption, tags }) => {
  return queryExecutor.query(
    `INSERT INTO POSTS (USERNAME,POST_URL,CAPTION,TAGS) VALUES ($1,$2,$3,$4)`,
    [username, post_url, caption, tags]
  );
};
exports.likePost = async (postId, username) => {
  return queryExecutor.query(`CALL LIKE_POST($1,$2)`, [postId, username]);
};
exports.comment = async (parrentId, username, commentText) => {
  return queryExecutor.query(`CALL COMMENT($1,$2,$3)`, [
    parrentId,
    username,
    commentText,
  ]);
};
