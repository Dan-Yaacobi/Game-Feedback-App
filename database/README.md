# Database Migrations

This directory contains ordered PostgreSQL migrations for the Game Feedback App schema.

## Migration ordering

Migrations are applied in ascending numeric order by filename prefix:

1. `migrations/001_create_enums.sql`
2. `migrations/002_create_reports.sql`
3. `migrations/003_indexes.sql`

Each migration depends on prior migrations being applied first.

## Initialize a fresh database

1. Create the database:

```bash
createdb game_feedback
```

2. Run each migration in order:

```bash
psql -d game_feedback -f migrations/001_create_enums.sql
psql -d game_feedback -f migrations/002_create_reports.sql
psql -d game_feedback -f migrations/003_indexes.sql
```

After these commands complete, the database will contain the baseline schema.

## Run development seed data

After running migrations, you can insert sample development reports:

```bash
psql -d game_feedback -f seeds/001_seed_sample_reports.sql
```

The seed file is intended for **development environments only** and should not be used for production data.

## Running migrations manually with `psql`

From the `database/` directory, execute each migration file one-by-one in numeric order. Do not skip files and do not apply them out of order.

```bash
psql -d game_feedback -f migrations/001_create_enums.sql
psql -d game_feedback -f migrations/002_create_reports.sql
psql -d game_feedback -f migrations/003_indexes.sql
```

Then run seed data (optional for local/dev testing):

```bash
psql -d game_feedback -f seeds/001_seed_sample_reports.sql
```

## Purpose of each migration

- **`001_create_enums.sql`**: Defines PostgreSQL enum types `report_type` and `report_status` used by report records.
- **`002_create_reports.sql`**: Enables `pgcrypto` for UUID generation and creates the `reports` table with all core report, player, screenshot, and lifecycle fields.
- **`003_indexes.sql`**: Adds indexes for common filters/sorting (`status`, `report_type`, `created_at`) and a GIN index for efficient `tags` array queries.

## Seed file

- **`seeds/001_seed_sample_reports.sql`**: Adds realistic sample reports that cover multiple report types, statuses, priorities, tags, screenshot metadata combinations, and timestamp ranges for development/testing workflows.
