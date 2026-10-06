// Página de prévia dos links compartilhados (torneio, partida, desafio,
// chaveamento, temporada). Quem monta o HTML é a Edge Function tournament-og,
// mas o Supabase entrega toda resposta HTML pública de function como
// text/plain com CSP sandbox — o WhatsApp não lê as meta tags e o navegador
// mostra o código. Aqui a página passa adiante com o tipo certo.
export const config = { runtime: 'edge' };

const OG_FUNCTION = 'https://ckgxcylcnkqdhalsrptz.supabase.co/functions/v1/tournament-og';
const PARAMS = ['type', 'id', 'live'];

export default async function handler(request) {
  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  for (const key of PARAMS) {
    const value = incoming.get(key);
    if (value) params.set(key, value);
  }

  const upstream = await fetch(`${OG_FUNCTION}?${params}`);
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
