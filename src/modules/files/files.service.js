import fs from 'fs/promises';

export const filesService = {
    mkDirIfNotExists: async (path) => {
        try {
            await fs.access(path);
        } catch (e) {
            await fs.mkdir(path);
        }
    },

    rmDirIfExists: async (path) => {
        try {
            await fs.access(path);
            await fs.rm(path, { recursive: true });
        } catch (e) {}
    },

    createFiles: async (outputFolder, teacherName, results) => {
        const { origin, plainOrigin, googleCalendarCsv, allGoogleCalendarCsv } = results;
        const filename = teacherName.replaceAll(' ', '_');

        await filesService.mkDirIfNotExists(outputFolder);

        if (origin) {
            const folder = `${outputFolder}/origin`;
            await filesService.mkDirIfNotExists(folder);
            const filepath = `${folder}/${filename}.json`;
            await fs.writeFile(filepath, JSON.stringify(origin, null, 2), 'utf8');
        }

        if (plainOrigin) {
            const folder = `${outputFolder}/plainOrigin`;
            await filesService.mkDirIfNotExists(folder);
            const filepath = `${folder}/${filename}.json`;
            await fs.writeFile(filepath, JSON.stringify(origin, null, 2), 'utf8');
        }

        if (googleCalendarCsv) {
            const folder = `${outputFolder}/calendar`;
            await filesService.mkDirIfNotExists(folder);
            const filepath = `${folder}/${filename}.csv`;
            await fs.writeFile(filepath, googleCalendarCsv, 'utf8');
        }

        if (allGoogleCalendarCsv) {
            await filesService.mkDirIfNotExists(outputFolder);
            const filepath = `${outputFolder}/calendar-all.csv`;
            await fs.writeFile(filepath, allGoogleCalendarCsv, 'utf8');
        }
    }
}
