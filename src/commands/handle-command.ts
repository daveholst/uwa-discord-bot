import { ChatInputCommandInteraction } from 'discord.js';

import setPostcode from './utility/set-postcode';
import ping from './utility/ping';
import weather from './weather/weather';
import ramiQuote from './quotes/rami-quote';
import forecast from './weather/forecast';
import weatherChannel from './weather/weather-channel';
import forecastChannel from './weather/forecast-channel';

export function handleCommand(interaction: ChatInputCommandInteraction) {
    switch (interaction.commandName) {
        case 'ping':
            return ping.execute(interaction);
        case 'quote':
            return ramiQuote.execute(interaction);
        case 'set-postcode':
            return setPostcode.execute(interaction);
        case 'weather':
            return weather.execute(interaction);
        case 'forecast':
            return forecast.execute(interaction);
        case 'weather-channel':
            return weatherChannel.execute(interaction);
        case 'forecast-channel':
            return forecastChannel.execute(interaction);
        default:
            return interaction.reply(
                `${interaction.commandName} - Command not registered with bot.`,
            );
    }
}
