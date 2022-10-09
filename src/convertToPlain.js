const convertToPlain = data => {
  const result = [];

  for (const [weekNum, days] of Object.entries(data)) {
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
}

export default convertToPlain;
