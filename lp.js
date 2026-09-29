/* Landing do Desafiaê: modalidades, calculadora da /arena, menu do celular e
   animações. Roda antes do bracket-live.js. */
(function () {
  /* formato = players_per_match / 2; placar = sports.scoring_rules
     (mesmos dados do script.js da landing de hoje) */
  var SPORTS = [
    { n: 'Futebol', f: '11x11', placar: 'Placar de gols', empate: 'Permitido em liga. No mata-mata, vai para os pênaltis.' },
    { n: 'Futevôlei', f: '2x2', placar: '1 set até 18 pontos, com 2 de vantagem', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Beach Tennis', f: '2x2', placar: '1 set de 6 games', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Vôlei', f: '2x2', placar: 'Melhor de 3 sets até 21 pontos; o 3º vai até 15', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Basquete', f: '5x5', placar: 'Placar de pontos', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Tênis', f: '1x1', placar: 'Melhor de 3 sets; super tie-break até 10 no set decisivo', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Padel', f: '2x2', placar: 'Melhor de 3 sets; super tie-break até 10 no set decisivo', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Corrida', marca: true, como: 'Cada um corre por si, onde e quando quiser, e lança o próprio tempo.', formatos: '3 km, 5 km, 10 km, meia maratona ou maratona', vence: 'O menor tempo lançado até a data limite.' },
    { n: 'Futsal', f: '5x5', placar: 'Placar de gols', empate: 'Permitido em liga. No mata-mata, vai para os pênaltis.' },
    { n: 'Futebol Society', f: '7x7', placar: 'Placar de gols', empate: 'Permitido em liga. No mata-mata, vai para os pênaltis.' },
    { n: 'Vôlei de Quadra', f: '6x6', placar: 'Melhor de 5 sets até 25 pontos; o 5º vai até 15', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Basquete 3x3', f: '3x3', placar: 'Placar de pontos', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Handebol', f: '7x7', placar: 'Placar de gols', empate: 'Permitido em liga. No mata-mata, vai para os pênaltis.' },
    { n: 'Pickleball', f: '2x2', placar: '1 set até 11 pontos, com 2 de vantagem', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Squash', f: '1x1', placar: 'Melhor de 3 sets até 11 pontos, com 2 de vantagem', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Tênis de Mesa', f: '1x1', placar: 'Melhor de 5 sets até 11 pontos, com 2 de vantagem', empate: 'Não existe: todo jogo tem vencedor.' },
    { n: 'Hyrox', marca: true, como: 'Cada um faz a prova por si, onde e quando quiser, e lança o próprio tempo.', formatos: 'Individual Open, Individual Pro ou simulado', vence: 'O menor tempo lançado até a data limite.' },
    { n: 'CrossFit', marca: true, como: 'Todo mundo faz o mesmo WOD e lança a própria marca.', formatos: 'For Time, AMRAP ou carga máxima', vence: 'A melhor marca. Quem fez RX fica na frente de quem fez Scaled.' },
  ];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function modalidades(root) {
    var chips = root.querySelector('[data-lp="chips"]'), ficha = root.querySelector('[data-lp="ficha"]');
    var faixa = root.querySelector('[data-lp="faixa"]');
    if (faixa) {
      var nomes = SPORTS.map(function (s) { return '<span>' + esc(s.n) + '</span>'; }).join('');
      faixa.innerHTML = nomes + nomes;
    }
    if (!chips || !ficha) return;
    chips.innerHTML = SPORTS.map(function (s, i) { return '<button type="button" data-i="' + i + '">' + esc(s.n) + '</button>'; }).join('');
    function mostra(i) {
      var s = SPORTS[i];
      chips.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(Number(b.dataset.i) === i)); });
      var linhas = s.marca
        ? [['Como funciona', s.como], ['Formatos', s.formatos], ['Quem vence', s.vence]]
        : [['Formato sugerido', s.f], ['Placar em torneio', s.placar], ['Empate', s.empate]];
      ficha.classList.remove('troca'); void ficha.offsetWidth; ficha.classList.add('troca');
      ficha.innerHTML = '<p class="grande num">' + esc(s.marca ? 'Marca' : s.f) + '</p>' +
        '<h3>' + esc(s.n) + (s.marca ? '<small>desafio de marca</small>' : '') + '</h3>' +
        '<dl>' + linhas.map(function (l) { return '<div><dt>' + esc(l[0]) + '</dt><dd>' + esc(l[1]) + '</dd></div>'; }).join('') + '</dl>';
    }
    chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) mostra(Number(b.dataset.i)); });
    mostra(1);
  }

  /* mesma conta da calculadora de /arena hoje (taxa do app, desconto do plano
     sobre a taxa, tarifa do MP sobre o que foi pago, repasse so no torneio).
     Diferenca: ingresso de torneio aceita cartao (0213). */
  function calculadora(root) {
    var c = root.querySelector('[data-lp="calc"]');
    if (!c) return;
    var q = function (k) { return c.querySelector('[data-c="' + k + '"]'); };
    var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
    var cents = function (n) { return Math.round(n * 100) / 100; };
    function calcula() {
      var tipo = q('tipo'), quem = q('quem');
      var podeRepassar = tipo.selectedOptions[0].dataset.repasse === '1';
      quem.options[1].disabled = !podeRepassar;
      if (!podeRepassar) quem.selectedIndex = 0;
      var repassa = quem.value === '1';
      var valor = Math.max(0, Number(q('valor').value) || 0);
      var taxaPct = Number(tipo.value), mpPct = Number(q('meio').value), descPct = Number(q('plano').value);
      var taxaCheia = cents(valor * taxaPct / 100), desconto = cents(taxaCheia * descPct / 100);
      var paga = cents(repassa ? valor + taxaCheia - desconto : valor - desconto);
      var taxaApp = cents(taxaCheia - desconto), tarifaMp = cents(paga * mpPct / 100);
      var recebe = cents(paga - taxaApp - tarifaMp);
      var menos = function (v) { return (v > 0 ? '− ' : '') + brl(v); };
      desliza(q('paga'), paga, brl);
      desliza(q('taxa'), taxaApp, menos);
      desliza(q('mp'), tarifaMp, menos);
      desliza(q('recebe'), recebe, brl);
      q('taxa-rot').textContent = (descPct ? taxaPct + '% com ' + descPct + '% de desconto do plano' : taxaPct + '% do valor') + (repassa ? ', somada ao preço do atleta' : '');
      q('mp-rot').textContent = q('meio').selectedOptions[0].textContent.split('·')[0].trim();
      q('nota').textContent = repassa
        ? 'No repasse, a categoria é anunciada por ' + brl(paga) + ': o atleta paga a taxa do app e você recebe a inscrição cheia, só com a tarifa do Mercado Pago descontada.'
        : descPct
          ? 'O desconto do plano sai da taxa do app, não da sua parte.'
          : 'Tarifas do Mercado Pago de junho de 2026, para venda online. Vale a da conta da sua arena.';
    }
    c.addEventListener('input', calcula);
    c.addEventListener('change', calcula);
    calcula();
  }

  var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* numero que vai do valor anterior ao novo em ~350 ms */
  function desliza(el, alvo, fmt) {
    var de = typeof el._v === 'number' ? el._v : alvo;
    el._v = alvo;
    if (calmo || de === alvo) { el.textContent = fmt(alvo); return; }
    var t0 = null;
    function passo(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / 350), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round((de + (alvo - de) * e) * 100) / 100);
      if (k < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  /* entrada das secoes: [seletor, tipo]. Itens irmaos entram em cascata. */
  var ENTRADAS = [
    ['section:not(.lp-orig):not(.lp-hero) .eyebrow, section:not(.lp-orig):not(.lp-hero) .h2, section:not(.lp-orig):not(.lp-hero) .lead', 'sobe'],
    ['.lp-sua .chips', 'sobe'], ['.lp-sua .ficha', 'escala'],
    ['.lp-comoapp .ps', 'sobe'], ['.lp-comoapp .palco', 'escala'],
    ['.lp-pontos .casa', 'escala'],
    ['.lp-lados .lado', 'sobe'],
    ['.lp-painelarena .f4', 'sobe'], ['.lp .painel2', 'escala'], ['.lp .painel2 .ag .r', 'sobe'],
    ['.lp-chave .caixa', 'sobe'],
    ['.lp-agreg .no', 'sobe'], ['.lp-agreg .regras4 li', 'sobe'],
    ['.lp-grana .tx', 'sobe'], ['.lp-grana .p3', 'sobe'],
    ['.lp-alem .c', 'sobe'],
    ['.lp-niveis .deg', 'sobe'],
    ['.lp-telas figcaption', 'sobe'],
    ['.lp-cta h2', 'sobe'], ['.lp-cta .mascote', 'escala'],
    ['.lp-versus .linha', 'sobe'], ['.lp-frentes .fr', 'sobe'],
    ['.lp-bloco .card', 'sobe'], ['.lp-bloco .faixa-elite', 'sobe'],
    ['.lp-temporada .b i', 'cresce'],
    ['.lp-equipe .it', 'sobe'], ['.lp-calc .campos', 'sobe'], ['.lp-calc .saida', 'sobe'],
    ['.lp-planos .pl', 'sobe'],
  ];
  var CONTAM = '.lp-pontos .dig, .lp .painel2 .kpi b, .lp .painel .kpi b, .lp-grana .tx b, .lp-temporada .b b';

  function contaDoZero(el) {
    var m = /^(\D*)(\d+)(.*)$/.exec(el.textContent.trim());
    if (!m) return;
    var fim = Number(m[2]), t0 = null;
    function passo(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - k, 3);
      el.textContent = m[1] + Math.round(fim * e) + m[3];
      if (k < 1) requestAnimationFrame(passo);
    }
    el.textContent = m[1] + '0' + m[3];
    requestAnimationFrame(passo);
  }

  function animacoes(root) {
    if (calmo || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (itens) {
      itens.forEach(function (it) {
        if (!it.isIntersecting) return;
        var el = it.target;
        io.unobserve(el);
        if (el.hasAttribute('data-conta')) { contaDoZero(el); return; }
        el.classList.remove('espera');
        el.classList.add('vai');
      });
    }, { threshold: 0.15 });
    ENTRADAS.forEach(function (e) {
      var porPai = new Map();
      root.querySelectorAll(e[0]).forEach(function (el) {
        var n = porPai.get(el.parentNode) || 0;
        porPai.set(el.parentNode, n + 1);
        el.setAttribute('data-a', e[1]);
        el.style.setProperty('--d', (n * 0.09) + 's');
        el.classList.add('espera');
        /* terminada a entrada, a classe sai e as animacoes proprias do item (ex.: agregadores) voltam */
        el.addEventListener('animationend', function (ev) {
          if (/^lp-(sobe|escala|cresce)$/.test(ev.animationName)) el.classList.remove('vai');
        });
        io.observe(el);
      });
    });
    root.querySelectorAll(CONTAM).forEach(function (el) { el.setAttribute('data-conta', ''); io.observe(el); });
  }

  document.querySelectorAll('.lp').forEach(function (root) {
    modalidades(root);
    calculadora(root);
    animacoes(root);
    root.querySelectorAll('[data-menu]').forEach(function (bt) {
      bt.addEventListener('click', function () {
        var cab = bt.closest('.cab, .lp-nav'), aberto = cab.classList.toggle('aberto');
        bt.setAttribute('aria-expanded', String(aberto));
      });
    });
  });
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2 } });
})();
