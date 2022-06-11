CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
DROP DOMAIN IF EXISTS EMAIL CASCADE;
CREATE DOMAIN EMAIL AS CITEXT CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');
DROP TYPE IF EXISTS ACTIVITY_TYPE CASCADE;
CREATE TYPE ACTIVITY_TYPE AS ENUM ('LIKED','COMMENTED');