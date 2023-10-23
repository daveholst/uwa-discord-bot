import { Client, Events, GatewayIntentBits } from 'discord.js';

import { logger } from './utils/discord-logger';
import { handleCommand } from './commands/handle-command';
import { createSchema } from './db/knex';

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    await createSchema();
    console.log('Connected to Database');
    logger.info({
        message: 'Production Server Online & Connected to Database',
    });
});
/** Handle slash commands */
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    handleCommand(interaction);
});

client.login(token);
