import { CommandInteraction, SlashCommandBuilder, codeBlock } from 'discord.js';
import * as asTable from 'as-table';

import { User } from '../../db/models/User';
import { weatherForecast } from '../../utils/get-weather-forecast';

export default {
    data: new SlashCommandBuilder()
        .setName('forecast')
        .setDescription('Weather forecast from saved location'),
    execute: async function (interaction: CommandInteraction) {
        const { postcode } = await User.query().where({ user_id: interaction.user.id }).first();
        if (!postcode) {
            return interaction.reply({
                content: "You haven't set a postcode! set with `/set-postcode`",
                ephemeral: true,
            });
        }
        const weather = await weatherForecast(postcode, process.env.WW_TOKEN);
        if (!weather) {
            return interaction.reply({
                content: `Error retrieving weather data for ${postcode}`,
                ephemeral: true,
            });
        }

        return interaction.reply({
            content: `Forecast for **${weather.station}**\n` + codeBlock(asTable(weather.forecast)),
            ephemeral: true,
        });
    },
};
