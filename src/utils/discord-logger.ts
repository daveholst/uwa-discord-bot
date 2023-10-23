import { hostname } from 'os';

import { default as DiscordLogger } from 'node-discord-logger';
// This is the logging module that allows the server to log back to the #bot-status channel.
// This Logger will silentely error if no DISCORD_WEBHOOK exists, such as running in a local dev environment.

export const logger = new DiscordLogger({
    hook: process.env.LOGGING_WEBOOK,
    icon: ' https://cdn-icons-png.flaticon.com/512/919/919825.png', // optional, will be included as an icon in the footer
    serviceName: `RamiBot Production on ${hostname}`, // optional, will be included as text in the footer
});
