
-- Add username as nullable first to preserve existing admin records.
ALTER TABLE "AdminUser"
ADD COLUMN "username" TEXT;

-- Generate a non-empty, unique username for every existing admin.
-- Process rows deterministically and check each candidate against
-- usernames already assigned, including usernames with numeric suffixes.
DO $$
DECLARE
  admin_row RECORD;
  base_username TEXT;
  candidate TEXT;
  suffix INTEGER;
BEGIN
  FOR admin_row IN
    SELECT "id", "email"
    FROM "AdminUser"
    ORDER BY "id"
  LOOP
    -- Derive the base from the email local-part.
    base_username := LOWER(
      SPLIT_PART(admin_row."email", '@', 1)
    );

    -- Keep usernames readable and URL/login friendly.
    base_username := REGEXP_REPLACE(
      base_username,
      '[^a-z0-9_-]',
      '',
      'g'
    );

    -- Remove leading/trailing separators.
    base_username := BTRIM(base_username, '-_');

    -- Handle emails that produce an empty username.
    IF base_username = '' THEN
      base_username := 'admin';
    END IF;

    candidate := base_username;
    suffix := 2;

    -- Avoid collisions with both natural names and generated suffixes.
    WHILE EXISTS (
      SELECT 1
      FROM "AdminUser"
      WHERE "username" = candidate
    )
    LOOP
      candidate := base_username || '-' || suffix::TEXT;
      suffix := suffix + 1;
    END LOOP;

    UPDATE "AdminUser"
    SET "username" = candidate
    WHERE "id" = admin_row."id";
  END LOOP;
END $$;

-- Enforce the required and unique username after backfilling.
ALTER TABLE "AdminUser"
ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX "AdminUser_username_key"
ON "AdminUser" ("username");
