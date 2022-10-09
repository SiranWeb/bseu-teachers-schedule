import { filesService } from './modules/files/files.service.js';
import { parsersService } from './modules/parsers/parsers.service.js';
import { teachersService } from './modules/teachers/teachers.service.js';
import { configService } from './modules/config/config.service.js';

(async () => {
  const teachers = configService.get('teachers');
  const firstWeekDate = configService.get('firstWeekDate');

  console.log('Скрипт подготовил: Кирилл Герасименко');

  let successCount = 0;
  let failureCount = 0;
  for (const rawTeacherName of teachers) {
    const teachersListAction = teachersService.getTeachersListAction();
    const [foundTeacher] = await teachersService.getTeachersListByRequest(rawTeacherName, teachersListAction);

    if (!foundTeacher) {
      console.log(`Преподаватель ${rawTeacherName} не найден.`);
      failureCount++;
      continue;
    }

    const teacherName = foundTeacher.tname;

    const teacherScheduleAction = teachersService.getTeacherScheduleAction(foundTeacher.tid, foundTeacher.taid, foundTeacher.sid);
    let schedulePage;
    try {
      schedulePage = await teachersService.getSchedulePageByRequest(teacherName, teacherScheduleAction);
    } catch (e) {
      console.log(`Не удалось получить расписание для ${teacherName}. Ошибка:`, e);
      failureCount++;
      continue;
    }

    const origin = parsersService.parseSemesterSchedulePage(schedulePage);
    const plainOrigin = parsersService.convertOriginToPlain(origin);
    let googleCalendarCsv;
    if (firstWeekDate) {
      googleCalendarCsv = parsersService.createGoogleCalendarCsvFromPlainOrigin(plainOrigin, teacherName);
    }


    if (Object.keys(origin).length === 0) {
      console.log(`Расписание пустое для ${teacherName}`);
      failureCount++;
      continue;
    }

    const outputFolder = './output';
    await filesService.rmDirIfExists(outputFolder);
    await filesService.createFiles(outputFolder, teacherName, {
      origin, plainOrigin, googleCalendarCsv
    });

    console.log(`${teacherName}: успешно!`);
    successCount++;
  }

  console.log('\nСкрипт завершен. Результат в директории "./output"');
  console.log(`Удачно: ${successCount}. Ошибки: ${failureCount}`);
  process.exit(0);
})();
