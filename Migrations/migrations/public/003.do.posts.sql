CREATE TABLE POSTS (
  POST_ID uuid PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
  USERNAME VARCHAR(32) NOT NULL,
  POST_URL TEXT NOT NULL,
  CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  TAGS TEXT[],
  CAPTION TEXT
);