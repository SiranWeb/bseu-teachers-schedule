import { filesService } from './modules/files/files.service.js';
import { parsersService } from './modules/parsers/parsers.service.js';
import { teachersService } from './modules/teachers/teachers.service.js';

(async () => {
  const rawTeacherName = 'Булова Александр Дмитриевич'; // TODO

  const teachersListAction = teachersService.getTeachersListAction();
  const [foundTeacher] = await teachersService.getTeachersListByRequest(rawTeacherName, teachersListAction);

  if (!foundTeacher) {
    console.log('Преподаватель не найден.');
    process.exit(0);
  }

  const teacherName = foundTeacher.tname;

  console.log(`\nПреподаватель: ${teacherName}`)
  console.log(`tid: ${foundTeacher.tid}; sid: ${foundTeacher.sid}; taid: ${foundTeacher.taid}`)
  console.log('\nНачинаю получение расписания на семестр...');

  const teacherScheduleAction = teachersService.getTeacherScheduleAction(foundTeacher.tid, foundTeacher.taid, foundTeacher.sid);
  const schedulePage = await teachersService.getSchedulePageByRequest(teacherName, teacherScheduleAction);

  const origin = parsersService.parseSemesterSchedulePage(schedulePage);
  const plainOrigin = parsersService.convertOriginToPlain(origin);


  if (Object.keys(origin).length === 0) {
    console.log('Расписание не найдено!');
    process.exit(0);
  }


  await filesService.createFiles(foundTeacher.tname, {
    origin, plainOrigin,
  });

  process.exit(0);

})();
