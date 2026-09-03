CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content_html TEXT NOT NULL,
  featured_image TEXT,
  author_user_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  published_at TEXT,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  og_image TEXT,
  robots TEXT DEFAULT 'index,follow',
  schema_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY(author_user_id) REFERENCES users(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_user_id);

INSERT OR IGNORE INTO categories (id,name,slug,description,created_at,updated_at) VALUES
('cat-programacao','Programação','programacao','Desenvolvimento, código e ferramentas.',datetime('now'),datetime('now')),
('cat-linux-seguranca','Linux & Segurança','linux-seguranca','Linux, servidores, segurança e boas práticas.',datetime('now'),datetime('now')),
('cat-criptoativos','Criptoativos','criptoativos','Blockchain, criptoativos e Web3.',datetime('now'),datetime('now')),
('cat-renda-digital','Renda Digital','renda-digital','Renda online, freelancing, afiliados e produtos digitais.',datetime('now'),datetime('now')),
('cat-tech-tendencias','Notícias de Tech & Tendências','tech-tendencias','Tecnologia, tendências e novidades.',datetime('now'),datetime('now')),
('cat-tutoriais-guias','Tutoriais & Guias Práticos','tutoriais-guias','Guias passo a passo para iniciantes.',datetime('now'),datetime('now')),
('cat-ia','IA','ia','Inteligência artificial aplicada na prática.',datetime('now'),datetime('now'));
