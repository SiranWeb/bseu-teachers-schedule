import api from "./api.js";
import ask from "./utils/ask.js";
import actions from "./actions.js";
import semesterScheduleParser from "./semesterScheduleParser.js";
import convertToPlain from './convertToPlain.js';
import fs from 'fs/promises';

(async () => {
  const teacherName = await ask('ФИО преподавателя:\n');
  const [foundTeacher] = await api.getTeachersList({ teacherName });

  if (!foundTeacher) {
    console.log('Преподаватель не найден.');
    process.exit(0);
  }

  console.log(`\nПреподаватель: ${foundTeacher.tname}`)
  console.log(`tid: ${foundTeacher.tid}; sid: ${foundTeacher.sid}; taid: ${foundTeacher.taid}`)
  console.log('\nНачинаю получение расписания на семестр...');

  const schedulePage = await api.getSchedulePage({
    teacherName: foundTeacher.tname,
    action: actions.getTeacherScheduleAction({
      taid: foundTeacher.taid,
      sid: foundTeacher.sid,
      tid: foundTeacher.tid,
    })
  });

  const result = semesterScheduleParser(schedulePage);
  const plainResult = convertToPlain(result);


  if (Object.keys(result).length === 0) {
    console.log('Расписание не найдено!');
    process.exit(0);
  }

  const folder = `./output/${foundTeacher.tname.replaceAll(' ', '_')}`;
  try {
    await fs.access(folder);
  } catch (e) {
    await fs.mkdir(`./output/${foundTeacher.tname.replaceAll(' ', '_')}`);
  }

  const oldFilePath = `./output/${foundTeacher.tname.replaceAll(' ', '_')}/oldData.json`;
  const filePath = `./output/${foundTeacher.tname.replaceAll(' ', '_')}/data.json`;
  await fs.writeFile(oldFilePath, JSON.stringify(result, null, 2), 'utf8');
  await fs.writeFile(filePath, JSON.stringify(plainResult, null, 2), 'utf8');
  console.log(`Расписание найдено и записано в файл ${filePath}`);
  process.exit(0);

})();
