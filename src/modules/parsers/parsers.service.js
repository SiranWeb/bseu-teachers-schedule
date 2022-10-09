export const parsersService = {
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
