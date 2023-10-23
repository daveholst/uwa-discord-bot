import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { quotes } from '../../quotes/rami-quotes.json';

function getRandomQuote(quotes: string[]) {
    return quotes[Math.floor(quotes.length * Math.random())];
}

export default {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Replies with a quote from the Rami Quotes DB!'),
    execute: async function (interaction: CommandInteraction) {
        await interaction.reply(getRandomQuote(quotes));
    },
};
