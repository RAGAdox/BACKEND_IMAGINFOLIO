CREATE TABLE ACTIVITY(
  TYPE ACTIVITY_TYPE NOT NULL,
  PARENT_ID uuid NOT NULL,
  USERNAME VARCHAR(32) NOT NULL,
  ACTIVITY_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ACTIVE BOOLEAN NOT NULL
)