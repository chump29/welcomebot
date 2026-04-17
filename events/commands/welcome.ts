import { parse } from "path"

import {
  type ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  type SlashCommandUserOption
} from "discord.js"

import { error } from "../../utils/logger.ts"
import { showWelcome } from "../../utils/showWelcome.ts"

const create = (): RESTPostAPIChatInputApplicationCommandsJSONBody => {
  return new SlashCommandBuilder()
    .setName(parse(import.meta.file).name)
    .setDescription("Send welcome message")
    .addUserOption(
      (option: SlashCommandUserOption): SlashCommandUserOption =>
        option.setName("user").setDescription("User to welcome").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON()
}

const invoke = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const user = interaction.options.getUser("user")
  if (!user) {
    throw new Error("Invalid user")
  }

  await showWelcome(interaction.channel?.client ?? null, user, interaction.guild?.name as string)
    .then(async (): Promise<void> => {
      await interaction
        .reply({
          content: "_ _",
          flags: MessageFlags.Ephemeral
        })
        .then(async (): Promise<void> => {
          await interaction.deleteReply()
        })
    })
    // biome-ignore lint/suspicious/noExplicitAny: catch all errors
    .catch((e: any) => {
      error(e)
      throw e
    })
}

export { create, invoke }
