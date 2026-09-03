CREATE TABLE IF NOT EXISTS lead_magnets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_slug TEXT,
  file_url TEXT NOT NULL,
  cta_label TEXT NOT NULL DEFAULT 'Baixar grátis',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_category_active ON lead_magnets(category_slug,active);

CREATE TABLE IF NOT EXISTS content_ctas (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  magnet_id TEXT REFERENCES lead_magnets(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  button_text TEXT NOT NULL DEFAULT 'Quero receber',
  destination TEXT NOT NULL DEFAULT 'newsletter',
  priority INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_content_ctas_post_active ON content_ctas(post_id,active,priority);
CREATE INDEX IF NOT EXISTS idx_content_ctas_category_active ON content_ctas(category_id,active,priority);

CREATE TABLE IF NOT EXISTS newsletter_interests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS subscriber_interests (
  subscriber_id TEXT NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  interest_id TEXT NOT NULL REFERENCES newsletter_interests(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY(subscriber_id,interest_id)
);
CREATE INDEX IF NOT EXISTS idx_subscriber_interests_interest ON subscriber_interests(interest_id);

INSERT OR IGNORE INTO newsletter_interests(id,name,slug,active,created_at,updated_at) VALUES
('interest-tech','Tecnologia','tecnologia',1,datetime('now'),datetime('now')),
('interest-linux','Linux & Segurança','linux-seguranca',1,datetime('now'),datetime('now')),
('interest-ai','IA','ia',1,datetime('now'),datetime('now')),
('interest-income','Renda Digital','renda-digital',1,datetime('now'),datetime('now')),
('interest-tutorials','Tutoriais & Guias Práticos','tutoriais-guias',1,datetime('now'),datetime('now')),
('interest-business','Negócios na Internet','negocios',1,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO lead_magnets(id,title,slug,description,category_slug,file_url,cta_label,active,created_at,updated_at) VALUES
('magnet-start-online','Checklist: Primeira Renda Online','primeira-renda-online','Um checklist simples para organizar os primeiros passos rumo à sua primeira renda online.','renda-digital','/materiais/checklist-primeira-renda-online.pdf','Baixar checklist grátis',1,datetime('now'),datetime('now')),
('magnet-blog','Checklist: Criando seu Primeiro Blog','primeiro-blog','Checklist prático para tirar um blog do zero e colocá-lo no ar.','tutoriais-guias','/materiais/checklist-primeiro-blog.pdf','Quero o checklist',1,datetime('now'),datetime('now')),
('magnet-linux','Guia rápido de Linux para iniciantes','linux-iniciantes','Comandos e passos essenciais para quem está começando no Linux.','linux-seguranca','/materiais/guia-linux-iniciantes.pdf','Receber o guia',1,datetime('now'),datetime('now')),
('magnet-ai','Guia: IA na prática para iniciantes','ia-pratica','Um roteiro direto para começar a usar IA com produtividade e responsabilidade.','ia','/materiais/guia-ia-pratica.pdf','Baixar guia grátis',1,datetime('now'),datetime('now'));
