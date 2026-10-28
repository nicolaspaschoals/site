(() => {
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
  const page = location.pathname.replace(/\/$/, "") === "/investimento" ? "investment" : "home";
  const validUrl = (value) => /^(https:\/\/|mailto:|tel:|\/(?!\/)|#)/.test(value || "");
  const render = (template, content) => {
    let html = template.replace(/@@([\w]+)@@/g, (_, key) => escapeHtml(content.fields[key]));
    const films = content.films.filter((film) => film.visible !== false).map((film) => ({
      ...film,
      type: film.eps.length > 1 ? "series" : "film",
      label: film.eps.length > 1 ? "UMA HISTÓRIA EM CAPÍTULOS" : "FILME DE CASAMENTO",
      meta: film.eps.length > 1 ? `${film.eps.length} capítulos` : film.eps[0].duration,
      img: film.eps[0].video,
    }));
    html = html.replace("__FILMS__", JSON.stringify(films).replace(/</g, "\\u003c"));
    html = html.replaceAll("5512988274244", content.settings.whatsapp);
    html = html.replace("</head>", `<style>:root{--bg:${content.settings.background};--paper:${content.settings.text};--accent:${content.settings.accent}}body{background:var(--bg)}</style></head>`);
    if (page === "home" && content.settings.heroMedia === "video" && validUrl(content.settings.heroVideo)) {
      const video = `<video class="hero-video" muted playsinline loop preload="metadata" aria-hidden="true"><source src="${escapeHtml(content.settings.heroVideo)}" type="video/mp4"></video><button id="hero-video-toggle" type="button" aria-label="Reproduzir vídeo de fundo">▶ Reproduzir fundo</button>`;
      html = html.replace('<div class="hero-copy">', `${video}<div class="hero-copy">`);
      html = html.replace("</head>", `<style>.hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.68) saturate(.65)}#hero-video-toggle{position:absolute;right:5%;top:125px;z-index:3;border:1px solid #ffffff60;background:#10111090;color:white;border-radius:25px;padding:10px 15px;font-size:11px}.hero-video:not(.playing){opacity:0}</style></head>`);
      html = html.replace("</body>", `<script>(()=>{const v=document.querySelector('.hero-video'),b=document.querySelector('#hero-video-toggle');const update=()=>{b.textContent=v.paused?'▶ Reproduzir fundo':'Ⅱ Pausar fundo'};v.addEventListener('playing',()=>{v.classList.add('playing');update()});v.addEventListener('pause',update);b.onclick=()=>v.paused?v.play().catch(()=>{}):v.pause();if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.connection?.saveData)v.play().catch(()=>{});})();<\/script></body>`);
    }
    return html;
  };
  Promise.all([fetch("/api/public/content"), fetch("/assets/templates.json")])
    .then(async ([contentResponse, templatesResponse]) => {
      if (!contentResponse.ok || !templatesResponse.ok) throw new Error("Falha ao carregar o site.");
      const [{ published }, templates] = await Promise.all([contentResponse.json(), templatesResponse.json()]);
      document.open(); document.write(render(templates[page], published)); document.close();
    })
    .catch(() => { document.body.innerHTML = "<p>Não foi possível carregar o site. Tente novamente em instantes.</p>"; });
})();
