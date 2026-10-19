-- One row per (visitor, ticked point). user_id is the Google account id ("sub"); no email or name is stored.
CREATE TABLE IF NOT EXISTS roadmap_progress (
  user_id      TEXT        NOT NULL,
  point_id     TEXT        NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, point_id)
);
