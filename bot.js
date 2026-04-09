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
