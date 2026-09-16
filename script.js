const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');menuButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const heroVisual=document.querySelector('.hero-visual');const popCards=document.querySelectorAll('.floating-card[data-pop-delay]');if(heroVisual&&popCards.length){const popObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){popCards.forEach(card=>{const delay=Number(card.dataset.popDelay)||0;setTimeout(()=>{card.classList.add('pop-in');card.addEventListener('animationend',()=>card.classList.add('settled'),{once:true})},delay)});popObserver.unobserve(entry.target)}}),{threshold:.3});popObserver.observe(heroVisual)}

/* Seletor de modalidade — dados das migrations 0002/0017/0148/0154/0170:
   formato = players_per_match dividido por 2; placar = sports.scoring_rules. */
const SPORTS=[
 {n:'Futebol',f:'11x11',placar:'Placar de gols',empate:'Permitido em liga. No mata-mata, vai para os pênaltis.'},
 {n:'Futevôlei',f:'2x2',placar:'1 set até 18 pontos, com 2 de vantagem',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Beach Tennis',f:'2x2',placar:'1 set de 6 games',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Vôlei',f:'2x2',placar:'Melhor de 3 sets até 21 pontos; o 3º vai até 15',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Basquete',f:'5x5',placar:'Placar de pontos',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Tênis',f:'1x1',placar:'Melhor de 3 sets; super tie-break até 10 no set decisivo',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Padel',f:'2x2',placar:'Melhor de 3 sets; super tie-break até 10 no set decisivo',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Corrida',marca:true,como:'Cada um corre por si, onde e quando quiser, e lança o próprio tempo.',formatos:'3 km, 5 km, 10 km, meia maratona ou maratona',vence:'O menor tempo lançado até a data limite.'},
 {n:'Futsal',f:'5x5',placar:'Placar de gols',empate:'Permitido em liga. No mata-mata, vai para os pênaltis.'},
 {n:'Futebol Society',f:'7x7',placar:'Placar de gols',empate:'Permitido em liga. No mata-mata, vai para os pênaltis.'},
 {n:'Vôlei de Quadra',f:'6x6',placar:'Melhor de 5 sets até 25 pontos; o 5º vai até 15',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Basquete 3x3',f:'3x3',placar:'Placar de pontos',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Handebol',f:'7x7',placar:'Placar de gols',empate:'Permitido em liga. No mata-mata, vai para os pênaltis.'},
 {n:'Pickleball',f:'2x2',placar:'1 set até 11 pontos, com 2 de vantagem',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Squash',f:'1x1',placar:'Melhor de 3 sets até 11 pontos, com 2 de vantagem',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Tênis de Mesa',f:'1x1',placar:'Melhor de 5 sets até 11 pontos, com 2 de vantagem',empate:'Não existe: todo jogo tem vencedor.'},
 {n:'Hyrox',marca:true,como:'Cada um faz a prova por si, onde e quando quiser, e lança o próprio tempo.',formatos:'Individual Open, Individual Pro ou simulado',vence:'O menor tempo lançado até a data limite.'},
 {n:'CrossFit',marca:true,como:'Todo mundo faz o mesmo WOD e lança a própria marca.',formatos:'For Time, AMRAP ou carga máxima',vence:'A melhor marca. Quem fez RX fica na frente de quem fez Scaled.'}
];

function tablist(box,labels,onPick,startAt,reuse){
  let tabs=reuse?[...box.querySelectorAll('button')]:[];
  if(tabs.length!==labels.length){
    box.innerHTML='';
    tabs=labels.map(label=>{
      const b=document.createElement('button');
      b.textContent=label;box.appendChild(b);return b;
    });
  }
  tabs.forEach((b,i)=>{b.type='button';b.setAttribute('role','tab');b.onclick=()=>onPick(i);});
  if(!box.dataset.keys){
    box.dataset.keys='1';
    box.addEventListener('keydown',e=>{
      const step=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;
      if(!step)return;
      e.preventDefault();
      const all=[...box.querySelectorAll('button')];
      const next=(all.indexOf(document.activeElement)+step+all.length)%all.length;
      all[next].focus();all[next].click();
    });
  }
  onPick(startAt||0);
}

function markTabs(box,active){
  [...box.children].forEach((b,i)=>{
    b.classList.toggle('on',i===active);
    b.setAttribute('aria-selected',String(i===active));
    b.tabIndex=i===active?0:-1;
  });
}

const chipBox=document.querySelector('.sport-chips');
const detail=document.querySelector('.sport-detail');
if(chipBox&&detail){
  const row=(k,v)=>`<div class="sport-row"><small>${k}</small><p>${v}</p></div>`;
  tablist(chipBox,SPORTS.map(s=>s.n),i=>{
    const s=SPORTS[i];
    markTabs(chipBox,i);
    detail.innerHTML=
      `<h3>${s.n}${s.marca?' <span class="sport-flag">desafio de marca</span>':''}</h3>`+
      (s.marca
        ? row('Como funciona',s.como)+row('Formatos',s.formatos)+row('Quem vence',s.vence)
        : row('Formato sugerido',s.f)+row('Placar em torneio',s.placar)+row('Empate',s.empate));
  },1,true);
}

/* Tour das telas */
const TOUR=[
 {mode:'App do jogador',screens:[
  {label:'Home',src:'assets/screens/player-home.png',cap:'Partidas e torneios abertos perto de você.'},
  {label:'Ranking',src:'assets/screens/player-ranking.png',cap:'Ranking semanal e mensal, por modalidade.'},
  {label:'Perfil',src:'assets/screens/player-profile.png',cap:'Nível por modalidade, histórico e conquistas.'}]},
 {mode:'Painel da arena',screens:[
  {label:'Painel',src:'assets/screens/arena-painel.png',cap:'O dia da arena e os desafios ativos, lado a lado.'},
  {label:'Ajustes',src:'assets/screens/arena-ajustes.png',cap:'Quadras, preços, equipe e formas de pagamento.'},
  {label:'Analytics',src:'assets/screens/arena-analytics.png',cap:'Jogos, jogadores ativos e ocupação por dia e horário.'}]}
];

const modeBox=document.querySelector('.tour-modes');
const shots=document.querySelector('.tour-shots');
if(modeBox&&shots){
  tablist(modeBox,TOUR.map(m=>m.mode),m=>{
    markTabs(modeBox,m);
    shots.innerHTML=TOUR[m].screens.map(sc=>
      `<figure class="tour-shot"><img src="${sc.src}" alt="${sc.label} — ${TOUR[m].mode} do Desafiaê" loading="lazy" /><figcaption><b>${sc.label}</b>${sc.cap}</figcaption></figure>`
    ).join('');
  });
}

/* Menu acompanha a secao: bege enquanto o menu esta sobre o inicio */
const header=document.querySelector('.header');
const hero=document.querySelector('.hero');
if(header&&hero){
  const paint=()=>header.classList.toggle('on-beige',hero.getBoundingClientRect().bottom>header.offsetHeight);
  window.addEventListener('scroll',paint,{passive:true});
  window.addEventListener('resize',paint);
  paint();
}
