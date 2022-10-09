const actions = {
  getTeachersListAction: () => '__id.24.main.TSchedA.getTeachers',
  getTeacherScheduleAction: ({ tid, taid, sid }) => {
    let action = `tid.${String(tid).length}.${String(tid)}`;
    action += `taid.${String(taid).length}.${String(taid)}`;
    action += `sid.${String(sid).length}.${String(sid)}`;
    action += '__id.22.main.TSchedA.GetTSched__sp.8.tresults__fp.4.main';
    return action;
  }
}

export default actions;