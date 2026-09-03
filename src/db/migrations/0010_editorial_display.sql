ALTER TABLE posts ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE posts ADD COLUMN reading_time INTEGER NOT NULL DEFAULT 5;
CREATE INDEX IF NOT EXISTS idx_posts_featured_published ON posts(featured,status,published_at DESC);
UPDATE posts SET featured=1,reading_time=6 WHERE slug='primeiros-passos-web';
UPDATE posts SET reading_time=4 WHERE slug='ia-para-iniciantes';
UPDATE posts SET reading_time=5 WHERE slug='primeiro-freelance';
UPDATE posts SET reading_time=7 WHERE slug='publicar-site';
