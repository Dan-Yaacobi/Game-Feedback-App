CREATE TYPE report_type AS ENUM (
    'bug',
    'suggestion',
    'balance_issue'
);

CREATE TYPE report_status AS ENUM (
    'open',
    'investigating',
    'closed'
);
