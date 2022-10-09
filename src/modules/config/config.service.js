import fs from 'fs';

const configJson = fs.readFileSync('./config.json', 'utf8');
const configRaw = JSON.parse(configJson);
const config = {
    firstWeekDate: configRaw.firstWeekDate.value,
    teachers: configRaw.teachers.value,
}

export const configService = {
    config,
    get: (key) => config[key]
}
