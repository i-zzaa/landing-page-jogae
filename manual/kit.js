/* Kit do manual do Desafiaê (derivado do kit dos protótipos): cabeçalho da página, troca celular/navegador,
   barra de status, barra de abas, menu do painel web e ícones lucide. */
(function () {
  var FLUXOS = {
    arena: [
      ['entrar', 'Entrar e recuperar a senha'],
      ['cadastro', 'Cadastrar sua arena'],
      ['painel', 'Painel do dia'],
      ['agenda', 'Agenda, reservas e horário relâmpago'],
      ['quadras', 'Quadras e preços'],
      ['aulas', 'Aulas e check-in'],
      ['mensalidade', 'Planos de alunos e mensalidade'],
      ['atletas', 'Meus atletas e vínculos'],
      ['torneio', 'Torneios'],
      ['desafio-arena', 'Desafiar outra arena'],
      ['desafio-recorrente', 'Desafio recorrente'],
      ['temporada', 'Temporada (circuito)'],
      ['eventos-partidas', 'Eventos e partidas'],
      ['chat', 'Chat das partidas'],
      ['financeiro', 'Financeiro e Mercado Pago'],
      ['analitico', 'Analytics'],
      ['agregadores', 'TotalPass e Wellhub'],
      ['perfil', 'Perfil, serviços e modalidades'],
      ['assinatura', 'Assinatura da arena'],
    ],
    jogador: [
      ['cadastro', 'Criar sua conta'],
      ['entrar', 'Entrar e recuperar a senha'],
      ['inicio', 'Conhecer o Início'],
      ['desafio', 'Desafiar alguém'],
      ['rival', 'Rival da semana'],
      ['desafio-marca', 'Desafio de marca'],
      ['recordes', 'Recordes e relógio'],
      ['partida', 'Partida, placar e craque do jogo'],
      ['chat', 'Chat da partida'],
      ['torneio', 'Jogar um torneio'],
      ['desafio-recorrente', 'Desafio recorrente'],
      ['temporada', 'Temporada (circuito)'],
      ['reserva-quadra', 'Reservar quadra e horário relâmpago'],
      ['aulas', 'Aulas e mensalidade'],
      ['ranking-perfil', 'Ranking, estatísticas e perfil'],
      ['planos', 'Planos Premium e Elite'],
      ['nivel-validado', 'Nível validado'],
      ['notificacoes', 'Notificações e lembretes'],
      ['conta', 'Conta e configurações'],
    ],
  };
  var ROTULOS = { arena: 'Arena', jogador: 'Jogador' };
  window.MANUAL_FLUXOS = FLUXOS;

  var ABAS = {
    jogador: [['inicio', 'Início', 'house'], ['esportes', 'Esportes', 'volleyball'], ['fab', 'Criar'], ['ranking', 'Ranking', 'trophy'], ['perfil', 'Perfil', 'user']],
    'jogador-aulas': [['inicio', 'Início', 'house'], ['esportes', 'Esportes', 'volleyball'], ['fab', 'Criar'], ['aulas', 'Aulas', 'calendar-clock'], ['perfil', 'Perfil', 'user']],
    arena: [['painel', 'Painel', 'layout-dashboard'], ['jogos', 'Jogos', 'volleyball'], ['fab', 'Agendar'], ['calendario', 'Calendário', 'calendar'], ['ajustes', 'Ajustes', 'settings']],
  };

  var AREAS = [
    ['painel', 'Painel', 'layout-dashboard', ['Início', 'Jogos', 'Mensagens', 'Notificações', 'Lembretes']],
    ['agenda', 'Agenda', 'calendar-days', ['Calendário', 'Reservas', 'Aulas', 'Horário fixo', 'Ofertas relâmpago']],
    ['competicoes', 'Disputas', 'trophy', ['Torneios', 'Temporadas', 'Desafios de arena', 'Desafio recorrente']],
    ['pessoas', 'Pessoas', 'users', ['Meus atletas', 'Usuários vinculados', 'Planos de alunos', 'Modalidades e níveis', 'Aprovações de nível', 'Pedidos de vínculo']],
    ['arena', 'Arena', 'store', ['Perfil da arena', 'Quadras', 'Serviços e estrutura']],
    ['dinheiro', 'Dinheiro', 'wallet', ['Financeiro', 'Analytics', 'Minha assinatura', 'Mercado Pago', 'Agregadores']],
  ];

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function ic(name, cls) { return '<i data-lucide="' + name + '"' + (cls ? ' class="' + cls + '"' : '') + '></i>'; }

  /* cabeçalho da página: <header id="proto" data-lado="arena" data-fluxo="torneio"> */
  function montaTopo() {
    var h = document.getElementById('proto');
    if (!h) return;
    var lado = h.dataset.lado, slug = h.dataset.fluxo;
    var lista = FLUXOS[lado] || [], i = lista.findIndex(function (f) { return f[0] === slug; });
    var nome = i >= 0 ? lista[i][1] : '';
    var ant = i > 0 ? lista[i - 1] : null, prox = i >= 0 && i < lista.length - 1 ? lista[i + 1] : null;
    h.className = 'topo';
    h.innerHTML = '<img src="../img/logo-simbolo-laranja.png" alt="">' +
      '<nav class="migalha"><a href="../index.html">Manual</a><span>/</span><a href="../index.html#' + lado + '">' + ROTULOS[lado] + '</a><span>/</span><span>' + nome + '</span></nav>' +
      '<div class="anda">' + (ant ? '<a href="' + ant[0] + '.html">← ' + ant[1] + '</a>' : '') + (prox ? '<a href="' + prox[0] + '.html">' + prox[1] + ' →</a>' : '') + '</div>';
    var eyebrow = document.querySelector('.intro .lado');
    if (eyebrow && !eyebrow.textContent.trim()) eyebrow.textContent = ROTULOS[lado];
    if (!document.title) document.title = nome + ' · Desafiaê';
  }

  /* troca celular/navegador entre as seções .trilho-fluxo[data-plataforma] */
  function montaPlataforma() {
    var secoes = document.querySelectorAll('.trilho-fluxo[data-plataforma]');
    var alvo = document.querySelector('.plataforma');
    if (!alvo || secoes.length < 2) { if (alvo) alvo.hidden = true; return; }
    var chave = 'manual-plataforma', atual = 'celular';
    try { atual = localStorage.getItem(chave) || 'celular'; } catch (e) {}
    var rot = { celular: ['smartphone', 'Celular'], navegador: ['monitor', 'Navegador'] };
    alvo.innerHTML = '';
    secoes.forEach(function (s) {
      var p = s.dataset.plataforma, b = el('button', null, ic(rot[p][0]) + rot[p][1]);
      b.type = 'button'; b.dataset.p = p;
      b.addEventListener('click', function () { mostra(p); try { localStorage.setItem(chave, p); } catch (e) {} });
      alvo.appendChild(b);
    });
    function mostra(p) {
      if (!document.querySelector('.trilho-fluxo[data-plataforma="' + p + '"]')) p = secoes[0].dataset.plataforma;
      secoes.forEach(function (s) { s.hidden = s.dataset.plataforma !== p; });
      alvo.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.p === p)); });
      requestAnimationFrame(desenhaFios);
    }
    mostra(atual);
  }

  /* setas entre passos: <div class="seta"></div> */
  function montaSetas() { document.querySelectorAll('.seta:empty').forEach(function (s) { s.innerHTML = ic('arrow-right'); }); }

  /* barra de status em cada .screen (pule com data-sem-status; data-status="inversa" pra texto branco) */
  function montaStatus() {
    document.querySelectorAll('.phone > .screen').forEach(function (s) {
      if (s.hasAttribute('data-sem-status') || s.parentElement.classList.contains('print') || s.querySelector(':scope > .statusbar')) return;
      var sb = el('div', 'statusbar' + (s.dataset.status === 'inversa' ? ' inversa' : ''), '<span>9:41</span><span class="sb-ic">' + ic('signal') + ic('wifi') + ic('battery-full') + '</span>');
      s.insertBefore(sb, s.firstChild);
      s.appendChild(el('div', 'home-ind'));
    });
  }

  /* <div class="tabbar" data-abas="jogador|jogador-aulas|arena" data-ativa="inicio"></div> */
  function montaAbas() {
    document.querySelectorAll('.tabbar[data-abas]').forEach(function (t) {
      var abas = ABAS[t.dataset.abas] || [], ativa = t.dataset.ativa, html = '';
      abas.forEach(function (a) {
        if (a[0] === 'fab') html += '<div class="slot"><div class="fab-anel"><div class="fab">' + ic('plus', 'ic24') + '</div></div></div>';
        else html += '<div class="slot"><div class="item' + (a[0] === ativa ? ' ativo' : '') + '">' + ic(a[2]) + a[1] + '</div></div>';
      });
      t.innerHTML = html;
    });
  }

  /* <div class="shell" data-area="competicoes" data-item="Torneios"><div class="shell-conteudo">…</div></div> */
  function montaShell() {
    document.querySelectorAll('.shell[data-area]').forEach(function (sh) {
      var areaAtiva = sh.dataset.area, itemAtivo = sh.dataset.item, area = AREAS.find(function (a) { return a[0] === areaAtiva; }) || AREAS[0];
      var menu = el('div', 'shell-menu');
      var tr = el('div', 'shell-trilho', '<img class="logo" src="../img/logo-simbolo-laranja.png" alt="">');
      AREAS.forEach(function (a) { tr.appendChild(el('div', 'it' + (a[0] === area[0] ? ' ativo' : ''), ic(a[2]) + a[1])); });
      tr.appendChild(el('div', 'esp'));
      tr.appendChild(el('div', 'it' + (areaAtiva === 'ajustes' ? ' ativo' : ''), ic('settings') + 'Ajustes'));
      var sub = el('div', 'shell-sub', '<h3>' + (areaAtiva === 'ajustes' ? 'Ajustes' : area[1]) + '</h3>');
      (areaAtiva === 'ajustes' ? ['Ajustes'] : area[3]).forEach(function (n) { sub.appendChild(el('div', 'it' + (n === itemAtivo ? ' ativo' : ''), n)); });
      menu.appendChild(tr); menu.appendChild(sub);
      menu.insertAdjacentHTML('beforeend', '<svg class="shell-fio"></svg>');
      sh.insertBefore(menu, sh.firstChild);
    });
  }

  /* fio Bézier laranja-pêssego do ícone aceso do trilho até o item aceso do submenu */
  function desenhaFios() {
    document.querySelectorAll('.shell-menu').forEach(function (m) {
      var svg = m.querySelector('.shell-fio'), a = m.querySelector('.shell-trilho .it.ativo'), b = m.querySelector('.shell-sub .it.ativo');
      if (!svg || !a || !b || !m.offsetParent) return;
      var y1 = a.offsetTop + a.offsetHeight / 2, x1 = a.offsetLeft + a.offsetWidth, y2 = b.offsetTop + b.offsetHeight / 2, x2 = 80 + 12;
      var mx = (x1 + x2) / 2;
      svg.setAttribute('width', m.offsetWidth); svg.setAttribute('height', m.offsetHeight);
      svg.innerHTML = '<path d="M' + x1 + ' ' + y1 + ' C' + mx + ' ' + y1 + ' ' + mx + ' ' + y2 + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="#fed0b0" stroke-width="2"/>';
    });
  }

  /* rodapé: dúvida que o manual não respondeu vai pro suporte */
  function montaRodape() {
    if (!document.getElementById('proto')) return;
    var f = el('footer', 'rodape-manual', '<p>Ficou alguma dúvida? Escreva para <a href="mailto:suporte@desafiae.com">suporte@desafiae.com</a>.</p><a class="volta" href="../index.html">' + ic('arrow-left') + 'Voltar ao manual</a>');
    document.body.appendChild(f);
  }

  function iniciar() {
    montaTopo(); montaRodape(); montaSetas(); montaStatus(); montaAbas(); montaShell();
    montaPlataforma();
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
    requestAnimationFrame(desenhaFios);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenhaFios);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
