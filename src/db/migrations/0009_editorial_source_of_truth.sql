ALTER TABLE posts ADD COLUMN content_type TEXT NOT NULL DEFAULT 'supporting' CHECK (content_type IN ('pillar','cluster','supporting'));
ALTER TABLE posts ADD COLUMN cluster_slug TEXT NOT NULL DEFAULT 'geral';
ALTER TABLE posts ADD COLUMN primary_keyword TEXT;
ALTER TABLE posts ADD COLUMN search_intent TEXT NOT NULL DEFAULT 'informacional' CHECK (search_intent IN ('informacional','comercial','navegacional','transacional'));
ALTER TABLE posts ADD COLUMN seo_priority TEXT NOT NULL DEFAULT 'media' CHECK (seo_priority IN ('alta','media','baixa'));
ALTER TABLE posts ADD COLUMN reviewed_at TEXT;
ALTER TABLE posts ADD COLUMN reviewed_by TEXT;
ALTER TABLE posts ADD COLUMN sources_json TEXT;
ALTER TABLE posts ADD COLUMN experience_note TEXT;
CREATE INDEX IF NOT EXISTS idx_posts_cluster_status ON posts(cluster_slug,status);
CREATE INDEX IF NOT EXISTS idx_posts_primary_keyword ON posts(primary_keyword);
CREATE INDEX IF NOT EXISTS idx_posts_seo_priority ON posts(seo_priority,status);

UPDATE posts SET content_type='cluster',cluster_slug='fundamentos-web',primary_keyword='como criar um site',search_intent='informacional',seo_priority='alta',reviewed_at='2026-09-02',reviewed_by='Equipe editorial Dejotacode',experience_note='Conteúdo produzido com foco em aplicação prática, linguagem acessível e atualização editorial contínua.',sources_json='[]' WHERE slug='primeiros-passos-web';
UPDATE posts SET content_type='cluster',cluster_slug='ia-na-pratica',primary_keyword='IA para iniciantes',search_intent='informacional',seo_priority='alta',reviewed_at='2026-09-02',reviewed_by='Equipe editorial Dejotacode',experience_note='Conteúdo produzido com foco em aplicação prática, linguagem acessível e atualização editorial contínua.',sources_json='[]' WHERE slug='ia-para-iniciantes';
UPDATE posts SET content_type='cluster',cluster_slug='primeira-renda-digital',primary_keyword='como ser freelancer',search_intent='informacional',seo_priority='alta',reviewed_at='2026-09-02',reviewed_by='Equipe editorial Dejotacode',experience_note='Conteúdo produzido com foco em aplicação prática, linguagem acessível e atualização editorial contínua.',sources_json='[]' WHERE slug='primeiro-freelance';
UPDATE posts SET content_type='cluster',cluster_slug='tutoriais-resolutivos',primary_keyword='como publicar um site',search_intent='informacional',seo_priority='alta',reviewed_at='2026-09-02',reviewed_by='Equipe editorial Dejotacode',experience_note='Conteúdo produzido com foco em aplicação prática, linguagem acessível e atualização editorial contínua.',sources_json='[]',category_id='cat-tutoriais-guias' WHERE slug='publicar-site';
