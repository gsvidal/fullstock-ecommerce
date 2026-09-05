-- migrate:up
CREATE TABLE "session" (
  "sid"    VARCHAR   NOT NULL COLLATE "default",
  "sess"   JSON      NOT NULL,
  "expire" TIMESTAMP NOT NULL
);

ALTER TABLE "session"
  ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
  NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- migrate:down
DROP TABLE "session";
