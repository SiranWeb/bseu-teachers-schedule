import { weekDays } from '../constants/weekDays.js';

export const parsersService = {
    createGoogleCalendarCsvFromPlainOrigin: (plainOrigin, teacherName, firstWeekDate, allCsv) => {
        const header = '"Subject","Start Date","Start Time","End Date","End Time","All Day Event","Description","Location","Private"\n';
        if (!allCsv) {
            allCsv = header;
        }
        let result = header;
        const shortTeacherName = teacherName.split(' ').reduce((acc, word) => word[0] ? acc + word[0].toUpperCase() : acc, '');

        for (const obj of plainOrigin) {
            const { weekNum, startTime, endTime, type, classroom, dayName, name: subjectName } = obj;
            const shortSubjectName = subjectName.replace(/-/gm, ' ').split(' ').reduce((acc, word) => word[0] ? acc + word[0].toUpperCase() : acc, '');
            const location = `БГЭУ: ${classroom}`;
            const groups = obj.group.replace(/<br>/gm, ' ');
            const shortType = type.substr(0, 3).toLowerCase();
            const weekStr = `неделя: ${weekNum}`;
            const dayDiff = (weekDays[dayName] - firstWeekDate.getDay()) + ((+weekNum - 1) * 7);

            const startDate = new Date(firstWeekDate.getTime());
            startDate.setDate(startDate.getDate() + dayDiff);
            const [year, month, day] = startDate.toJSON().split('T')[0].split('-');
            const dateStr = `${month}/${day}/${year}`;

            const subjectCol = `"${shortTeacherName}; ${location}; (${shortSubjectName}); ${groups}; (${shortType}); ${weekStr}"`;
            const startDateCol = `"${dateStr}"`;
            const startTimeCol = `"${startTime}"`;
            const endDateCol = `"${dateStr}"`;
            const endTimeCol = `"${endTime}"`;
            const allDayEventCol = `"False"`;
            const descriptionCol = `"${teacherName}; ${location}; (${subjectName}); ${groups}; (${type}); ${weekStr}"`;
            const locationCol = `"${location}"`;
            const privateCol = `"True"`;

            const row = `${subjectCol},${startDateCol},${startTimeCol},${endDateCol},${endTimeCol},${allDayEventCol},${descriptionCol},${locationCol},${privateCol}`;
            result += `${row}\n`;
            allCsv += `${row}\n`;
        }

        return {singleCsv: result, allCsv};
    },

    convertOriginToPlain: (origin) => {
        const result = [];

        for (const [weekNum, days] of Object.entries(origin)) {
            for (const [dayName, info] of Object.entries(days)) {
                info.forEach(content => {
                    result.push({
                        ...content,
                        weekNum,
                        dayName,
                    })
                })
            }
        }

        return result;
    },

    parseSemesterSchedulePage: (page) => {
        let currentDay = null;
        let weekNums = [];
        const result = {};

        const weeksRegex = /\([\d\s\-,]+\)/;

        const tableRows = page.window.document.body.querySelectorAll('tbody > tr');
        tableRows.forEach(row => {
            const subject = {};
            const cells = row.querySelectorAll('td');

            cells.forEach((cell, index) => {

                if (cell.className === 'wday') {
                    currentDay = cell.innerHTML.trim();
                    return;
                }

                // time
                if (index === 0) {
                    subject.time = cell.innerHTML.trim();
                    const [startTime, endTime] = subject.time.split('-');
                    subject.startTime = startTime;
                    subject.endTime = endTime;
                    return;
                }

                // group
                if (index === 1) {
                    subject.group = cell.innerHTML.trim();
                    return;
                }

                // info
                if (index === 2) {
                    weekNums = [];
                    const [rawWeekNumsPeriods] = cell.innerHTML.match(weeksRegex);

                    const weekNumsPeriods = rawWeekNumsPeriods.substr(1, rawWeekNumsPeriods.length - 2).split(',');
                    weekNumsPeriods.forEach(period => {
                        const periodArr = period.split('-');
                        if (periodArr.length === 1) {
                            weekNums.push(+periodArr[0]);
                        } else if (periodArr.length === 2) {
                            for (let i = +periodArr[0]; i <= +periodArr[1]; i++) {
                                weekNums.push(i);
                            }
                        }
                    });

                    subject.name = cell.querySelector('em').innerHTML.trim();
                    subject.type = cell.querySelector('.distype').innerHTML.trim();
                }

                // classroom
                if (index === 3) {
                    subject.classroom = cell.innerHTML.trim();
                    return;
                }
            })

            if (Object.keys(subject).length === 0) {
                return;
            }

            weekNums.forEach(weekNum => {
                if (!result[weekNum]) {
                    result[weekNum] = {};
                }

                if (result[weekNum]?.[currentDay]) {
                    result[weekNum][currentDay].push(subject);
                } else {
                    result[weekNum][currentDay] = [subject];
                }
            })
        });
        return result;
    }
}
