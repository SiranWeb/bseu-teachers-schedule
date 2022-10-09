import fetch from "node-fetch";
import { JSDOM } from 'jsdom';
import encodeWin1251ToUrl from "./utils/encodeWin1251ToUrl.js";
import actions from "./actions.js";

const api = {
  getTeachersList: async ({ teacherName }) => {
    const teachersListAction = actions.getTeachersListAction();
    const body = `__act=${teachersListAction}&tname=${teacherName}`;
    const response = await fetch('http://bseu.by/schedule/', {method: 'POST', body });
    return await response.json();
  },
  getSchedulePage: async ({
      faculty = -1,
      form = -1,
      course = -1,
      group = -1,
      period = 3,
      teacherName,
      action,
    }) => {
    const body = `faculty=${faculty}&form=${form}&course=${course}&group=${group}&tname=${encodeWin1251ToUrl(teacherName)}&period=${period}&__act=${action}`;
    const response = await fetch('http://bseu.by/schedule/', {method: 'POST', body });
    const arrayBuffer = await response.arrayBuffer();
      const decoder = new TextDecoder('windows-1251');
      const text = decoder.decode(arrayBuffer);
      return new JSDOM(text);
  }
}

export default api;