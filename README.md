# Game-Feedback-App
A web app to submit feedback on your game.

## Seed data (local development)
This repository includes a SQL seed script with realistic player feedback samples.

### File
- `database/seeds/feedback_seed.sql`

### What it does
- Inserts 5 feedback records with ratings from **1** through **5**
- Uses `WHERE NOT EXISTS` checks so it can be run safely multiple times without duplicating the same seed rows

### Load the seed data
Run the script against your local database (PostgreSQL example):

```bash
psql "$DATABASE_URL" -f database/seeds/feedback_seed.sql
```

Or with explicit connection flags:

```bash
psql -h <host> -U <user> -d <database_name> -f database/seeds/feedback_seed.sql
```
