import cheerio from 'cheerio';
import * as linkify from 'linkifyjs';

type schedule = {
  date?: string;
  day?: string;
  items?: {
    number: string;
    timeBounds: string;
    info: string;
  }[];
}

function getData(html: string): schedule | { vx: string } {
  let data: schedule = {};
  const $ = cheerio.load(html);
  let lesson, numLess;
  if ($('#wrap > div > div > div > div.alert.alert-info').length > 0) return { vx: 'bx' };
  else {
    $('table').each((i, elem) => {
      let trArr = $(elem).find('tr');
      let h4 = $('.col-md-6 h4')[i].childNodes[0];
      // @ts-ignore
      let weekDay: string = h4?.next?.childNodes[0]?.data;
      var data1 = [];
      var z = 0;
      for (var ii = 0; ii < trArr.length; ii++) {
        try {
          // @ts-ignore
          const numLess = trArr[ii].childNodes[0].childNodes[0].data;
          // @ts-ignore
          const timeBounds = trArr[ii].childNodes[1].childNodes;
          // @ts-ignore
          const lesson = trArr[ii].childNodes[2].childNodes[0];
          const buildName = buildNameLess(lesson).trim();
          if (buildName != '') {
            data1.push({
              number: numLess,
              timeBounds: `${timeBounds[0].data}-${timeBounds[2].data}`,
              info: buildName,
            });
          }
          if (z == 0) {
            // @ts-ignore
            data[weekDay] = {
              // @ts-ignore
              date: h4.data.trim(),
              day: weekDay,
              items: data1,
            };
          }
          z++;
        } catch (err) {
          console.log(err);
        }
      }
    });
    return { ...data };
  }
}

function buildNameLess(lessTag: any, names = ''): string {
  if (lessTag.next === null) {
    if (names == undefined) return lessTag.data;
    names = names.replace('\n\n\n', '\n');
    return names;
  }
  if (lessTag.name) {
    if (lessTag.name === 'div') {
      if (lessTag.childNodes.length === 6) {
        const str = lessTag.childNodes[2].data;
        const reg = new RegExp(';', 'ig');
        let arrOfStr,
          st = 0,
          costyl = [];

        while ((arrOfStr = reg.exec(str)) != null) {
          let less = str.slice(st, arrOfStr.index);
          if (linkify.find(less)[0]) {
            let link = linkify.find(less);
            less = less.slice(0, link[0].start - 3);
            if (!parseInt(less)) names += `\n[${less.trim()}](${link[0].href})`;
          } else {
            if (!parseInt(less)) names += '\n' + less.trim();
          }
          costyl.push(st);
          st = arrOfStr.index + 1;
        }
        if (str.slice(st)) names += '\n' + str.slice(st);
        if (lessTag.childNodes[4]?.attribs?.href.length) {
          if (str.slice(st)) {
            names = names.replace(
              str.slice(st),
              `[${str.slice(st, str.length - 2)}](${lessTag.childNodes[4]?.attribs?.href})`,
            );
            names = names.replace(/\n /g, '\n');
          } else {
            names = names.replace(
              str.slice(costyl[costyl.length - 1], str.length - 3).trim(),
              `[${str.slice(costyl[costyl.length - 1], str.length - 5).trim()}](${lessTag.childNodes[4]?.attribs?.href
              })`,
            );
          }
        }
      } else if (lessTag.childNodes[2]?.attribs?.href.length > 2) {
        names = names.trim();
        names += `\n[покликання](${lessTag.childNodes[2].attribs.href})\n\n`;
      } else {
        names += '\n\n';
      }
      return buildNameLess(lessTag.next, names);
    } else return buildNameLess(lessTag.next, names);
  }

  if (lessTag.type === 'text') {
    if (lessTag.data.trim() === 'онлайн') {
      names = names.slice(0, -1);
      names += 'онлайн';
      return buildNameLess(lessTag.next, names);
    }
    if (names === '') {
      names = `${lessTag.data}`;
      return buildNameLess(lessTag.next, names);
    }
    names += ` ${lessTag.data.trim()}`;
    return buildNameLess(lessTag.next, names);
  }

  return ''
}

export { getData };
