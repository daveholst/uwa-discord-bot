import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import { User } from '../../db/models/User';

export default {
    data: new SlashCommandBuilder()
        .setName('set-postcode')
        .setDescription('Set your postcode for the weather command')
        .addStringOption((option) =>
            option
                .setName('postcode')
                .setDescription('Enter your postcode to use for getting localized weather')
                .setRequired(true),
        ),
    execute: async function execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isCommand()) return;
        const { id, username } = interaction.user;
        const postcode = interaction.options.getString('postcode');

        //TODO refactor this to make it better with new ORM -- does it have an upsert concept???
        try {
            let user = await User.query().findById(id);

            if (!user) {
                user = await User.query().insertAndFetch({
                    user_id: id,
                    username,
                    postcode,
                });

                return interaction.reply({
                    content: `User: ${user.username} CREATED with postcode set to ${user.postcode}`,
                    ephemeral: true,
                });
            }

            await User.query().findById(id).patch({ postcode });

            return interaction.reply({
                content: `User: ${username} UPDATED with postcode set to ${postcode}`,
                ephemeral: true,
            });
        } catch (error) {
            return interaction.reply(`Error in setPostcode: ${error.message}`);
        }
    },
};
