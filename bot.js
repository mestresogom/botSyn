const { Client, GatewayIntentBits } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error('Defina a variável de ambiente DISCORD_TOKEN.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';
const MENTION_TARGET = '@.|.M.|.'; // texto literal

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
  'Relato sobre o tema: Neste momento, exponha seus pensamentos sobre o tema apresentado.',
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

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const command = args.shift()?.toLowerCase();

    if (command === 'entrevistaentrada') {
      if (sessions.has(key)) {
        await message.reply('Você já tem uma entrevista em andamento neste canal. Responda às perguntas ou digite "CANCELAR" para encerrar.');
        return;
      }

      sessions.set(key, {
        index: 0,
        answers: []
      });

      await message.reply(
        'Saudações em .|.Luz.|.\n' +
        'Iniciaremos agora a Entrevista de Entrada.\n' +
        'Responda às perguntas aqui neste canal, apenas com mensagens de texto.\n' +
        'Para cancelar a qualquer momento, digite **CANCELAR**.\n\n' +
        `Pergunta 1/${QUESTIONS.length}:\n` +
        `**${QUESTIONS[0]}**`
      );
      return;
    }

    return;
  }

  const session = sessions.get(key);
  if (!session) return;

  const content = message.content.trim();

  if (content.toUpperCase() === 'CANCELAR') {
    sessions.delete(key);
    await message.reply('Entrevista cancelada. Se quiser recomeçar, use `!EntrevistaEntrada`.');
    return;
  }

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

  let report = `Relatório da Entrevista de Entrada de ${message.author} (${message.author.id})\n`;
  report += `Canal: #${message.channel.name} (${channelId})\n`;
  report += `Data/hora (UTC): ${new Date().toISOString()}\n\n`;

  QUESTIONS.forEach((q, i) => {
    const ans = session.answers[i] || '[sem resposta]';
    report += `Q${i + 1}: ${q}\n`;
    report += `R: ${ans}\n\n`;
  });

  sessions.delete(key);

  const header = `${MENTION_TARGET} Relatório de entrevista de ${message.author}:\n`;
  if (report.length > 1800) {
    await message.channel.send(header);
    for (let i = 0; i < report.length; i += 1800) {
      await message.channel.send('```txt\n' + report.slice(i, i + 1800) + '\n```');
    }
  } else {
    await message.channel.send(header + '```txt\n' + report + '```');
  }

  await message.reply('Entrevista concluída. Obrigado pelas respostas.');
});

client.login(TOKEN);
