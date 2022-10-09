import fs from 'fs/promises';

export const filesService = {
    createFiles: async (teacherName, results) => {
        const { origin, plainOrigin } = results;

        const folder = `./output/${teacherName.replaceAll(' ', '_')}`;
        try {
            await fs.access(folder);
        } catch (e) {
            await fs.mkdir(`./output/${teacherName.replaceAll(' ', '_')}`);
        }

        const originFilePath = `./output/${teacherName.replaceAll(' ', '_')}/origin.json`;
        const plainOriginFilePath = `./output/${teacherName.replaceAll(' ', '_')}/plainOrigin.json`;
        await fs.writeFile(originFilePath, JSON.stringify(origin, null, 2), 'utf8');
        await fs.writeFile(plainOriginFilePath, JSON.stringify(plainOrigin, null, 2), 'utf8');
    }
}
