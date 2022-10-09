import fetch from 'node-fetch';
import {encodingService} from '../encoding/encoding.service.js';
import {JSDOM} from 'jsdom';

export const teachersService = {

    getTeachersListAction: () => '__id.24.main.TSchedA.getTeachers',
    getTeacherScheduleAction: (tid, taid, sid) => {
        let action = `tid.${String(tid).length}.${String(tid)}`;
        action += `taid.${String(taid).length}.${String(taid)}`;
        action += `sid.${String(sid).length}.${String(sid)}`;
        action += '__id.22.main.TSchedA.GetTSched__sp.8.tresults__fp.4.main';
        return action;
    },

    getTeachersListByRequest: async (teacherName, action) => {
        const body = `__act=${action}&tname=${teacherName}`;
        const response = await fetch('http://bseu.by/schedule/', {method: 'POST', body });
        return await response.json();
    },
    getSchedulePageByRequest: async (teacherName, action) => {
        const encodedTeacherName = encodingService.encodeWin1251ToUrl(teacherName);
        const body = `faculty=-1&form=-1&course=-1&group=-1&tname=${encodedTeacherName}&period=3&__act=${action}`;
        const response = await fetch('http://bseu.by/schedule/', {method: 'POST', body });
        const arrayBuffer = await response.arrayBuffer();
        const decoder = new TextDecoder('windows-1251');
        const text = decoder.decode(arrayBuffer);
        return new JSDOM(text);
    }
}
