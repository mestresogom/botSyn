// bot.js
const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error('Defina a variável de ambiente DISCORD_TOKEN.');
  process.exit(1);
}

// TROQUE PELO ID REAL DA ROLE QUE REPRESENTA @.|.M.|.
const MESTRES_ROLE_ID = '546834826989273088';
// ID do canal de prontuário (Fórum ou texto)
const PRONTUARIO_CHANNEL_ID = '1492159823872135248';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';

const QUESTIONS = [
  'Como você agiria em uma situação onde alguém lhe pressiona constantemente querendo informações?',
  'Como você encara pessoas com ideias radicalmente opostas a sua?',
  'Em sua vida cotidiana, como se dá sua relação com os familiares?',
  'Imagine que exista uma pessoa que precise de sua atenção 6 vezes por hora. Como seria sua relação com essa pessoa?',
  'O que considera mais importante na sua vida?',
  'Porque você deixaria de executar uma tarefa no mesmo instante em que ela foi passada?',
  'Quais motivos você acha justo para não comparecer a um compromisso assumido anteriormente?',
  'Quais seus principais problemas de relacionamento?',
  'Qual a relação entre você e seus pais? Como você vê sua relação com eles.',
  'Qual seria a sua ação diante da revelação de uma falta grave de um companheiro de ordem?',
  'Que motivos fariam você se atrasar a um compromisso?',
  'Relato sobre o tema: Neste momento, exponha seus pensamentos sobre o tema que lhe foi apresentado.',
  'Use este espaço para observações ou dúvidas que ache pertinente.'
];
const FRASES = [
  "A forma sem ética é disfarce: ela vira teatro vazio ou armadura para esconder erro (.|.CdEt.|.p.4).",
  "Sem ética elevada, o rito se torna risco; a intensidade só é legítima se sustentada por compromisso ético (.|.CdEt.|.p.4).",
  "A ética é o que mantém o Fogo sagrado: não apenas o que se faz diante dos outros, mas o que se sustenta no silêncio da consciência (.|.CdEt.|.p.5).",
  "É a ética — e só ela — que garante que a espada corta para curar, e não para ferir por vaidade (.|.CdEt.|.p.5).",
  "A diferença essencial: ética profana protege o indivíduo; ética simbólica protege o rito (.|.CdEt.|.p.6).",
  "Impessoalidade não é frieza: é agir em nome de algo que nos excede, sem misturar as cores da própria biografia (.|.CdEt.|.p.7).",
  "O erro ético na ética simbólica não é só o que foi feito — é o que viola o campo (.|.CdEt.|.p.7).",
  "A função iniciática é convocação: quem ocupa função desce ao centro do fogo; assume peso como serviço, não como privilégio (.|.CdEt.|.p.10).",
  "A função é um lugar de escuta e doação — não de controle e visibilidade (.|.CdEt.|.p.10).",
  "A função pede impessoalidade sem desumanidade; pede vigilância constante sobre si mesmo (.|.CdEt.|.p.11).",
  "A função é uma tocha — não uma coroa: ilumina, mas queima; só pode ser sustentada por quem aceita ser canal e não centro (.|.CdEt.|.p.13).",
  "Aqui, a escuta é horizontal — mas a função é vertical: todos podem falar, mas nem todos devem decidir (.|.CdEt.|.p.15).",
  "Função sem escuta vira tirania; escuta sem função vira ruído e caos (.|.CdEt.|.p.15).",
  "Entre hierarquia e horizontalidade, a via madura é: escutar amplamente e concentrar decisão ritualmente (.|.CdEt.|.p.16).",
  "A ética da presença: sustentar sem colonizar — renunciar à centralidade pessoal em favor do Fogo (.|.CdEt.|.p.17).",
  "Colonizar o campo é usá-lo como extensão do próprio desejo; o mestre é canal — não vértice (.|.CdEt.|.p.18).",
  "Não usar o rito para elaborar dores pessoais; o espaço iniciático não é consultório (.|.CdEt.|.p.19).",
  "Estar disponível sem ser absorvido: presença com borda, discernimento e limites claros (.|.CdEt.|.p.20).",
  "O mestre é sustentador do rito, não cuidador da subjetividade individual do outro (.|.CdEt.|.p.22).",
  "A sobreposição entre mestre e terapeuta desloca a escuta para a subjetividade e contamina o rito (.|.CdEt.|.p.25).",
  "Quando o mestre tenta curar, desvia o fogo; quando o discípulo exige cura, paralisa a travessia (.|.CdEt.|.p.26).",
  "A tentação de resolver o outro é arrogância do cuidado: o rito existe para expor, não para proteger a pessoa do risco necessário (.|.CdEt.|.p.28).",
  "Quem resolve demais impede que o outro descubra seus próprios contornos — onde não há vazio, não há rito (.|.CdEt.|.p.29).",
  "Fazer silêncio diante da dor alheia, quando tudo em nós quer intervir, é coragem de confiar no rito mais do que em si mesmo (.|.CdEt.|.p.30).",
  "Saber quando calar e quando interromper é arte do mestre: calar como pedagogia; interromper como contenção ritual (.|.CdEt.|.p.31).",
  "Nomear a escolha de calar protege a travessia de mal-entendidos e preserva o campo (.|.CdEt.|.p.32).",
  "O maior risco do mestre é acreditar que já é mestre; proteger-se disso exige dúvida, silêncio e coragem de ser corrigido (.|.CdEt.|.p.34).",
  "Nenhum mestre é autossuficiente; a ordem precisa de estruturas de escuta e revisão (.|.CdEt.|.p.35).",
  "A ética da vulnerabilidade para iniciados: disciplina entre cuidado materno e firmeza ritual, para ritualizar impacto com responsabilidade (.|.CdEt.|.p.36–38).",
  "Elogio fora de hora pode cristalizar identidade imaginária; devolução simbólica educa sem ferir (.|.CdEt.|.p.37–38).",
  "A ética do conflito para discípulos: sustentar tensão sem ceder à corrosão estrutural; quem fala, sustenta (.|.CdEt.|.p.40–42).",
  "O discípulo que busca reconhecimento deve aprender que manifestar implica responsabilidade simbólica (.|.CdEt.|.p.41–42).",
  "A ética da exposição para mestres: a função não é identidade; cada gesto deve perguntar 'isso serve ao rito ou à minha imagem?' (.|.CdEt.|.p.44–46).",
  "A vaidade espiritual se disfarça de zelo; o mestre precisa autovigilância simbólica constante (.|.CdEt.|.p.45).",
  "Sustentar o espelho: confrontar o discípulo como gesto de amor ético — refletir para transformar, não para humilhar (.|.CdEt.|.p.47–48).",
  "A dor que vira centro do campo exige reconfiguração: não excluir, mas preservar rito e sujeito com contornos claros (.|.CdEt.|.p.50).",
  "Afastamento pedagógico é cuidado: indicar caminhos, terapia e pausas rituais — é gesto de proteção, não abandono (.|.CdEt.|.p.51).",
  "Indicação responsável de acompanhamento clínico é ato de maturidade institucional e ética (.|.CdEt.|.p.55).",
  "Círculos de escuta entre pares elaboram crises sem verticalidade e reduzem sobrecarga dos condutores (.|.CdEt.|.p.55).",
  "Formação para mestres em sinais de alerta (persecução, dissociação, manipulação afetiva) é obrigação ética (.|.CdEt.|.p.56).",
  "Nomeação pública ritualizada de limites cria segurança simbólica e evita expulsões opacas (.|.CdEt.|.p.57).",
  "Condutas inadequadas: captura afetiva prende o discípulo; contenção amorosa devolve autonomia (.|.CdEt.|.p.59).",
  "Discurso espiritual usado para silenciar é traição ao rito: linguagem sagrada não pode ser arma de dominação (.|.CdEt.|.p.60).",
  "Abusos travestidos de provações são reviver da própria travessia não elaborada; provação legítima é proporcional e com escuta (.|.CdEt.|.p.61).",
  "Exercício da condução em benefício próprio transforma função em cetro; a função só é legítima enquanto permanecer em escuta (.|.CdEt.|.p.62).",
  "Diante de desvios de um outro mestre: procurar pares, escutar com cuidado e levar ao eixo antes do círculo — lealdade é ao Fogo (.|.CdEt.|.p.66).",
  "Sustentar denúncias sem ferir o rito exige proteção ao denunciante, processo de apuração e evitar sensacionalismo emocional (.|.CdEt.|.p.67).",
  "O retiro interno do mestre é eixo invisível da função: sem ele, a condução vira performance e a autoridade, dogma (.|.CdEt.|.p.69–71).",
  "A máscara ética do ego: a linguagem da ética dissociada da escuta real torna a ética maquiagem da imagem (.|.CdEt.|.p.72–73).",
  "A dor não escutada do mestre contamina a condução; reconhecer e recolher-se é obrigação ética (.|.CdEt.|.p.72–74).",
  "Campo profanado por silêncio coletivo exige nomeação, escuta da verdade, do dano e do real para reparação (.|.CdEt.|.p.76–77).",
  "Honestidade profunda é oração invisível: dizer 'não sei' e retornar com correção realinha o campo (.|.CdEt.|.p.78–80).",
  "Silêncio como prática ética: presença vigilante que protege o tempo do rito; a palavra deve nascer do silêncio verdadeiro (.|.CdEt.|.p.82–84).",
  "A ética não é código fechado, é caminho — perguntas contínuas como 'de onde estou falando?' sustentam a integridade (.|.CdEt.|.p.85–87).",
  "Este mapa dos nove graus não é doutrina decorada, mas um mapa vivo de uma travessia interior sempre mais profunda e exigente (.|.SbGr.|.p.1).",
  "Os graus não hierarquizam almas: descrevem estágios de maturação da consciência, espelhados em posturas e disposições internas (.|.SbGr.|.p.1).",
  "Cada revolução se desdobra em três etapas: contato, depuração e serviço silencioso — um ciclo que se reinicia em oitavas mais sutis (.|.SbGr.|.p.1).",
  "Os erros se repetem em camadas mais refinadas: orgulho, carência e desejo de ser visto retornam em novas roupagens iniciáticas (.|.SbGr.|.p.1).",
  "Os graus são impressões no ser: manifestam-se nas perguntas que o sujeito formula e na forma como sustenta silêncio e frustração (.|.SbGr.|.p.1).",
  "O Aprendiz é limiar: não busca poder, mas enraizamento; deve sustentar o peso do silêncio e o desconforto da espera (.|.SbGr.|.p.2).",
  "A escuta da margem exige constância: mais do que fazer, o Aprendiz precisa permitir-se ser atravessado (.|.SbGr.|.p.2).",
  "Um Aprendiz maduro aceita sua posição sem ressentimento ou ansiedade; o silêncio também ensina (.|.SbGr.|.p.2).",
  "O Neófito recebeu a Luz, mas precisa morrer para certezas: distinguir símbolo de literalidade e limpar o espelho interior (.|.SbGr.|.p.4).",
  "Neófito é confronto com a imagem ideal: autenticar-se no esvaziamento, não no protagonismo (.|.SbGr.|.p.4).",
  "O Iniciado começa a dissolver estruturas do ego: a busca vira travessia ética, ontológica e existencial (.|.SbGr.|.p.6).",
  "Iniciado é o início da travessia real: firmeza silenciosa, ética prática e capacidade de auto-observação (.|.SbGr.|.p.6).",
  "Mesmo o Iniciado pode cair na armadilha da estagnação confortável; a percepção constante das próprias oscilações é sinal de processo (.|.SbGr.|.p.6).",
  "O Adepto trabalha a lapidação contínua de si: não busca ser visto, busca ser atravessado; sua força nasce da depuração (.|.SbGr.|.p.8).",
  "Para o Adepto, profundidade, integridade e zelo pelo campo coletivo se tornam requisitos essenciais (.|.SbGr.|.p.8).",
  "O Discípulo é o centro da segunda revolução: aprende a acompanhar crises alheias sem se perder nelas (.|.SbGr.|.p.10).",
  "Discípulo sustenta tarefas reais; sua palavra, quando usada, deve ser cirúrgica; seu serviço nasce da disciplina, não do brilho (.|.SbGr.|.p.10).",
  "Discípulo maduro sustenta silêncio sem covardia e presença sem protagonismo (.|.SbGr.|.p.11).",
  "Contramestre é grau de transição: aprende a conduzir sem centralizar, a sustentar sem controlar (.|.SbGr.|.p.12).",
  "No Contramestre, a presença é estrutural: suas ações afetam o coletivo, e sua compostura é medida (.|.SbGr.|.p.12).",
  "A Maestria não é coroação mas abertura de um novo abismo: entrar no círculo não é ter poder, é entrega ao poder (.|.SbGr.|.p.14).",
  "A ilusão do 'agora eu sei' é a armadilha da maestria; o novo Mestre corre risco de tensionar o próprio Círculo (.|.SbGr.|.p.14).",
  "Entrar na oitava superior exige dissolução: a pergunta deixa de ser 'quem sou eu?' e passa a ser 'sou capaz de desaparecer para que o rito aconteça?' (.|.SbGr.|.p.14).",
  "Aletheia é desvelamento: não posse de verdade, mas disposição radical de viver à luz do que é, mesmo quando contradiz desejos pessoais (.|.SbGr.|.p.16).",
  "Aletheia sustenta o campo pela coerência da presença, não pela palavra; já não finge— simplesmente acontece (.|.SbGr.|.p.16).",
  "Aletheia deve evitar a rigidez da lucidez: ver sem perder compaixão e sem se tornar autossuficiente (.|.SbGr.|.p.17).",
  "Maat é guardiã da retidão silenciosa: pesa e mede sem tomar partido; regula proporção e eixo vibracional do corpo iniciático (.|.SbGr.|.p.18).",
  "Maat aplica cortes com bisturi, não com espada: discernimento e precisão são virtudes do equilíbrio (.|.SbGr.|.p.18).",
  "O risco de Maat é tornar-se juiz em vez de régua; equanimidade sem vibração sequiosa torna-se estagnação (.|.SbGr.|.p.19).",
  "Azoth é a síntese viva: a culminância da transmutação onde o iniciado se tornou obra, orientando por ser e não por método (.|.SbGr.|.p.20).",
  "Azoth mantém o Fogo Central da Ordem: disponibilidade radical ao invisível e renúncia consciente à centralidade (.|.SbGr.|.p.20).",
  "O Azoth verdadeiro desapareceu sem sumir: fala pouco, mas quando fala, o essencial emerge; sua ação é oração (.|.SbGr.|.p.21).",
  "Até Azoth corre risco de dissolução sem forma: desapego que perde vibração e responsabilidade concreta (.|.SbGr.|.p.21).",
  "A travessia dos graus é menos sobre receber título e mais sobre o que resiste em nós; a pergunta central é 'o que em mim ainda resiste?' (.|.SbGr.|.p.23).",
  "O texto é marca de quem passou; o caminho exige encarnação: não se pergunte 'em que grau estou', pergunte 'o que em mim ainda resiste?' (.|.SbGr.|.p.23).",
  "O rito revela o que ainda não morreu em nós; a maestria exige prostração ao princípio, não à figura (.|.SbGr.|.p.14).",
  "Quem não estiver disposto a se dissolver mesmo depois do que já foi deposto, ainda não está pronto (.|.SbGr.|.p.15).",
  "A função não é ser atendida pela estrutura — é sustentá-la; isso é exigido no Adepto e no Contramestre (.|.SbGr.|.p.8,.p.12).",
  "A presença estruturante do Azoth reorganiza: quando ele fala, o essencial emerge; quando cala, o silêncio é pedagógico (.|.SbGr.|.p.20–21).",
  "A travessia é cíclica, não repetitiva: sobe oitavas da mesma melodia, exigindo vigilância mais precisa a cada volta (.|.SbGr.|.p.1).",
  "Sustentar ritos e respeitar tempos internos é a medida real do avanço, não decoração de linguagem iniciática (.|.SbGr.|.p.1,.p.23).",
  "Toda etapa exige humildade vigilante: não submissão, mas ausência de pressa em afirmar-se (.|.SbGr.|.p.2).",
  "A maestria é obra diária: não comando, mas renúncia; não protagonismo, mas serviço ao todo (.|.SbGr.|.p.14,.p.20).",
  "Encarnar o próximo grau é gesto, silêncio e entrega real — não busca por novo posto, mas presença mais íntegra (.|.SbGr.|.p.23).",
    "A frustração não é acidente de percurso: é ferramenta iniciática que revela expectativas ocultas e promove transformação (.|.SbPd.|.p.1).",
  "O papel do mestre não é garantir conforto emocional, mas criar contextos simbólicos para que o iniciado se veja com verdade (.|.SbPd.|.p.1).",
  "Maturidade iniciática não se mede pela ausência de dor, mas pela capacidade de atravessá-la com lucidez (.|.SbPd.|.p.1).",
  "Muitos iniciados confundem sensibilidade com espiritualidade e acolhimento com confirmação (.|.SbPd.|.p.1).",
  "A sensibilidade é preciosa — desde que seja sensibilidade da alma, e não carência do ego (.|.SbPd.|.p.3).",
  "O ego ainda iludido de que controla o crescimento fere-se quando o rito não confirma sua fantasia (.|.SbPd.|.p.3).",
  "O verdadeiro mestre responde à necessidade, não ao desejo; muitas vezes a necessidade pede frustração (.|.SbPd.|.p.4).",
  "Perguntas que funcionam como espelhos: 'Isso é dor da alma ou vaidade ferida? Você quer crescer ou ser acolhido como criança eterna?' (.|.SbPd.|.p.4).",
  "Nem toda dor precisa ser protegida; algumas precisam ser escutadas com firmeza e atravessadas com lucidez (.|.SbPd.|.p.5).",
  "Silêncio do mestre pode ser ensinamento mais potente do que mil palavras — não é negligência, é pedagogia (.|.SbPd.|.p.6).",
  "O ego ferido quer colo; a alma ferida quer verdade — o Mestre comprometido com a alma sabe dizer 'não' quando necessário (.|.SbPd.|.p.6).",
  "O acolhimento incondicional é projeção infantilizada que impede a travessia; acolher não é confirmar (.|.SbPd.|.p.7).",
  "A pedagogia iniciática é anticíclica à lógica afetiva contemporânea: exige verticalidade simbólica mais que empatia ininterrupta (.|.SbPd.|.p.8).",
  "A idealização do mestre como figura eternamente acolhedora é tentativa de controle que mantém o ego no centro (.|.SbPd.|.p.7).",
  "Entregar-se ao caminho é abrir mão da necessidade de controlar a experiência; é sustentar a presença mesmo quando a narrativa interna desmorona (.|.SbPd.|.p.10).",
  "Só quando a imagem cai — e o discípulo permanece — a iniciação de fato começa (.|.SbPd.|.p.10).",
  "Frustração revela o intervalo entre aquilo que se esperava e aquilo que é: mostra onde há apego e projeção (.|.SbPd.|.p.11).",
  "Na paideía, educar significava romper hábitos e impulsos; esse rompimento é doloroso e necessário (.|.SbPd.|.p.11).",
  "A frustração impede acomodação na forma anterior; é a pressão que revela o que precisa ser deposto (.|.SbPd.|.p.11).",
  "Quando a frustração surge, a pergunta vital é: 'o que exatamente foi frustrado?' — ela revela a expectativa não vista (.|.SbPd.|.p.11).",
  "Um caminho que não frustra nada oferece conforto, não travessia — conforto prolongado é antídoto contra transformação (.|.SbPd.|.p.12).",
  "Estrutura que convoca elaboração transforma mágoa em campo dialético, espelho coletivo e fermento de crescimento (.|.SbPd.|.p.12).",
  "A verdadeira escuta da frustração não busca culpados, mas clareza e metabolização transformadora (.|.SbPd.|.p.13).",
  "Há um momento silencioso em que o iniciado passa de reagir como lesado a perguntar 'o que em mim foi frustrado?'; daí começa o processo (.|.SbPd.|.p.13).",
  "Um mestre que dobra-se a todo gesto de mágoa falha com o discípulo: o cuidado verdadeiro não reforça a ilusão (.|.SbPd.|.p.6).",
  "Sustentar presença não é omissão: é cuidado que não endossa a ilusão, mas sustenta o processo até a autorrevelação (.|.SbPd.|.p.6).",
  "A pedagogia iniciática esculpe presenças mais que seguir manuais; não protege do impacto, mas cria condições para que ele seja passagem (.|.SbPd.|.p.14).",
  "A frustração é pressão seletiva: revela desejos ocultos que tentam se infiltrar no processo como entrega (.|.SbPd.|.p.11).",
  "A escuta compassiva existe — e o silêncio absoluto pode ser abuso —, porém escutar não implica em subserviência ao ego (.|.SbPd.|.p.5).",
  "O mestre deve discernir quando sustentar presença e quando manter silêncio e firmeza; ser abrigo sem virar refém da expectativa (.|.SbPd.|.p.6).",
  "A entrega verdadeira não exclui a crítica: o discípulo entregue pode discordar sem abandonar o processo (.|.SbPd.|.p.10).",
  "Idealizar é resistência: enquanto se idealiza, mantém-se fantasia de controle e permanece-se no centro da cena (.|.SbPd.|.p.10).",
  "Quando a imagem cai e o discípulo permanece, a iniciação começa; permanecer é sinal de entrega real (.|.SbPd.|.p.10).",
  "A frustração bem trabalhada transforma mágoa em recurso de revelação — não em ameaça que paralisa (.|.SbPd.|.p.12).",
  "A estrutura não existe para evitar atrito, mas para metabolizá-lo em transformação; a elaboração coletiva é essencial (.|.SbPd.|.p.12).",
  "O rito não se curva à sensibilidade momentânea; exige a síntese entre compaixão e firmeza (.|.SbPd.|.p.8).",
  "O verdadeiro mestre não evita dores, mas não mente diante delas: responsabilidade é não iludir (.|.SbPd.|.p.6).",
  "A pedagogia iniciática não visa aprovação do iniciado, mas revelar seu eixo: escolher verdade em vez de confirmação (.|.SbPd.|.p.14).",
  "Frustração permanente sem elaboração vira trauma; frustração com elaboração vira passagem (.|.SbPd.|.p.12).",
  "O mestre trabalha para sustentar a frustração no tempo certo e no grau justo — nem paralisante, nem descartável (.|.SbPd.|.p.12).",
  "A escuta simbólica refinada exige percepções das resistências e discernimento sobre o que está em jogo (.|.SbPd.|.p.14).",
  "A idealização do acolhimento total transforma o rito em terapia e o templo em consultório emocional (.|.SbPd.|.p.8).",
  "Saber dizer 'não' no momento certo é um gesto de verdadeiro cuidado iniciático (.|.SbPd.|.p.6).",
  "A alma suporta o não; o ego exige que tudo seja sim — reconhecer essa diferença é aprendizagem (.|.SbPd.|.p.3).",
  "Um mestre autêntico sustenta o outro até que ele mesmo possa se ver com honestidade — mesmo que isso gere afastamento temporário (.|.SbPd.|.p.6).",
  "A travessia se renova cada vez que o sujeito escolhe a verdade em vez da confirmação; isso é iniciação viva (.|.SbPd.|.p.14).",
  "A verdadeira entrega é transformar a própria ferida em espelho e oferenda para diálogo honesto, não em arma de exigência (.|.SbPd.|.p.10).",
  "A pedagogia iniciática é amor comprometido com a verdade que liberta — não afeto sensível, mas responsabilidade (.|.SbPd.|.p.15)."
];



// sessões: chave `${channelId}:${userId}` -> { index, answers, ... }
const sessions = new Map();
function sessionKey(channelId, userId) {
  return `${channelId}:${userId}`;
}

client.once('ready', () => {
  console.log(`Bot logado como ${client.user.tag}`);
});

// Busca threads/tópicos de prontuário por aproximação de nome
async function buscarProntuariosPorNome(guild, query) {
  if (!PRONTUARIO_CHANNEL_ID) return [];
  const prontuarioChannel = guild.channels.cache.get(PRONTUARIO_CHANNEL_ID);
  if (!prontuarioChannel) return [];

  query = query.toLowerCase().trim();
  if (!query) return [];

  // Garante que temos as threads carregadas (ativas + arquivadas)
  await prontuarioChannel.threads?.fetchActive?.().catch(() => null);
  await prontuarioChannel.threads?.fetchArchived?.().catch(() => null);

  const threads = prontuarioChannel.threads?.cache;
  if (!threads || threads.size === 0) return [];

  // Função simples de "similaridade"
  function scoreName(name) {
    const n = name.toLowerCase();
    if (n === query) return 100;
    if (n.startsWith(query)) return 80;
    if (n.includes(query)) return 60;

    // Pontuação por caracteres em comum
    let common = 0;
    for (const ch of query) {
      if (n.includes(ch)) common++;
    }
    return common;
  }

  // Monta lista com pontuações
  const scored = [];
  for (const thread of threads.values()) {
    if (!thread.name) continue;
    const s = scoreName(thread.name);
    if (s > 0) {
      scored.push({ thread, score: s });
    }
  }

  // Ordena por score desc e pega top 3
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(x => x.thread);
}


// Envia relatório para o canal de prontuário (fórum ou texto+thread)
async function enviarParaProntuario(message, reportText) {
  const guild = message.guild;
  if (!guild) return;
  if (!PRONTUARIO_CHANNEL_ID) return;

  const prontuarioChannel = guild.channels.cache.get(PRONTUARIO_CHANNEL_ID);
  if (!prontuarioChannel) return;

  const member = message.member ?? await guild.members.fetch(message.author.id).catch(() => null);
  const displayName = member ? member.displayName : message.author.username;
  const threadName = displayName;

  // Fórum
  if (prontuarioChannel.type === 15) {
    await prontuarioChannel.threads.fetchActive();
    await prontuarioChannel.threads.fetchArchived();

    let existingThread = prontuarioChannel.threads.cache.find(t => t.name === threadName);
    if (!existingThread) {
      existingThread = await prontuarioChannel.threads.create({
        name: threadName,
        message: { content: `Prontuário de ${message.author} iniciado.` }
      });
    }

    if (reportText.length > 1800) {
      await existingThread.send('Relatório de entrevista:\n```txt');
      for (let i = 0; i < reportText.length; i += 1800) {
        const chunk = reportText.slice(i, i + 1800);
        await existingThread.send(chunk);
      }
      await existingThread.send('```');
    } else {
      await existingThread.send('Relatório de entrevista:\n```txt\n' + reportText + '\n```');
    }
    return;
  }

  // Canal de texto com threads
  if (prontuarioChannel.isTextBased && prontuarioChannel.isTextBased()) {
    await prontuarioChannel.threads.fetchActive();
    await prontuarioChannel.threads.fetchArchived();

    let existingThread = prontuarioChannel.threads.cache.find(t => t.name === threadName);
    if (!existingThread) {
      existingThread = await prontuarioChannel.threads.create({
        name: threadName,
        type: 11,
        autoArchiveDuration: 10080,
        reason: `Prontuário de ${message.author.tag}`
      });
    }

    if (reportText.length > 1800) {
      await existingThread.send('Relatório de entrevista:\n```txt');
      for (let i = 0; i < reportText.length; i += 1800) {
        const chunk = reportText.slice(i, i + 1800);
        await existingThread.send(chunk);
      }
      await existingThread.send('```');
    } else {
      await existingThread.send('Relatório de entrevista:\n```txt\n' + reportText + '\n```');
    }
  }
}

// Pegar/criar thread/tópico de prontuário para um usuário
async function getOrCreateProntuarioThread(guild, user) {
  if (!PRONTUARIO_CHANNEL_ID) return null;
  const prontuarioChannel = guild.channels.cache.get(PRONTUARIO_CHANNEL_ID);
  if (!prontuarioChannel) return null;

  const member = await guild.members.fetch(user.id).catch(() => null);
  const displayName = member ? member.displayName : user.username;
  const threadName = displayName;

  // Fórum
  if (prontuarioChannel.type === 15) {
    await prontuarioChannel.threads.fetchActive();
    await prontuarioChannel.threads.fetchArchived();

    let thread = prontuarioChannel.threads.cache.find(t => t.name === threadName);
    if (!thread) {
      thread = await prontuarioChannel.threads.create({
        name: threadName,
        message: { content: `Prontuário de ${user} iniciado.` }
      });
    }
    return thread;
  }

  // Canal de texto com threads
  if (prontuarioChannel.isTextBased && prontuarioChannel.isTextBased()) {
    await prontuarioChannel.threads.fetchActive();
    await prontuarioChannel.threads.fetchArchived();

    let thread = prontuarioChannel.threads.cache.find(t => t.name === threadName);
    if (!thread) {
      thread = await prontuarioChannel.threads.create({
        name: threadName,
        type: 11,
        autoArchiveDuration: 10080,
        reason: `Prontuário de ${user.tag}`
      });
    }
    return thread;
  }

  return null;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const channelId = message.channel.id;
  const userId = message.author.id;

  // 1) COMANDOS
  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    if (command === 'entrevistaentrada') {
      const targetMember =
        message.mentions.members.first() ||
        (args[0]
          ? await message.guild.members.fetch(args[0]).catch(() => null)
          : message.member);

      if (!targetMember) {
        await message.reply('Indique quem será entrevistado. Exemplo: `!entrevistaentrada @fulano` ou `!entrevistaentrada ID`.');
        return;
      }

      const target = targetMember.user;
      const keyEntrevista = sessionKey(channelId, target.id);

      if (sessions.has(keyEntrevista)) {
        await message.reply(
          `Já existe uma entrevista em andamento neste canal para ${target}. ` +
          'Peça para a pessoa responder às perguntas ou digitar "CANCELAR" para encerrar.'
        );
        return;
      }

      sessions.set(keyEntrevista, {
        index: 0,
        answers: [],
        entrevistadoId: target.id,
        iniciadoPorId: message.author.id
      });

      const intro =
        'Saudações a quem se aproxima, ' + target.toString() + '\n\n' +
        'Iniciaremos agora a **Entrevista de Entrada**.\n\n' +
        'Este é um espaço para que você se **apresente com clareza e sinceridade**, ' +
        'falando sobre a sua história, seus vínculos, sua forma de se relacionar e de responder ao chamado.\n\n' +
        'É **fundamental** que você se expresse com abertura: apenas se houver uma boa comunicação ' +
        'e uma exposição pessoal consistente é que os .|.M.|. poderão autorizar o prosseguimento do seu caminho.\n\n' +
        'Responda com calma, usando suas próprias palavras. Não há respostas “certas”, mas há **verdade** ou não nas suas colocações.\n\n' +
        'Você pode cancelar a qualquer momento digitando **CANCELAR**.\n\n' +
        `Vamos começar.\n\n` +
        `Pergunta 1/${QUESTIONS.length}:\n` +
        `**${QUESTIONS[0]}**`;

      await message.channel.send(intro);
      return;
    }

    if (command === 'frase') {
      const random = FRASES[Math.floor(Math.random() * FRASES.length)];
      await message.channel.send(random);
      return;
    }

    if (command === 'prontuario') {
      const rawQuery = args.join(' ').trim();

      if (!rawQuery) {
        await message.reply(
          'Use assim: `!prontuario Nome`.\n' +
          'Por exemplo: `!prontuario .|.Neo.|.Fulano.|.` ou parte do nome.'
        );
        return;
      }

      const threads = await buscarProntuariosPorNome(message.guild, rawQuery);

      if (threads.length === 0) {
        await message.reply(`Nenhum prontuário encontrado contendo: \`${rawQuery}\`.`);
        return;
      }

      let resposta = `Encontrei ${threads.length} possível(is) prontuário(s) para \`${rawQuery}\`:\n\n`;
      threads.forEach((t, idx) => {
        resposta += `${idx + 1}) **${t.name}**\n${t.url}\n\n`;
      });

      await message.reply(resposta);
      return;
    }


    return;
  }

  // 2) SESSÃO: entrevistado é quem responde
  const key = sessionKey(channelId, userId);
  const session = sessions.get(key);

  // Se NÃO está em entrevista, mas mencionou o bot → responde FRASE
  if (!session && message.mentions.has(client.user)) {
    const random = FRASES[Math.floor(Math.random() * FRASES.length)];
    await message.reply(random);
    return;
  }

  // Se não tem sessão e não é menção -> ignora
  if (!session) return;

  const content = message.content.trim();

  if (content.toUpperCase() === 'CANCELAR') {
    sessions.delete(key);
    await message.reply(
      'Entrevista cancelada.\n' +
      'Se quiser recomeçar em outro momento, utilize o comando `!EntrevistaEntrada`.'
    );
    return;
  }

  // Registra resposta
  session.answers[session.index] = content;
  session.index++;

  if (session.index < QUESTIONS.length) {
    const nextNumber = session.index + 1;
    await message.channel.send(
      `${message.author} Pergunta ${nextNumber}/${QUESTIONS.length}:\n` +
      `**${QUESTIONS[session.index]}**`
    );
    return;
  }

  // Finalizou — monta relatório
  const now = new Date();
  const dataISO = now.toISOString();

  let reportText = '';
  reportText += `Relatório da Entrevista de Entrada\n`;
  reportText += `---------------------------------\n`;
  reportText += `Usuário : ${message.author.tag} (${message.author.id})\n`;
  reportText += `Canal  : #${message.channel.name} (${channelId})\n`;
  reportText += `Data   : ${dataISO}\n`;
  reportText += `---------------------------------\n\n`;

  QUESTIONS.forEach((q, i) => {
    const ans = session.answers[i] || '[sem resposta]';
    reportText += `Q${i + 1}) ${q}\n`;
    reportText += `R${i + 1}) ${ans}\n\n`;
  });

  sessions.delete(key);

  let mestresMention = '@.|.M.|.';
  if (MESTRES_ROLE_ID) {
    const role = message.guild.roles.cache.get(MESTRES_ROLE_ID);
    if (role) mestresMention = role.toString();
  }

  const header = `${mestresMention} Relatório de entrevista de ${message.author}:\n`;

  if (reportText.length > 1800) {
    await message.channel.send(header);
    for (let i = 0; i < reportText.length; i += 1800) {
      const chunk = reportText.slice(i, i + 1800);
      await message.channel.send('```txt\n' + chunk + '\n```');
    }
  } else {
    await message.channel.send(header + '```txt\n' + reportText + '```');
  }

  await enviarParaProntuario(message, reportText);

  await message.reply(
    'Entrevista concluída.\n' +
    'Suas respostas foram registradas e os .|.M.|. serão acionados para avaliação.'
  );
});

client.login(TOKEN);
