import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const scheduleURL =
  process.env.SCHEDULE_URL || 'https://education.ugi.edu.ua/cgi-bin/timetable.cgi?';

let groupArr, teacherArr;

async function getArrTeacher() {
  const teacherUrl = `${scheduleURL}n=701&lev=141`;
  teacherArr = await getArr(teacherUrl);
  return teacherArr;
}
async function getArrGroup() {
  const groupUrl = `${scheduleURL}n=701&lev=142`;
  groupArr = await getArr(groupUrl);
  return groupArr;
}

async function getArr(url: string): Promise<string[]> {
  let arr: string[] = [];
  try {
    await fetch(url)
      .then((res) => res.textConverted())
      .then((response) => (arr = JSON.parse(response)['suggestions']))
      .catch((err) => {
        arr = ['error'];
      });
  } catch (e) {
    console.log(e);
  }
  return arr;
}
export { getArrTeacher, getArrGroup };
