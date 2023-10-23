import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import { User } from '../../db/models/User';
import { weatherToday } from '../../utils/get-weather-today';

export default {
    data: new SlashCommandBuilder()
        .setName('weather-channel')
        .setDescription('Todays weather from users saved location. Broadcasts to channel.'),
    execute: async function (interaction: CommandInteraction) {
        const { postcode } = await User.query().where({ user_id: interaction.user.id }).first();
        if (!postcode) {
            return interaction.reply({
                content: "You haven't set a postcode! set with `/set-postcode`",
                ephemeral: true,
            });
        }

        const weather = await weatherToday(postcode, process.env.WW_TOKEN);
        if (!weather) {
            return interaction.reply({
                content: `Error retrieving weather data for ${postcode}`,
                ephemeral: true,
            });
        }

        return interaction.reply({
            content:
                `**${weather.stationName}** - ${weather.forecastWords} with a max of **${
                    weather.forecastMax
                }°C** and min of **${weather.forecastMin}°C**. **${
                    weather.rainChance
                }%** chance of **${weather.rainRangeStart === '0' ? '' : weather.rainRangeStart} ${
                    weather.rainRangeDivide
                } ${weather.rainRangeEnd}mm** of rain. \n` +
                `Currently **${weather.currentTemp}°C** @  **${weather.currentHumidity}%** humidity. Wind is **${weather.windSpeed}km/h** from the **${weather.windDir}**. Total rainfall today **${weather.rainTotal}mm**.\n`,
            ephemeral: false,
        });
    },
};
