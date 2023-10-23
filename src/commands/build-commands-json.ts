import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Scans the commands directory and gathers all commands and builds the JSON
 * payload for command registration
 */
export async function buildCommandsJSON() {
    const rootDir = path.join(__dirname);
    const rootDirContent = await fs.readdir(rootDir, { withFileTypes: true });
    const commandFolders = rootDirContent
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => path.join(rootDir, dirent.name));

    const commands: string[] = [];

    for (const folder of commandFolders) {
        const commandFolderContents = await fs.readdir(folder);
        const commandFiles = commandFolderContents.filter((file) => file.endsWith('.ts'));

        const commandImports = commandFiles.map((file) => {
            const filePath = path.join(folder, file);
            return import(filePath).then((command) => {
                if ('data' in command.default && 'execute' in command.default) {
                    commands.push(command.default.data.toJSON());
                } else {
                    console.log(
                        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
                    );
                }
            });
        });

        await Promise.all(commandImports);
    }

    return commands;
}
