-- Seed data for local development/testing.
-- Safe to run multiple times: each row inserts only if an identical rating/comment pair does not already exist.

INSERT INTO feedback (rating, comment)
SELECT seed.rating, seed.comment
FROM (
  VALUES
    (5, 'Absolutely love the new co-op mode. Matchmaking was quick and the teamwork mechanics felt great.'),
    (4, 'The latest update improved performance a lot, but I still notice occasional frame drops in big fights.'),
    (3, 'Fun core gameplay loop, though progression starts to feel repetitive after a few hours.'),
    (2, 'Controller input feels a bit delayed on menus. Gameplay is solid once a match starts.'),
    (1, 'Game crashed twice during ranked queue and I lost progress both times. Really frustrating experience.')
) AS seed(rating, comment)
WHERE NOT EXISTS (
  SELECT 1
  FROM feedback f
  WHERE f.rating = seed.rating
    AND f.comment = seed.comment
);
