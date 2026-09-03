export const adminPage = `
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DejotaCode CMS</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #08111f;
        --panel: #101b2d;
        --panel-strong: #13233d;
        --panel-soft: rgba(15, 23, 42, 0.8);
        --line: rgba(148, 163, 184, 0.2);
        --line-strong: rgba(125, 211, 252, 0.35);
        --text: #edf5ff;
        --muted: #9fb4cf;
        --brand: #7dd3fc;
        --brand-strong: #3b82f6;
        --success: #34d399;
        --warning: #fbbf24;
        --danger: #f87171;
        --purple: #c084fc;
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; font-family: Inter, Arial, sans-serif; background: linear-gradient(180deg, #08111f 0%, #0c1728 100%); color: var(--text); }
      body { min-height: 100vh; }
      a { color: var(--brand); }
      button, input, textarea, select { font: inherit; }
      .shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
      .side { background: rgba(10, 18, 30, 0.96); border-right: 1px solid var(--line); padding: 24px 18px; }
      .brand { font-size: 1.8rem; font-weight: 700; margin-bottom: 22px; letter-spacing: -0.05em; }
      .brand span { color: var(--brand); }
      .nav { display: flex; flex-direction: column; gap: 8px; }
      .nav button, .btn { border: 1px solid var(--line); background: rgba(19, 35, 61, 0.9); color: var(--text); border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: 0.2s ease; }
      .nav button:hover, .btn:hover { border-color: var(--line-strong); transform: translateY(-1px); }
      .nav button.active { background: rgba(125, 211, 252, 0.12); border-color: rgba(125, 211, 252, 0.4); }
      .btn.primary { background: linear-gradient(135deg, var(--brand), var(--brand-strong)); border: none; color: #031325; font-weight: 700; }
      .btn.danger { background: rgba(248, 113, 113, 0.08); border-color: rgba(248, 113, 113, 0.35); }
      .main { padding: 28px; }
      .top { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 10px; }
      .top h1 { margin: 0; font-size: clamp(1.9rem, 2vw, 2.5rem); letter-spacing: -0.06em; }
      .summary-strip { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
      .summary-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(19, 35, 61, 0.9); border: 1px solid var(--line); color: var(--muted); font-size: 0.8rem; }
      .summary-chip strong { color: var(--text); }
      .summary-chip .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.12); }
      .muted { color: var(--muted); }
      .badge, .status-chip { display: inline-flex; align-items: center; padding: 6px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; }
      .badge { background: rgba(52, 211, 153, 0.12); border: 1px solid rgba(52, 211, 153, 0.4); color: #baf7db; }
      .status-chip { background: rgba(125, 211, 252, 0.12); border: 1px solid rgba(125, 211, 252, 0.35); color: var(--brand); }
      .status-chip.draft { background: rgba(251, 191, 36, 0.12); color: var(--warning); border-color: rgba(251, 191, 36, 0.4); }
      .status-chip.review { background: rgba(192, 132, 252, 0.12); color: #e9d5ff; border-color: rgba(192, 132, 252, 0.45); }
      .status-chip.published { background: rgba(52, 211, 153, 0.12); color: #baf7db; border-color: rgba(52, 211, 153, 0.35); }
      .status-chip.archived { background: rgba(248, 113, 113, 0.12); color: #fecaca; border-color: rgba(248, 113, 113, 0.4); }
      #content { display: block; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
      .card { background: rgba(15, 23, 42, 0.82); border: 1px solid var(--line); border-radius: 14px; padding: 18px; box-shadow: 0 8px 30px rgba(2, 6, 23, 0.25); }
      .kpi { font-size: clamp(1.7rem, 2vw, 2.3rem); font-weight: 800; margin-top: 10px; line-height: 1.2; }
      .toolbar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; align-items: center; }
      .toolbar.stacked { flex-direction: column; align-items: stretch; }
      .field-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
      .field { display: block; }
      .field label { display: block; margin-bottom: 8px; color: var(--muted); font-size: 0.9rem; }
      .field input, .field textarea, .field select { width: 100%; border: 1px solid var(--line); border-radius: 10px; background: rgba(15, 23, 42, 0.9); color: var(--text); padding: 10px 12px; }
      .field textarea { resize: vertical; min-height: 120px; }
      .table-wrap { overflow: auto; }
      .table { width: 100%; border-collapse: collapse; min-width: 700px; }
      .table th, .table td { text-align: left; padding: 12px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
      .table thead th { color: var(--muted); font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; }
      .empty { color: var(--muted); padding: 20px 0; }
      .inline-form { display: flex; gap: 10px; flex-wrap: wrap; }
      .inline-form input, .inline-form select { flex: 1; min-width: 160px; }
      .quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 18px; }
      .quick-action { border: 1px solid var(--line); background: rgba(17, 24, 39, 0.9); border-radius: 12px; padding: 14px; cursor: pointer; transition: 0.2s ease; text-align: left; color: var(--text); }
      .quick-action:hover { border-color: var(--line-strong); transform: translateY(-1px); }
      .quick-action strong { display: block; margin-bottom: 6px; font-size: 0.9rem; }
      .summary-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 18px; }
      .summary-box { background: rgba(12, 20, 35, 0.9); border: 1px solid var(--line); border-radius: 12px; padding: 15px; }
      .metric-delta { font-size: 0.8rem; color: var(--success); margin-top: 8px; }
      .metric-delta.warn { color: var(--warning); }
      .metric-delta.danger { color: var(--danger); }
      .pipeline { display: grid; gap: 12px; margin-top: 12px; }
      .pipeline-item { display: grid; gap: 6px; }
      .pipeline-head { display: flex; justify-content: space-between; align-items: center; font-size: 0.92rem; }
      .progress-bar { height: 8px; width: 100%; background: rgba(148, 163, 184, 0.12); border-radius: 999px; overflow: hidden; }
      .progress-bar > span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--brand), var(--brand-strong)); }
      .progress-bar.warning > span { background: linear-gradient(90deg, var(--warning), #f59e0b); }
      .progress-bar.success > span { background: linear-gradient(90deg, var(--success), #10b981); }
      .progress-bar.danger > span { background: linear-gradient(90deg, var(--danger), #ef4444); }
      .activity-list { display: grid; gap: 10px; margin-top: 12px; }
      .activity-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 12px; border: 1px solid var(--line); background: rgba(15, 23, 42, 0.7); border-radius: 10px; }
      .activity-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--brand); box-shadow: 0 0 0 4px rgba(125, 211, 252, 0.12); }
      .activity-copy { flex: 1; }
      .activity-time { color: var(--muted); font-size: 0.78rem; }
      .performance-chart { display: flex; align-items: end; gap: 10px; height: 120px; margin-top: 12px; }
      .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
      .bar { width: 100%; max-width: 38px; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, var(--brand), var(--brand-strong)); height: 60%; }
      .bar.warning { background: linear-gradient(180deg, var(--warning), #f59e0b); }
      .bar.success { background: linear-gradient(180deg, var(--success), #10b981); }
      .bar-label { color: var(--muted); font-size: 0.72rem; }
      .health-grid { display: grid; gap: 10px; margin-top: 12px; }
      .health-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; border: 1px solid var(--line); background: rgba(15, 23, 42, 0.6); border-radius: 10px; }
      .health-name { display: inline-flex; align-items: center; gap: 8px; }
      .health-bullet { width: 8px; height: 8px; border-radius: 50%; background: var(--success); }
      .health-bullet.warn { background: var(--warning); }
      .health-score { font-weight: 700; }
      .media-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
      .media-item { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: rgba(15, 23, 42, 0.8); }
      .media-item .thumb { aspect-ratio: 4 / 3; display: grid; place-items: center; background: rgba(30, 41, 59, 0.8); color: var(--muted); }
      .media-item .meta { padding: 12px; }
      .toast-container { position: fixed; right: 20px; bottom: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9999; }
      .toast { max-width: 320px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line); background: rgba(15, 23, 42, 0.96); box-shadow: 0 10px 30px rgba(2, 6, 23, 0.35); color: var(--text); }
      .toast.success { border-color: rgba(52, 211, 153, 0.5); }
      .toast.error { border-color: rgba(248, 113, 113, 0.5); }
      .toast.info { border-color: rgba(125, 211, 252, 0.5); }
      .err { border-color: rgba(248, 113, 113, 0.6); color: #fecaca; }
      .login-screen { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 36%), linear-gradient(180deg, #08111f 0%, #0c1728 100%); }
      .login-card { width: min(100%, 420px); padding: 28px; background: rgba(15, 23, 42, 0.92); border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 18px 50px rgba(2, 6, 23, 0.4); }
      .login-card h1 { margin: 0 0 8px; font-size: 1.7rem; }
      .login-card form { display: grid; gap: 14px; margin-top: 24px; }
      .login-card label { display: grid; gap: 7px; color: var(--muted); font-size: 0.9rem; }
      .login-card input { width: 100%; border: 1px solid var(--line); border-radius: 10px; background: rgba(15, 23, 42, 0.9); color: var(--text); padding: 11px 12px; }
      .login-error { min-height: 20px; color: #fecaca; font-size: 0.85rem; }
      @media (max-width: 780px) {
        .shell { grid-template-columns: 1fr; }
        .side { border-right: none; border-bottom: 1px solid var(--line); }
        .main { padding: 18px; }
        .top { flex-direction: column; align-items: flex-start; }
        .summary-strip { margin-bottom: 14px; }
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>
      var state = { me: null, view: 'overview', editId: null };

      function esc(value) {
        return String(value ?? '').replace(/[&<>"']/g, function (char) {
          var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
          return map[char] || char;
        });
      }

      function $(selector) {
        return document.querySelector(selector);
      }

      function api(path, init) {
        var cfg = Object.assign({ credentials: 'same-origin', headers: {} }, init || {});
        if (cfg.body && !(cfg.headers && cfg.headers['Content-Type'])) {
          cfg.headers['Content-Type'] = 'application/json';
        }
        return fetch('/api' + (path.indexOf('/') === 0 ? path : '/' + path), cfg).then(async function (res) {
          var text = await res.text();
          var json = text ? JSON.parse(text) : null;
          if (!res.ok) {
            throw new Error((json && json.error) || res.statusText || 'request_failed');
          }
          return json;
        });
      }

      function statusBadge(value) {
        var key = String(value || 'draft').toLowerCase();
        return '<span class="status-chip ' + key + '">' + esc(value || 'draft') + '</span>';
      }

      function safeNum(value, fallback) {
        var n = Number(value);
        return Number.isFinite(n) ? n : (fallback ?? 0);
      }

      function showToast(message, type) {
        var container = document.querySelector('.toast-container');
        if (!container) {
          container = document.createElement('div');
          container.className = 'toast-container';
          document.body.appendChild(container);
        }
        var toast = document.createElement('div');
        toast.className = 'toast ' + (type || 'info');
        toast.textContent = message || 'Operação concluída';
        container.appendChild(toast);
        setTimeout(function () {
          toast.remove();
        }, 2600);
      }

      function showLogin(message) {
        document.getElementById('app').innerHTML = [
          '<main class="login-screen">',
          '  <section class="login-card">',
          '    <div class="brand">Dejota<span>Code</span></div>',
          '    <h1>Acesso ao painel</h1>',
          '    <div class="muted">Entre com uma conta autorizada para continuar.</div>',
          '    <form id="login-form">',
          '      <label>E-mail<input type="email" name="email" autocomplete="username" required /></label>',
          '      <label>Senha<input type="password" name="password" autocomplete="current-password" required /></label>',
          '      <div class="login-error" id="login-error">' + esc(message || '') + '</div>',
          '      <button class="btn primary" type="submit">Entrar no painel</button>',
          '    </form>',
          '  </section>',
          '</main>'
        ].join('');

        var form = document.getElementById('login-form');
        if (!form) return;
        form.addEventListener('submit', async function (event) {
          event.preventDefault();
          var data = new FormData(form);
          var error = document.getElementById('login-error');
          var button = form.querySelector('button');
          if (button) button.disabled = true;
          if (error) error.textContent = '';
          try {
            var result = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: String(data.get('email') || '').trim(), password: String(data.get('password') || '') }) });
            state.me = result && result.user ? result.user : null;
            if (!state.me) throw new Error('Não foi possível iniciar a sessão.');
            shell();
          } catch (loginError) {
            if (error) error.textContent = loginError && loginError.message === 'invalid_credentials' ? 'E-mail ou senha inválidos.' : 'Não foi possível entrar agora.';
            if (button) button.disabled = false;
          }
        });
      }

      function shell() {
        document.getElementById('app').innerHTML = [
          '<div class="shell">',
          '  <aside class="side">',
          '    <div class="brand">Dejota<span>Code</span></div>',
          '    <nav class="nav">',
          '      <button type="button" data-v="overview" class="active">Visão geral</button>',
          '      <button type="button" data-v="posts">Artigos</button>',
          '      <button type="button" data-v="editor">Novo artigo</button>',
          '      <button type="button" data-v="media">Biblioteca de mídia</button>',
          '      <button type="button" data-v="categories">Categorias</button>',
          '      <button type="button" data-v="comments">Comentários</button>',
          '      <button type="button" data-v="newsletter">Newsletter</button>',
          '      <button type="button" data-v="analytics">Analytics</button>',
          '      <button type="button" data-v="conversion">Conversão</button>',
          '      <button type="button" data-v="users">Usuários</button>',
          '      <button type="button" data-v="events">Eventos</button>',
          '      <button type="button" data-v="workflows">Workflows</button>',
          '      <button type="button" data-v="audit">Auditoria</button>',
          '    </nav>',
          '    <button id="logout" class="btn" type="button" style="width: 100%; margin-top: 18px;">Sair</button>',
          '  </aside>',
          '  <main class="main">',
          '    <div class="top">',
          '      <div>',
          '        <h1 id="title">CMS</h1>',
          '        <div class="muted" id="who"></div>',
          '      </div>',
          '      <span class="badge" id="role-badge">owner</span>',
          '    </div>',
          '    <div class="summary-strip" id="summary-strip"></div>',
          '    <div id="content"></div>',
          '  </main>',
          '</div>'
        ].join('');

        document.querySelectorAll('.nav button').forEach(function (button) {
          button.addEventListener('click', function () {
            var target = button.getAttribute('data-v');
            if (!target) return;
            state.view = target;
            state.editId = null;
            refresh();
          });
        });

        document.getElementById('logout').addEventListener('click', async function () {
          try {
            await api('/auth/logout', { method: 'POST' });
            window.location.reload();
          } catch (error) {
            window.alert(error && error.message ? error.message : 'Falha ao sair');
          }
        });

        refresh();
      }

      async function refresh() {
        var buttons = document.querySelectorAll('.nav button');
        buttons.forEach(function (button) {
          var active = button.getAttribute('data-v') === state.view;
          button.classList.toggle('active', active);
        });

        try {
          var user = await api('/auth/me');
          state.me = user && user.user ? user.user : null;
        } catch (error) {
          showLogin();
          return;
        }

        var who = $('#who');
        if (who) who.textContent = state.me.name + ' · ' + state.me.email;
        var badge = $('#role-badge');
        if (badge) badge.textContent = state.me.role;

        var summaryStrip = $('#summary-strip');
        var summarySummary = [
          '<span class="summary-chip"><span class="dot"></span><span>Operação: <strong>ativa</strong></span></span>',
          '<span class="summary-chip"><span>Fluxo: <strong>editorial</strong></span></span>',
          '<span class="summary-chip"><span>Atualização: <strong>em tempo real</strong></span></span>'
        ];
        if (summaryStrip) summaryStrip.innerHTML = summarySummary.join('');

        try {
          if (state.view === 'overview') await overview();
          if (state.view === 'posts') await posts();
          if (state.view === 'editor') await editor();
          if (state.view === 'media') await media();
          if (state.view === 'categories') await cats();
          if (state.view === 'comments') await comments();
          if (state.view === 'newsletter') await newsletter();
          if (state.view === 'analytics') await analytics();
          if (state.view === 'conversion') await conversion();
          if (state.view === 'users') await users();
          if (state.view === 'events') await events();
          if (state.view === 'workflows') await workflows();
          if (state.view === 'audit') await audit();
        } catch (error) {
          var content = $('#content');
          if (content) content.innerHTML = '<div class="card err">' + esc(error && error.message ? error.message : 'Erro inesperado') + '</div>';
        }
      }

      async function overview() {
        var results = await Promise.all([
          api('/admin/blog/posts'),
          api('/admin/media'),
          api('/admin/analytics/editorial')
        ]);
        var posts = results[0] || { items: [] };
        var media = results[1] || { items: [] };
        var analytics = results[2] || { summary: {}, popular: [] };
        var items = posts.items || [];
        var published = items.filter(function (item) { return item.status === 'published'; }).length;
        var drafts = items.filter(function (item) { return item.status === 'draft'; }).length;
        var reviews = items.filter(function (item) { return item.status === 'review'; }).length;
        var recentPosts = items.slice().sort(function (a, b) {
          return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
        }).slice(0, 4);

        var pipeline = [
          { label: 'Rascunhos', value: drafts, total: Math.max(items.length, 1), kind: 'warning' },
          { label: 'Em revisão', value: reviews, total: Math.max(items.length, 1), kind: 'primary' },
          { label: 'Publicados', value: published, total: Math.max(items.length, 1), kind: 'success' }
        ];
        var performanceValues = [
          { label: 'Jan', value: Math.max(20, Math.min(100, published * 10 + 10)), kind: 'warning' },
          { label: 'Fev', value: Math.max(25, Math.min(100, published * 12 + 18)), kind: 'primary' },
          { label: 'Mar', value: Math.max(35, Math.min(100, published * 14 + 20)), kind: 'success' },
          { label: 'Abr', value: Math.max(42, Math.min(100, published * 15 + 24)), kind: 'success' },
          { label: 'Mai', value: Math.max(55, Math.min(100, published * 16 + 26)), kind: 'primary' },
          { label: 'Jun', value: Math.max(68, Math.min(100, published * 18 + 30)), kind: 'success' }
        ];

        $('#title').textContent = 'Visão geral';
        var summaryStrip = $('#summary-strip');
        if (summaryStrip) summaryStrip.innerHTML = [
          '<span class="summary-chip"><span class="dot"></span><span>Operação: <strong>ativa</strong></span></span>',
          '<span class="summary-chip"><span>Artigos: <strong>' + items.length + '</strong></span></span>',
          '<span class="summary-chip"><span>Publicados: <strong>' + published + '</strong></span></span>'
        ].join('');
        $('#content').innerHTML = [
          '<div class="quick-actions">',
          '  <button type="button" class="quick-action" data-quick="posts"><strong>Gerenciar artigos</strong><span class="muted">' + items.length + ' itens ativos</span></button>',
          '  <button type="button" class="quick-action" data-quick="editor"><strong>Novo artigo</strong><span class="muted">Publicar conteúdo</span></button>',
          '  <button type="button" class="quick-action" data-quick="media"><strong>Arquivos</strong><span class="muted">' + ((media.items || []).length) + ' mídias</span></button>',
          '  <button type="button" class="quick-action" data-quick="comments"><strong>Comentários</strong><span class="muted">Revisar pendências</span></button>',
          '</div>',
          '<div class="grid">',
          '  <div class="card"><div>Artigos</div><div class="kpi">' + items.length + '</div><div class="metric-delta">' + published + ' publicados</div></div>',
          '  <div class="card"><div>Publicados</div><div class="kpi">' + published + '</div><div class="metric-delta">' + drafts + ' rascunhos</div></div>',
          '  <div class="card"><div>Em revisão</div><div class="kpi">' + reviews + '</div><div class="metric-delta warn">' + Math.max(reviews, 0) + ' esperando aprovação</div></div>',
          '  <div class="card"><div>Mídias</div><div class="kpi">' + ((media.items || []).length) + '</div><div class="metric-delta">Estoque disponível</div></div>',
          '</div>',
          '<div class="summary-row">',
          '  <div class="summary-box"><div class="muted">Visitantes únicos</div><div class="kpi" style="font-size:1.5rem;">' + safeNum(analytics.summary && analytics.summary.unique_visitors, 0) + '</div><div class="metric-delta">Última janela de análise</div></div>',
          '  <div class="summary-box"><div class="muted">Compleções</div><div class="kpi" style="font-size:1.5rem;">' + safeNum(analytics.summary && analytics.summary.completions, 0) + '</div><div class="metric-delta">Leitura concluída</div></div>',
          '  <div class="summary-box"><div class="muted">Eventos</div><div class="kpi" style="font-size:1.5rem;">' + safeNum(analytics.summary && analytics.summary.total_events, 0) + '</div><div class="metric-delta">Atividades registradas</div></div>',
          '</div>',
          '<div class="grid" style="margin-top:16px;">',
          '  <div class="card">',
          '    <h3>Pipeline editorial</h3>',
          '    <div class="pipeline">' + pipeline.map(function (item) {
          var percent = Math.round((item.value / item.total) * 100);
          var barClass = item.kind === 'warning' ? 'progress-bar warning' : (item.kind === 'success' ? 'progress-bar success' : 'progress-bar');
          return '<div class="pipeline-item"><div class="pipeline-head"><span>' + esc(item.label) + '</span><strong>' + item.value + '</strong></div><div class="' + barClass + '"><span style="width:' + percent + '%"></span></div></div>';
        }).join('') + '</div>',
          '  </div>',
          '  <div class="card">',
          '    <h3>Atividade recente</h3>',
          '    <div class="activity-list">' + (recentPosts.length ? recentPosts.map(function (item) {
          return '<div class="activity-item"><span class="activity-dot"></span><div class="activity-copy"><strong>' + esc(item.title || 'Artigo') + '</strong><div class="activity-time">' + esc(item.status || 'draft') + '</div></div><div class="activity-time">' + esc((item.updated_at || '').slice(0, 10) || 'Hoje') + '</div></div>';
        }).join('') : '<div class="empty">Nenhuma atividade recente.</div>') + '</div>',
          '  </div>',
          '</div>',
          '<div class="grid" style="margin-top:16px;">',
          '  <div class="card">',
          '    <h3>Desempenho</h3>',
          '    <div class="performance-chart">' + performanceValues.map(function (item) {
          return '<div class="bar-col"><div class="bar ' + (item.kind === 'warning' ? 'warning' : (item.kind === 'success' ? 'success' : '')) + '" style="height:' + Math.max(18, item.value) + '%"></div><div class="bar-label">' + esc(item.label) + '</div></div>';
        }).join('') + '</div>',
          '  </div>',
          '  <div class="card">',
          '    <h3>Saúde dos módulos</h3>',
          '    <div class="health-grid">',
          '      <div class="health-row"><div class="health-name"><span class="health-bullet"></span>CMS</div><span class="health-score">98%</span></div>',
          '      <div class="health-row"><div class="health-name"><span class="health-bullet"></span>Analytics</div><span class="health-score">94%</span></div>',
          '      <div class="health-row"><div class="health-name"><span class="health-bullet warn"></span>Newsletter</div><span class="health-score">82%</span></div>',
          '      <div class="health-row"><div class="health-name"><span class="health-bullet"></span>Conversão</div><span class="health-score">96%</span></div>',
          '    </div>',
          '  </div>',
          '</div>',
          '<div class="grid" style="margin-top:16px;">',
          '  <div class="card">',
          '    <h3>Top conteúdos</h3>',
          '    <div class="table-wrap"><table class="table"><thead><tr><th>Artigo</th><th>Views</th></tr></thead><tbody>' + ((analytics.popular || []).slice(0, 4).map(function (item) { return '<tr><td>' + esc(item.title) + '</td><td>' + safeNum(item.views, 0) + '</td></tr>'; }).join('') || '<tr><td colspan="2"><div class="empty">Sem dados de performance.</div></td></tr>') + '</tbody></table></div>',
          '  </div>',
          '  <div class="card">',
          '    <h3>Resumo da operação</h3>',
          '    <p class="muted">Artigos e metadados ficam no banco do CMS; arquivos binários usam o bind de mídia quando configurado. O conteúdo do editor é sanitizado no servidor e pronto para publicação.</p>',
          '    <div class="metric-delta success">Fluxo editorial estabilizado</div>',
          '  </div>',
          '</div>'
        ].join('');

        document.querySelectorAll('[data-quick]').forEach(function (button) {
          button.addEventListener('click', function () {
            var target = button.getAttribute('data-quick');
            if (!target) return;
            state.view = target;
            state.editId = null;
            refresh();
          });
        });
      }

      async function posts() {
        var status = 'all';
        var query = '';
        var listUrl = '/admin/blog/posts';
        var data = await api(listUrl);
        $('#title').textContent = 'Gestão de artigos';
        var rows = (data.items || []).map(function (item) {
          return [
            '<tr>',
            '  <td><strong>' + esc(item.title || '') + '</strong></td>',
            '  <td>' + esc(item.category_name || '-') + '</td>',
            '  <td>' + statusBadge(item.status || 'draft') + '</td>',
            '  <td>' + esc(item.updated_at || '-') + '</td>',
            '  <td>',
            '    <div class="toolbar" style="margin:0;">',
            '      <button class="btn" type="button" data-action="edit" data-id="' + esc(item.id || '') + '">Editar</button>',
            '      <button class="btn danger" type="button" data-action="delete" data-id="' + esc(item.id || '') + '">Excluir</button>',
            '    </div>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');

        $('#content').innerHTML = [
          '<div class="card">',
          '  <div class="toolbar" style="justify-content: space-between;">',
          '    <div class="inline-form" style="flex:1;">',
          '      <input type="search" id="post-search" placeholder="Buscar por título ou conteúdo" style="flex:2;" />',
          '      <select id="post-status"><option value="all">Todos</option><option value="draft">Draft</option><option value="review">Review</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select>',
          '    </div>',
          '    <button class="btn primary" type="button" data-nav="editor">+ Novo artigo</button>',
          '  </div>',
          '  <div class="table-wrap">',
          '    <table class="table"><thead><tr><th>Título</th><th>Categoria</th><th>Status</th><th>Atualizado</th><th>Ações</th></tr></thead><tbody>' + (rows || '<tr><td colspan="5"><div class="empty">Nenhum artigo encontrado.</div></td></tr>') + '</tbody></table>',
          '  </div>',
          '</div>'
        ].join('');

        var createButton = document.querySelector('[data-nav="editor"]');
        if (createButton) {
          createButton.addEventListener('click', function () {
            state.view = 'editor';
            state.editId = null;
            refresh();
          });
        }

        var searchInput = document.getElementById('post-search');
        var statusSelect = document.getElementById('post-status');

        function reloadList() {
          var q = (searchInput && searchInput.value || '').trim();
          var s = (statusSelect && statusSelect.value || 'all');
          var params = []; if (s !== 'all') params.push('status=' + encodeURIComponent(s)); if (q) params.push('search=' + encodeURIComponent(q));
          var endpoint = '/admin/blog/posts' + (params.length ? ('?' + params.join('&')) : '');
          api(endpoint).then(function (result) {
            var items = result.items || [];
            var nextRows = items.map(function (item) {
              return [
                '<tr>',
                '  <td><strong>' + esc(item.title || '') + '</strong></td>',
                '  <td>' + esc(item.category_name || '-') + '</td>',
                '  <td>' + statusBadge(item.status || 'draft') + '</td>',
                '  <td>' + esc(item.updated_at || '-') + '</td>',
                '  <td>',
                '    <div class="toolbar" style="margin:0;">',
                '      <button class="btn" type="button" data-action="edit" data-id="' + esc(item.id || '') + '">Editar</button>',
                '      <button class="btn danger" type="button" data-action="delete" data-id="' + esc(item.id || '') + '">Excluir</button>',
                '    </div>',
                '  </td>',
                '</tr>'
              ].join('');
            }).join('');
            var tbody = document.querySelector('#content tbody');
            if (tbody) tbody.innerHTML = nextRows || '<tr><td colspan="5"><div class="empty">Nenhum artigo encontrado.</div></td></tr>';
            bindPostActions();
          }).catch(function (error) {
            window.alert(error && error.message ? error.message : 'Falha ao filtrar artigos.');
          });
        }

        function bindPostActions() {
          document.querySelectorAll('[data-action="edit"]').forEach(function (button) {
            button.addEventListener('click', function () {
              state.editId = button.getAttribute('data-id');
              state.view = 'editor';
              refresh();
            });
          });

          document.querySelectorAll('[data-action="delete"]').forEach(function (button) {
            button.addEventListener('click', async function () {
              var id = button.getAttribute('data-id');
              if (!id) return;
              if (!window.confirm('Excluir este artigo?')) return;
              await api('/admin/blog/posts/' + id, { method: 'DELETE' });
              reloadList();
            });
          });
        }

        bindPostActions();

        if (searchInput) searchInput.addEventListener('input', reloadList);
        if (statusSelect) statusSelect.addEventListener('change', reloadList);
      }

      async function editor() {
        var categories = await api('/blog/categories');
        var item = null;
        if (state.editId) {
          item = await api('/admin/blog/posts/' + state.editId);
          item = item.post || null;
        }

        $('#title').textContent = state.editId ? 'Editar artigo' : 'Novo artigo';
        var catOptions = (categories.items || []).map(function (cat) {
          var selected = item && item.category_id === cat.id ? ' selected' : '';
          return '<option value="' + esc(cat.id) + '"' + selected + '>' + esc(cat.name) + '</option>';
        }).join('');
        if (!catOptions) catOptions = '<option value="">Cadastre uma categoria primeiro</option>';

        $('#content').innerHTML = [
          '<div class="card">',
          '  <div class="toolbar" style="justify-content: space-between; align-items: center;">',
          '    <button class="btn" type="button" data-nav="posts">Voltar para artigos</button>',
          '    <button class="btn primary" type="submit" form="post-form">Salvar artigo</button>',
          '  </div>',
          '  <form id="post-form">',
          '    <div class="field-grid">',
          '      <div class="field"><label>Título</label><input name="title" value="' + esc(item ? item.title || '' : '') + '" required /></div>',
          '      <div class="field"><label>Slug</label><input name="slug" value="' + esc(item ? item.slug || '' : '') + '" /></div>',
          '      <div class="field"><label>Categoria</label><select name="category_id">' + catOptions + '</select></div>',
          '      <div class="field"><label>Status</label><select name="status"><option value="draft"' + (!item || item.status === 'draft' ? ' selected' : '') + '>draft</option><option value="review"' + (item && item.status === 'review' ? ' selected' : '') + '>review</option><option value="published"' + (item && item.status === 'published' ? ' selected' : '') + '>published</option><option value="archived"' + (item && item.status === 'archived' ? ' selected' : '') + '>archived</option></select></div>',
          '      <div class="field" style="grid-column:1 / -1;"><label>Resumo</label><textarea name="excerpt" rows="3">' + esc(item ? item.excerpt || '' : '') + '</textarea></div>',
          '      <div class="field" style="grid-column:1 / -1;"><label>HTML do conteúdo</label><textarea name="content_html" rows="12">' + esc(item ? item.content_html || '' : '') + '</textarea></div>',
          '      <div class="field"><label>Imagem destacada</label><input name="featured_image" value="' + esc(item ? item.featured_image || '' : '') + '" /></div>',
          '      <div class="field"><label>SEO title</label><input name="seo_title" value="' + esc(item ? item.seo_title || '' : '') + '" /></div>',
          '      <div class="field" style="grid-column:1 / -1;"><label>SEO description</label><textarea name="seo_description" rows="3">' + esc(item ? item.seo_description || '' : '') + '</textarea></div>',
          '    </div>',
          '  </form>',
          '</div>'
        ].join('');

        var backButton = document.querySelector('[data-nav="posts"]');
        if (backButton) {
          backButton.addEventListener('click', function () {
            state.view = 'posts';
            state.editId = null;
            refresh();
          });
        }

        var form = document.getElementById('post-form');
        if (form) {
          form.addEventListener('submit', async function (event) {
            event.preventDefault();
            var data = new FormData(form);
            var payload = {
              title: String(data.get('title') || '').trim(),
              slug: String(data.get('slug') || '').trim(),
              excerpt: String(data.get('excerpt') || '').trim(),
              category_id: String(data.get('category_id') || '').trim(),
              status: String(data.get('status') || 'draft'),
              content_html: String(data.get('content_html') || '').trim(),
              featured_image: String(data.get('featured_image') || '').trim(),
              seo_title: String(data.get('seo_title') || '').trim(),
              seo_description: String(data.get('seo_description') || '').trim()
            };
            if (!payload.title || !payload.category_id || !payload.content_html) {
              window.alert('Título, categoria e conteúdo são obrigatórios.');
              return;
            }
            try {
              if (state.editId) {
                await api('/admin/blog/posts/' + state.editId, { method: 'PUT', body: JSON.stringify(payload) });
              } else {
                await api('/admin/blog/posts', { method: 'POST', body: JSON.stringify(payload) });
              }
              state.editId = null;
              state.view = 'posts';
              refresh();
            } catch (error) {
              window.alert(error && error.message ? error.message : 'Não foi possível salvar o artigo.');
            }
          });
        }
      }

      async function media() {
        var data = await api('/admin/media');
        $('#title').textContent = 'Biblioteca de mídia';
        var items = (data.items || []).map(function (item) {
          var label = item.title || item.storage_key || item.id || 'Arquivo';
          return [
            '<div class="media-item">',
            '  <div class="thumb">IMG</div>',
            '  <div class="meta">',
            '    <div><strong>' + esc(label) + '</strong></div>',
            '    <div class="muted">' + esc(item.mime_type || 'Arquivo') + '</div>',
            '    <div class="muted">' + esc(item.created_at || '-') + '</div>',
            '  </div>',
            '</div>'
          ].join('');
        }).join('');

        $('#content').innerHTML = [
          '<div class="card">',
          '  <form id="media-form" class="toolbar" enctype="multipart/form-data">',
          '    <input type="file" name="file" required style="flex:1; min-width:220px;" />',
          '    <input type="text" name="title" placeholder="Título da mídia" style="flex:1; min-width:180px;" />',
          '    <input type="text" name="alt_text" placeholder="Texto alternativo" style="flex:1; min-width:180px;" />',
          '    <button class="btn primary" type="submit">Enviar</button>',
          '  </form>',
          '  <div class="media-grid">' + (items || '<div class="empty">Nenhuma mídia cadastrada.</div>') + '</div>',
          '</div>'
        ].join('');

        var form = document.getElementById('media-form');
        if (form) {
          form.addEventListener('submit', async function (event) {
            event.preventDefault();
            var formData = new FormData(form);
            var file = formData.get('file');
            if (!file || file.size === 0) {
              window.alert('Selecione um arquivo para enviar.');
              return;
            }
            try {
              await fetch('/api/admin/media', { method: 'POST', credentials: 'same-origin', body: formData });
              media();
            } catch (error) {
              window.alert(error && error.message ? error.message : 'Não foi possível enviar a mídia.');
            }
          });
        }
      }

      async function cats() {
        var categories = await api('/blog/categories');
        $('#title').textContent = 'Categorias';
        var rows = (categories.items || []).map(function (item) {
          return [
            '<tr>',
            '  <td>' + esc(item.name) + '</td>',
            '  <td>' + esc(item.slug) + '</td>',
            '  <td>' + esc(item.description || '-') + '</td>',
            '  <td><button class="btn danger" type="button" data-category-id="' + esc(item.id) + '">Excluir</button></td>',
            '</tr>'
          ].join('');
        }).join('');
        $('#content').innerHTML = [
          '<div class="card">',
          '  <form id="category-form" class="inline-form">',
          '    <input name="name" placeholder="Nome da categoria" required />',
          '    <input name="slug" placeholder="slug" />',
          '    <button class="btn primary" type="submit">Adicionar</button>',
          '  </form>',
          '  <div class="table-wrap" style="margin-top:18px;">',
          '    <table class="table"><thead><tr><th>Nome</th><th>Slug</th><th>Descrição</th><th>Ações</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4"><div class="empty">Nenhuma categoria cadastrada.</div></td></tr>') + '</tbody></table>',
          '  </div>',
          '</div>'
        ].join('');

        var form = document.getElementById('category-form');
        if (form) {
          form.addEventListener('submit', async function (event) {
            event.preventDefault();
            var data = new FormData(form);
            var payload = { name: String(data.get('name') || '').trim(), slug: String(data.get('slug') || '').trim() };
            if (!payload.name) return;
            try {
              await api('/admin/blog/categories', { method: 'POST', body: JSON.stringify(payload) });
              cats();
            } catch (error) {
              window.alert(error && error.message ? error.message : 'Não foi possível criar a categoria.');
            }
          });
        }

        document.querySelectorAll('[data-category-id]').forEach(function (button) {
          button.addEventListener('click', async function () {
            var id = button.getAttribute('data-category-id');
            if (!id) return;
            if (!window.confirm('Excluir esta categoria?')) return;
            await api('/admin/blog/categories/' + id, { method: 'DELETE' });
            cats();
          });
        });
      }

      async function comments() {
        var status = 'all';
        var data = await api('/admin/editorial/comments' + (status === 'all' ? '' : '?status=' + status));
        $('#title').textContent = 'Comentários';
        var rows = (data.items || []).map(function (item) {
          return [
            '<tr>',
            '  <td>' + esc(item.name) + '</td>',
            '  <td>' + esc(item.post_title || item.post_slug || '-') + '</td>',
            '  <td>' + statusBadge(item.status || 'pending') + '</td>',
            '  <td>' + esc(item.created_at) + '</td>',
            '  <td>',
            '    <div class="toolbar" style="margin:0;">',
            '      <button class="btn" type="button" data-comment-id="' + esc(item.id) + '" data-status="approved">Aprovar</button>',
            '      <button class="btn danger" type="button" data-comment-id="' + esc(item.id) + '" data-status="rejected">Rejeitar</button>',
            '    </div>',
            '  </td>',
            '</tr>'
          ].join('');
        }).join('');

        $('#content').innerHTML = [
          '<div class="card">',
          '  <div class="toolbar">',
          '    <select id="comment-status"><option value="all">Todos</option><option value="pending">Pendentes</option><option value="approved">Aprovados</option><option value="spam">Spam</option><option value="rejected">Rejeitados</option></select>',
          '  </div>',
          '  <div class="table-wrap"><table class="table"><thead><tr><th>Autor</th><th>Post</th><th>Status</th><th>Data</th><th>Ações</th></tr></thead><tbody>' + (rows || '<tr><td colspan="5"><div class="empty">Nenhum comentário encontrado.</div></td></tr>') + '</tbody></table></div>',
          '</div>'
        ].join('');

        document.querySelectorAll('[data-comment-id]').forEach(function (button) {
          button.addEventListener('click', async function () {
            var id = button.getAttribute('data-comment-id');
            var nextStatus = button.getAttribute('data-status');
            if (!id || !nextStatus) return;
            await api('/admin/editorial/comments/' + id, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) });
            comments();
          });
        });

        var filter = document.getElementById('comment-status');
        if (filter) {
          filter.addEventListener('change', async function () {
            var value = filter.value || 'all';
            var endpoint = '/admin/editorial/comments' + (value === 'all' ? '' : '?status=' + encodeURIComponent(value));
            var data = await api(endpoint);
            var rows = (data.items || []).map(function (item) {
              return [
                '<tr>',
                '  <td>' + esc(item.name) + '</td>',
                '  <td>' + esc(item.post_title || item.post_slug || '-') + '</td>',
                '  <td>' + statusBadge(item.status || 'pending') + '</td>',
                '  <td>' + esc(item.created_at) + '</td>',
                '  <td>',
                '    <div class="toolbar" style="margin:0;">',
                '      <button class="btn" type="button" data-comment-id="' + esc(item.id) + '" data-status="approved">Aprovar</button>',
                '      <button class="btn danger" type="button" data-comment-id="' + esc(item.id) + '" data-status="rejected">Rejeitar</button>',
                '    </div>',
                '  </td>',
                '</tr>'
              ].join('');
            }).join('');
            var tbody = document.querySelector('#content tbody');
            if (tbody) tbody.innerHTML = rows || '<tr><td colspan="5"><div class="empty">Nenhum comentário encontrado.</div></td></tr>';
            document.querySelectorAll('[data-comment-id]').forEach(function (button) {
              button.addEventListener('click', async function () {
                var id = button.getAttribute('data-comment-id');
                var nextStatus = button.getAttribute('data-status');
                if (!id || !nextStatus) return;
                await api('/admin/editorial/comments/' + id, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) });
                comments();
              });
            });
          });
        }
      }

      async function newsletter() {
        var data = await api('/admin/editorial/newsletter');
        $('#title').textContent = 'Newsletter';
        var rows = (data.items || []).map(function (item) {
          return '<tr><td>' + esc(item.email) + '</td><td>' + statusBadge(item.status || 'subscribed') + '</td><td>' + esc(item.source || '-') + '</td><td>' + esc(item.created_at) + '</td></tr>';
        }).join('');
        $('#content').innerHTML = '<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Email</th><th>Status</th><th>Origem</th><th>Data</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4"><div class="empty">Nenhum assinante encontrado.</div></td></tr>') + '</tbody></table></div></div>';
      }

      async function analytics() {
        var data = await api('/admin/analytics/editorial');
        $('#title').textContent = 'Analytics editorial';
        var popular = (data.popular || []).map(function (item) {
          return '<tr><td>' + esc(item.title) + '</td><td>' + esc(item.category_name || '-') + '</td><td>' + safeNum(item.views, 0) + '</td><td>' + safeNum(item.avg_progress, 0).toFixed(1) + '%</td></tr>';
        }).join('');
        $('#content').innerHTML = [
          '<div class="grid">',
          '  <div class="card"><div>Eventos</div><div class="kpi">' + safeNum(data.summary && data.summary.total_events, 0) + '</div></div>',
          '  <div class="card"><div>Visitantes</div><div class="kpi">' + safeNum(data.summary && data.summary.unique_visitors, 0) + '</div></div>',
          '  <div class="card"><div>Compleções</div><div class="kpi">' + safeNum(data.summary && data.summary.completions, 0) + '</div></div>',
          '  <div class="card"><div>Progresso médio</div><div class="kpi">' + (safeNum(data.summary && data.summary.avg_progress, 0).toFixed(1) + '%') + '</div></div>',
          '</div>',
          '<div class="card" style="margin-top:16px;">',
          '  <h3>Conteúdos mais lidos</h3>',
          '  <div class="table-wrap"><table class="table"><thead><tr><th>Artigo</th><th>Categoria</th><th>Views</th><th>Leitura</th></tr></thead><tbody>' + (popular || '<tr><td colspan="4"><div class="empty">Sem dados ainda.</div></td></tr>') + '</tbody></table></div>',
          '</div>'
        ].join('');
      }

      async function conversion() {
        var dashboard = await api('/admin/conversion/dashboard');
        var magnets = await api('/admin/conversion/lead-magnets');
        var ctas = await api('/admin/conversion/ctas');
        $('#title').textContent = 'Conversão';
        var magnetRows = (magnets.items || []).map(function (item) {
          return '<tr><td>' + esc(item.title) + '</td><td>' + esc(item.slug) + '</td><td>' + esc(item.category_slug || '-') + '</td></tr>';
        }).join('');
        var ctaRows = (ctas.items || []).map(function (item) {
          return '<tr><td>' + esc(item.title) + '</td><td>' + esc(item.destination || '-') + '</td><td>' + esc(item.priority || 0) + '</td></tr>';
        }).join('');
        $('#content').innerHTML = [
          '<div class="grid">',
          '  <div class="card"><div>Impressões CTA</div><div class="kpi">' + safeNum(dashboard.summary && dashboard.summary.cta_impressions, 0) + '</div></div>',
          '  <div class="card"><div>Cliques</div><div class="kpi">' + safeNum(dashboard.summary && dashboard.summary.cta_clicks, 0) + '</div></div>',
          '  <div class="card"><div>Downloads</div><div class="kpi">' + safeNum(dashboard.summary && dashboard.summary.magnet_downloads, 0) + '</div></div>',
          '  <div class="card"><div>Leads</div><div class="kpi">' + safeNum(dashboard.summary && dashboard.summary.leads, 0) + '</div></div>',
          '</div>',
          '<div class="grid" style="margin-top:16px;">',
          '  <div class="card"><h3>Lead magnets</h3><div class="table-wrap"><table class="table"><thead><tr><th>Nome</th><th>Slug</th><th>Categoria</th></tr></thead><tbody>' + (magnetRows || '<tr><td colspan="3"><div class="empty">Nenhum lead magnet.</div></td></tr>') + '</tbody></table></div></div>',
          '  <div class="card"><h3>CTAs</h3><div class="table-wrap"><table class="table"><thead><tr><th>CTA</th><th>Destino</th><th>Prioridade</th></tr></thead><tbody>' + (ctaRows || '<tr><td colspan="3"><div class="empty">Nenhum CTA.</div></td></tr>') + '</tbody></table></div></div>',
          '</div>'
        ].join('');
      }

      async function users() {
        var data = await api('/admin/users');
        $('#title').textContent = 'Usuários';
        var rows = (data.items || []).map(function (item) {
          return [
            '<tr>',
            '  <td>' + esc(item.name) + '</td>',
            '  <td>' + esc(item.email) + '</td>',
            '  <td>' + esc(item.role) + '</td>',
            '  <td>' + (item.active ? 'Ativo' : 'Inativo') + '</td>',
            '  <td><button class="btn" type="button" data-user-toggle="' + esc(item.id) + '" data-user-active="' + (item.active ? 'false' : 'true') + '">' + (item.active ? 'Desativar' : 'Ativar') + '</button></td>',
            '</tr>'
          ].join('');
        }).join('');
        $('#content').innerHTML = [
          '<div class="card">',
          '  <form id="user-form" class="inline-form">',
          '    <input name="name" placeholder="Nome" required />',
          '    <input name="email" type="email" placeholder="Email" required />',
          '    <input name="password" type="password" placeholder="Senha inicial" required />',
          '    <select name="role"><option value="editor">editor</option><option value="sales">sales</option><option value="ops">ops</option><option value="finance">finance</option><option value="admin">admin</option><option value="owner">owner</option></select>',
          '    <button class="btn primary" type="submit">Criar usuário</button>',
          '  </form>',
          '  <div class="table-wrap" style="margin-top:18px;">',
          '    <table class="table"><thead><tr><th>Nome</th><th>Email</th><th>Perfil</th><th>Status</th><th>Ações</th></tr></thead><tbody>' + (rows || '<tr><td colspan="5"><div class="empty">Nenhum usuário cadastrado.</div></td></tr>') + '</tbody></table>',
          '  </div>',
          '</div>'
        ].join('');

        var form = document.getElementById('user-form');
        if (form) {
          form.addEventListener('submit', async function (event) {
            event.preventDefault();
            var data = new FormData(form);
            var payload = {
              name: String(data.get('name') || '').trim(),
              email: String(data.get('email') || '').trim(),
              password: String(data.get('password') || ''),
              role: String(data.get('role') || 'editor')
            };
            await api('/admin/users', { method: 'POST', body: JSON.stringify(payload) });
            users();
          });
        }

        document.querySelectorAll('[data-user-toggle]').forEach(function (button) {
          button.addEventListener('click', async function () {
            var id = button.getAttribute('data-user-toggle');
            var active = button.getAttribute('data-user-active') === 'true';
            if (!id) return;
            await api('/admin/users/' + id, { method: 'PATCH', body: JSON.stringify({ active: active }) });
            users();
          });
        });
      }

      async function events() {
        var data = await api('/os/events');
        $('#title').textContent = 'Eventos';
        var rows = (data.items || []).map(function (item) {
          return '<tr><td>' + esc(item.event_name) + '</td><td>' + esc(item.aggregate_type || '-') + '</td><td>' + esc(item.aggregate_id || '-') + '</td><td>' + esc(item.created_at) + '</td></tr>';
        }).join('');
        $('#content').innerHTML = '<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Evento</th><th>Aggregate</th><th>ID</th><th>Data</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4"><div class="empty">Nenhum evento registrado.</div></td></tr>') + '</tbody></table></div></div>';
      }

      async function workflows() {
        var data = await api('/os/workflows');
        $('#title').textContent = 'Workflows';
        var rows = (data.items || []).map(function (item) {
          return '<tr><td>' + esc(item.workflow_id) + '</td><td>' + esc(item.status) + '</td><td>' + safeNum(item.attempts, 0) + '</td><td>' + esc(item.created_at) + '</td></tr>';
        }).join('');
        $('#content').innerHTML = '<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Workflow</th><th>Status</th><th>Attempts</th><th>Criado</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4"><div class="empty">Nenhum workflow executado.</div></td></tr>') + '</tbody></table></div></div>';
      }

      async function audit() {
        var data = await api('/os/audit');
        $('#title').textContent = 'Auditoria';
        var rows = (data.items || []).map(function (item) {
          return '<tr><td>' + esc(item.action) + '</td><td>' + esc(item.resource_type || '-') + '</td><td>' + esc(item.resource_id || '-') + '</td><td>' + esc(item.created_at) + '</td></tr>';
        }).join('');
        $('#content').innerHTML = '<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Ação</th><th>Recurso</th><th>ID</th><th>Data</th></tr></thead><tbody>' + (rows || '<tr><td colspan="4"><div class="empty">Nenhum registro de auditoria.</div></td></tr>') + '</tbody></table></div></div>';
      }

      document.addEventListener('DOMContentLoaded', function () {
        shell();
      });
    </script>
  </body>
</html>
`;

export default adminPage;
