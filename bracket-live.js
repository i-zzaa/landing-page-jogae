/* Chaveamento da pagina publica ao vivo do torneio, replicado na landing.
   As funcoes sao as mesmas de web/tournament-live.html (repo do app) —
   computeSides, renderBracket, renderMatchCard, drawConnectors, roundLabel —
   so que os jogos vem da constante MATCHES em vez do Supabase, e o cabecalho
   (logo, AO VIVO, chips, abas) e montado aqui em vez de vir do banco.

   Beach tennis, eliminacao simples, 1 set de 6 games (regra da 0154: placar
   valido de 6-0 a 6-4, 7-5 ou 7-6). A disputa de 3o lugar (0157) fica fora da
   arvore, embaixo da final. */
(function () {
  const boxes = document.querySelectorAll('[data-live-bracket]');
  if (!boxes.length) return;

  const team = (id, a, b) => ({ id, name: a.split(' ')[0] + ' / ' + b.split(' ')[0], members: [{ profiles: { full_name: a } }, { profiles: { full_name: b } }] });

  const T = {
    marina: team('t1', 'Marina Reis', 'Rafa Luz'),
    bia: team('t2', 'Bia Nunes', 'Duda Alves'),
    camila: team('t3', 'Camila Tavares', 'Tati Moura'),
    ana: team('t4', 'Ana Prado', 'Lu Martins'),
    sofia: team('t5', 'Sofia Braga', 'Helô Dias'),
    nina: team('t6', 'Nina Paiva', 'Paula Rocha'),
    carol: team('t7', 'Carol Melo', 'Juju Freitas'),
    vitoria: team('t8', 'Vitória Lopes', 'Manu Castro'),
  };

  // horarios de hoje, pro card mostrar "Hoje · 19:30" como na pagina real
  const at = (h, m) => { const d = new Date(); d.setHours(h, m, 0, 0); return d.toISOString(); };
  const match = (o) => Object.assign({ team_a_score: null, team_b_score: null, team_a_sets: null, team_b_sets: null, set_scores: null, winner_team_id: null, status: 'agendada', next_match_id: null, next_match_slot: null, is_third_place: false, starts_at: null, court: null }, o);

  const MATCHES = [
    match({ id: 'q1', round_number: 1, position_in_round: 1, team_a: T.marina, team_b: T.bia, team_a_id: T.marina.id, team_b_id: T.bia.id, team_a_score: 6, team_b_score: 4, winner_team_id: T.marina.id, status: 'concluida', next_match_id: 's1', next_match_slot: 'A', starts_at: at(18, 0), court: { name: 'Quadra 1' } }),
    match({ id: 'q2', round_number: 1, position_in_round: 2, team_a: T.camila, team_b: T.ana, team_a_id: T.camila.id, team_b_id: T.ana.id, team_a_score: 6, team_b_score: 3, winner_team_id: T.camila.id, status: 'concluida', next_match_id: 's1', next_match_slot: 'B', starts_at: at(18, 0), court: { name: 'Quadra 2' } }),
    match({ id: 'q3', round_number: 1, position_in_round: 3, team_a: T.sofia, team_b: T.nina, team_a_id: T.sofia.id, team_b_id: T.nina.id, team_a_score: 7, team_b_score: 5, winner_team_id: T.sofia.id, status: 'concluida', next_match_id: 's2', next_match_slot: 'A', starts_at: at(18, 40), court: { name: 'Quadra 1' } }),
    match({ id: 'q4', round_number: 1, position_in_round: 4, team_a: T.carol, team_b: T.vitoria, team_a_id: T.carol.id, team_b_id: T.vitoria.id, starts_at: at(18, 40), court: { name: 'Quadra 2' } , next_match_id: 's2', next_match_slot: 'B' }),
    match({ id: 's1', round_number: 2, position_in_round: 1, team_a: T.marina, team_b: T.camila, team_a_id: T.marina.id, team_b_id: T.camila.id, team_a_score: 6, team_b_score: 4, winner_team_id: T.marina.id, status: 'concluida', next_match_id: 'f', next_match_slot: 'A', starts_at: at(19, 20), court: { name: 'Quadra 1' } }),
    match({ id: 's2', round_number: 2, position_in_round: 2, team_a: T.sofia, team_a_id: T.sofia.id, team_b: null, team_b_id: null, next_match_id: 'f', next_match_slot: 'B', starts_at: at(19, 20), court: { name: 'Quadra 2' } }),
    match({ id: 'tp', round_number: 3, position_in_round: 2, team_a: T.camila, team_a_id: T.camila.id, team_b: null, team_b_id: null, is_third_place: true, starts_at: at(20, 0), court: { name: 'Quadra 2' } }),
    match({ id: 'f', round_number: 3, position_in_round: 1, team_a: T.marina, team_a_id: T.marina.id, team_b: null, team_b_id: null, starts_at: at(20, 40), court: { name: 'Quadra 1' } }),
  ];

  function computeSides(matches) {
    const totalRounds = Math.max(...matches.map((m) => m.round_number));
    const finalMatch = matches.find((m) => m.round_number === totalRounds && !m.is_third_place);
    const childrenOf = new Map();
    for (const m of matches) {
      if (m.next_match_id) {
        const arr = childrenOf.get(m.next_match_id) ?? [];
        arr.push(m);
        childrenOf.set(m.next_match_id, arr);
      }
    }
    const side = new Map();
    const assign = (m, s) => {
      side.set(m.id, s);
      for (const kid of childrenOf.get(m.id) ?? []) assign(kid, s);
    };
    if (finalMatch) {
      side.set(finalMatch.id, 'final');
      for (const kid of childrenOf.get(finalMatch.id) ?? []) {
        assign(kid, kid.next_match_slot === 'B' ? 'right' : 'left');
      }
    }
    return { side, totalRounds, finalMatch };
  }

  function roundLabel(round, totalRounds) {
    const fromEnd = totalRounds - round;
    if (fromEnd === 0) return 'Final';
    if (fromEnd === 1) return 'Semifinal';
    if (fromEnd === 2) return 'Quartas de final';
    return `Rodada ${round}`;
  }

  function initials(name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] ?? '').toUpperCase() + (parts[1]?.[0] ?? '').toUpperCase();
  }

  function duoMemberNames(team) {
    const names = (team?.members ?? []).map((m) => m.profiles?.full_name).filter(Boolean);
    return names.length === 2 ? names : null;
  }

  function avatarEl(name) {
    const avatar = document.createElement('span');
    avatar.className = 'avatar';
    avatar.textContent = name ? initials(name) : '–';
    return avatar;
  }

  function teamRow(team, score, isWinner) {
    const row = document.createElement('div');
    row.className = 'team-row';
    const duo = duoMemberNames(team);
    if (duo) {
      const avatars = document.createElement('span');
      avatars.className = 'avatar-duo';
      const a2 = avatarEl(duo[1]);
      a2.classList.add('avatar-overlap');
      avatars.appendChild(avatarEl(duo[0]));
      avatars.appendChild(a2);
      row.appendChild(avatars);
    } else {
      row.appendChild(avatarEl(team?.name));
    }
    const name = document.createElement('span');
    name.className = 'team-name' + (isWinner ? ' winner' : '');
    name.textContent = duo ? duo.join(' & ') : (team?.name ?? 'A definir');
    row.appendChild(name);
    const scoreEl = document.createElement('span');
    scoreEl.className = 'team-score' + (isWinner ? ' winner' : '');
    scoreEl.textContent = score != null ? score : '';
    row.appendChild(scoreEl);
    return row;
  }

  function statusRow(match) {
    const row = document.createElement('div');
    row.className = 'match-status';
    const dot = document.createElement('span');
    const label = document.createElement('span');
    if (match.status === 'bye') {
      dot.className = 'status-dot waiting';
      label.textContent = 'Passou direto (bye)';
    } else if (match.status === 'concluida' || match.winner_team_id) {
      dot.className = 'status-dot done';
      label.textContent = 'Finalizada';
    } else if (match.team_a_id && match.team_b_id) {
      dot.className = 'status-dot next';
      label.textContent = 'Próxima';
    } else {
      dot.className = 'status-dot waiting';
      label.textContent = 'Aguardando';
    }
    row.appendChild(dot);
    row.appendChild(label);
    return row;
  }

  function scheduleLabel(match) {
    const parts = [];
    if (match.court?.name) parts.push(match.court.name);
    if (match.starts_at) {
      const date = new Date(match.starts_at);
      const sameDay = date.toDateString() === new Date().toDateString();
      const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      parts.push(sameDay ? `Hoje · ${time}` : `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} · ${time}`);
    }
    return parts.join(' · ');
  }

  function renderMatchCard(match, isFinal) {
    const card = document.createElement('div');
    card.className = 'match-card' + (isFinal ? ' final-card' : '');
    if (isFinal) {
      const trophy = document.createElement('div');
      trophy.className = 'trophy';
      trophy.textContent = '🏆 FINAL';
      card.appendChild(trophy);
    }
    const showSets = (match.team_a_sets ?? 0) + (match.team_b_sets ?? 0) > 1;
    card.appendChild(teamRow(match.team_a, showSets ? match.team_a_sets : match.team_a_score, match.winner_team_id === match.team_a_id));
    card.appendChild(teamRow(match.team_b, showSets ? match.team_b_sets : match.team_b_score, match.winner_team_id === match.team_b_id));
    if (showSets && Array.isArray(match.set_scores)) {
      const setsEl = document.createElement('div');
      setsEl.className = 'match-schedule';
      setsEl.textContent = match.set_scores.map((set) => `${set[0]}-${set[1]}`).join(', ');
      card.appendChild(setsEl);
    }
    card.appendChild(statusRow(match));
    const schedule = scheduleLabel(match);
    if (schedule) {
      const scheduleEl = document.createElement('div');
      scheduleEl.className = 'match-schedule';
      scheduleEl.textContent = schedule;
      card.appendChild(scheduleEl);
    }
    return card;
  }

  function renderBracket(bracketEl, allMatches) {
    bracketEl.innerHTML = '';
    const matches = allMatches.filter((m) => !m.is_third_place);
    const thirdPlaceMatch = allMatches.find((m) => m.is_third_place);
    const { side, totalRounds, finalMatch } = computeSides(matches);

    const leftRounds = [];
    const rightRounds = [];
    for (let r = 1; r < totalRounds; r++) {
      leftRounds.push(matches.filter((m) => m.round_number === r && side.get(m.id) === 'left'));
      rightRounds.push(matches.filter((m) => m.round_number === r && side.get(m.id) === 'right'));
    }

    const labelsRow = document.createElement('div');
    labelsRow.className = 'round-labels';
    bracketEl.appendChild(labelsRow);

    const cardById = new Map();

    function appendColumn(roundMatches, roundNumber, isFinal) {
      const label = document.createElement('div');
      label.className = 'round-label';
      label.textContent = roundLabel(roundNumber, totalRounds);
      labelsRow.appendChild(label);

      const col = document.createElement('div');
      col.className = 'round-column';
      for (const m of roundMatches) {
        const card = renderMatchCard(m, isFinal);
        cardById.set(m.id, card);
        col.appendChild(card);
      }
      if (isFinal && thirdPlaceMatch) {
        const third = document.createElement('div');
        third.className = 'third-place';
        const tag = document.createElement('div');
        tag.className = 'round-label';
        tag.textContent = 'Disputa de 3º lugar';
        third.appendChild(tag);
        third.appendChild(renderMatchCard(thirdPlaceMatch, false));
        col.appendChild(third);
      }
      bracketEl.appendChild(col);
    }

    for (const roundMatches of leftRounds) {
      if (roundMatches.length === 0) continue;
      appendColumn(roundMatches, roundMatches[0].round_number);
    }
    if (finalMatch) appendColumn([finalMatch], totalRounds, true);
    for (let i = rightRounds.length - 1; i >= 0; i--) {
      if (rightRounds[i].length === 0) continue;
      appendColumn(rightRounds[i], rightRounds[i][0].round_number);
    }

    const redraw = () => { fit(bracketEl); drawConnectors(bracketEl, matches, side, cardById); };
    requestAnimationFrame(redraw);
    window.addEventListener('resize', redraw);
    // as fontes chegam depois e mudam a altura dos cards
    if (document.fonts?.ready) document.fonts.ready.then(redraw);
  }

  function fit(bracketEl) {
    const box = bracketEl.closest('[data-live-bracket]');
    if (!box || !box.hasAttribute('data-live-fit')) return;
    bracketEl.style.zoom = '';
    const available = bracketEl.parentElement.clientWidth;
    const needed = bracketEl.scrollWidth;
    if (available < 700 || needed <= available) return;
    const scale = available / needed;
    if (scale >= 0.72) bracketEl.style.zoom = scale;
  }

  function drawConnectors(bracketEl, matches, side, cardById) {
    const old = bracketEl.querySelector('svg.connectors');
    if (old) old.remove();

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'connectors');
    svg.setAttribute('width', bracketEl.scrollWidth);
    svg.setAttribute('height', bracketEl.scrollHeight);
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';

    for (const match of matches) {
      if (!match.next_match_id) continue;
      const sourceCard = cardById.get(match.id);
      const targetCard = cardById.get(match.next_match_id);
      if (!sourceCard || !targetCard) continue;

      const s = side.get(match.id);
      const sr = { left: sourceCard.offsetLeft, top: sourceCard.offsetTop, width: sourceCard.offsetWidth, height: sourceCard.offsetHeight };
      const tr = { left: targetCard.offsetLeft, top: targetCard.offsetTop, width: targetCard.offsetWidth, height: targetCard.offsetHeight };

      const x1 = s === 'right' ? sr.left : sr.left + sr.width;
      const y1 = sr.top + sr.height / 2;
      const x2 = s === 'right' ? tr.left + tr.width : tr.left;
      const y2Slot = match.next_match_slot === 'B' ? 0.72 : 0.28;
      const y2 = tr.top + tr.height * y2Slot;

      const midX = (x1 + x2) / 2;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#fed0b0');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);
    }
    bracketEl.prepend(svg);
  }

  function renderMatchList(listEl, matches) {
    listEl.innerHTML = '';
    const tree = matches.filter((m) => !m.is_third_place);
    const totalRounds = Math.max(...tree.map((m) => m.round_number));
    const ordered = [
      ...tree.filter((m) => m.round_number < totalRounds),
      ...matches.filter((m) => m.is_third_place),
      ...tree.filter((m) => m.round_number === totalRounds),
    ];
    let lastKey = null;
    for (const m of ordered) {
      const key = m.is_third_place ? 'third' : m.round_number;
      if (key !== lastKey) {
        lastKey = key;
        const tag = document.createElement('div');
        tag.className = 'round-tag';
        tag.textContent = m.is_third_place ? 'Disputa de 3º lugar' : roundLabel(m.round_number, totalRounds);
        listEl.appendChild(tag);
      }
      listEl.appendChild(renderMatchCard(m, false));
    }
  }

  function mascotMessage(matches) {
    const tree = matches.filter((m) => !m.is_third_place);
    const totalRounds = Math.max(...tree.map((m) => m.round_number));
    const finalMatch = tree.find((m) => m.round_number === totalRounds);
    if (!finalMatch) return null;
    if (finalMatch.winner_team_id) {
      const winner = finalMatch.winner_team_id === finalMatch.team_a_id ? finalMatch.team_a : finalMatch.team_b;
      return `${winner?.name} é a campeã do torneio! 🏆`;
    }
    if (finalMatch.team_a_id && finalMatch.team_b_id) return 'A final está chegando! Prepare seu time e venha viver grandes emoções.';
    return 'O chaveamento está esquentando — acompanhe as próximas fases ao vivo.';
  }

  for (const box of boxes) {
    box.innerHTML =
      '<div class="live-head"><img src="assets/logo-completa.png" alt="Desafiaê" /><span class="live-badge"><span class="live-dot"></span> AO VIVO</span></div>' +
      '<div class="live-intro"><h3>Copa de Verão</h3><p>Copa de Verão de Beach Tennis Duplas</p></div>' +
      '<div class="chips"><span class="chip">Beach Tennis Duplas</span><span class="chip">Arena Maré Alta</span></div>' +
      '<div class="tabs"><button type="button" class="tab active" data-view="bracket">Chaveamento</button><button type="button" class="tab" data-view="matches">Partidas</button><button type="button" class="tab" data-view="standings">Classificação</button></div>' +
      '<div class="live-body">' +
      '<div class="view active" data-view-name="bracket"><div class="bracket-scroll"><div class="bracket"></div></div>' +
      '<div class="legend"><span class="legend-item"><span class="status-dot done"></span> Finalizada</span><span class="legend-item"><span class="status-dot next"></span> Próxima</span><span class="legend-item"><span class="status-dot waiting"></span> Aguardando</span></div>' +
      '<div class="mascot-banner"><img src="assets/mascote-etapa-final.png" alt="" /><p></p></div></div>' +
      '<div class="view" data-view-name="matches"><div class="match-list"></div></div>' +
      '<div class="view" data-view-name="standings"><div class="state">Eliminação simples não tem classificação corrida — acompanhe o progresso pela aba Chaveamento.</div></div>' +
      '</div>' +
      '<div class="live-foot">Chaveamento em tempo real — Desafiaê</div>';

    renderBracket(box.querySelector('.bracket'), MATCHES);
    renderMatchList(box.querySelector('.match-list'), MATCHES);
    box.querySelector('.mascot-banner p').textContent = mascotMessage(MATCHES);

    box.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        box.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
        box.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
        tab.classList.add('active');
        box.querySelector(`.view[data-view-name="${tab.dataset.view}"]`).classList.add('active');
      });
    });
  }
})();
