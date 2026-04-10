// bot.js
const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error('Defina a variável de ambiente DISCORD_TOKEN.');
  process.exit(1);
}

// TROQUE PELO ID REAL DA ROLE QUE REPRESENTA @.|.M.|.
const MESTRES_ROLE_ID = '546834826989273088';

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
  "A ética não é código fechado, é caminho — perguntas contínuas como 'de onde estou falando?' sustentam a integridade (.|.CdEt.|.p.85–87)."
];



// chave: `${channelId}:${userId}` -> { index, answers }
const sessions = new Map();

function sessionKey(channelId, userId) {
  return `${channelId}:${userId}`;
}

client.once('ready', () => {
  console.log(`Bot logado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const channelId = message.channel.id;
  const userId = message.author.id;
  const key = sessionKey(channelId, userId);

  // Comandos
  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    // Entrevista de Entrada de incautos
    if (command === 'entrevistaentrada') {
      if (sessions.has(key)) {
        await message.reply(
          'Você já tem uma entrevista em andamento neste canal. ' +
          'Responda às perguntas ou digite "CANCELAR" para encerrar.'
        );
        return;
      }

      sessions.set(key, {
        index: 0,
        answers: []
      });

      const intro =
        'Saudações a quem se aproxima, ' + message.author.toString() + '\n\n' +
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

    // comando !frase
    if (command === 'frase') {
      const random = FRASES[Math.floor(Math.random() * FRASES.length)];
      await message.channel.send(random);
      return;
    }
    
    return;
  }

  // Respostas de quem está em sessão
  const session = sessions.get(key);
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

  // Finalizou — monta relatório legível
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

  // Obter menção verdadeira da role .|.M.|.
  let mestresMention = '@.|.M.|.'; // fallback textual
  if (MESTRES_ROLE_ID) {
    const role = message.guild.roles.cache.get(MESTRES_ROLE_ID);
    if (role) mestresMention = role.toString();
  }

  const header = `${mestresMention} Relatório de entrevista de ${message.author}:\n`;

  // Se for muito longo, dividir em blocos
  if (reportText.length > 1800) {
    await message.channel.send(header);
    for (let i = 0; i < reportText.length; i += 1800) {
      const chunk = reportText.slice(i, i + 1800);
      await message.channel.send('```txt\n' + chunk + '\n```');
    }
  } else {
    await message.channel.send(header + '```txt\n' + reportText + '```');
  }

  await message.reply(
    'Entrevista concluída.\n' +
    'Suas respostas foram registradas e os .|.M.|. serão acionados para avaliação.'
  );
});

client.login(TOKEN);
