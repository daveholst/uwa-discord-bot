import { REST, Routes } from 'discord.js';

import { buildCommandsJSON } from './commands/build-commands-json';

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

(async () => {
    const rest = new REST({ version: '9' }).setToken(token);

    rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: await buildCommandsJSON(),
    })
        .then((res: JSON[]) => {
            console.log(`Successfully updated registration for ${res.length} bot commands.`);
        })
        .catch(console.error);
})();
