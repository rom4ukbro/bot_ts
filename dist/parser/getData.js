"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getData = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const linkify = __importStar(require("linkifyjs"));
function getData(html) {
    let data = {};
    const $ = cheerio_1.default.load(html);
    let lesson, numLess;
    if ($('#wrap > div > div > div > div.alert.alert-info').length > 0)
        return { vx: 'bx' };
    else {
        $('table').each((i, elem) => {
            var _a, _b;
            let trArr = $(elem).find('tr');
            let h4 = $('.col-md-6 h4')[i].childNodes[0];
            let weekDay = (_b = (_a = h4 === null || h4 === void 0 ? void 0 : h4.next) === null || _a === void 0 ? void 0 : _a.childNodes[0]) === null || _b === void 0 ? void 0 : _b.data;
            var data1 = [];
            var z = 0;
            for (var ii = 0; ii < trArr.length; ii++) {
                try {
                    const numLess = trArr[ii].childNodes[0].childNodes[0].data;
                    const timeBounds = trArr[ii].childNodes[1].childNodes;
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
                        data[weekDay] = {
                            date: h4.data.trim(),
                            day: weekDay,
                            items: data1,
                        };
                    }
                    z++;
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
        return Object.assign({}, data);
    }
}
exports.getData = getData;
function buildNameLess(lessTag, names = '') {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (lessTag.next === null) {
        if (names == undefined)
            return lessTag.data;
        names = names.replace('\n\n\n', '\n');
        return names;
    }
    if (lessTag.name) {
        if (lessTag.name === 'div') {
            if (lessTag.childNodes.length === 6) {
                const str = lessTag.childNodes[2].data;
                const reg = new RegExp(';', 'ig');
                let arrOfStr, st = 0, costyl = [];
                while ((arrOfStr = reg.exec(str)) != null) {
                    let less = str.slice(st, arrOfStr.index);
                    if (linkify.find(less)[0]) {
                        let link = linkify.find(less);
                        less = less.slice(0, link[0].start - 3);
                        if (!parseInt(less))
                            names += `\n[${less.trim()}](${link[0].href})`;
                    }
                    else {
                        if (!parseInt(less))
                            names += '\n' + less.trim();
                    }
                    costyl.push(st);
                    st = arrOfStr.index + 1;
                }
                if (str.slice(st))
                    names += '\n' + str.slice(st);
                if ((_b = (_a = lessTag.childNodes[4]) === null || _a === void 0 ? void 0 : _a.attribs) === null || _b === void 0 ? void 0 : _b.href.length) {
                    if (str.slice(st)) {
                        names = names.replace(str.slice(st), `[${str.slice(st, str.length - 2)}](${(_d = (_c = lessTag.childNodes[4]) === null || _c === void 0 ? void 0 : _c.attribs) === null || _d === void 0 ? void 0 : _d.href})`);
                        names = names.replace(/\n /g, '\n');
                    }
                    else {
                        names = names.replace(str.slice(costyl[costyl.length - 1], str.length - 3).trim(), `[${str.slice(costyl[costyl.length - 1], str.length - 5).trim()}](${(_f = (_e = lessTag.childNodes[4]) === null || _e === void 0 ? void 0 : _e.attribs) === null || _f === void 0 ? void 0 : _f.href})`);
                    }
                }
            }
            else if (((_h = (_g = lessTag.childNodes[2]) === null || _g === void 0 ? void 0 : _g.attribs) === null || _h === void 0 ? void 0 : _h.href.length) > 2) {
                names = names.trim();
                names += `\n[покликання](${lessTag.childNodes[2].attribs.href})\n\n`;
            }
            else {
                names += '\n\n';
            }
            return buildNameLess(lessTag.next, names);
        }
        else
            return buildNameLess(lessTag.next, names);
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
    return '';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0RGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvZ2V0RGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE4QjtBQUM5QixtREFBcUM7QUFZckMsU0FBUyxPQUFPLENBQUMsSUFBWTtJQUMzQixJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7SUFDeEIsTUFBTSxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsSUFBSSxNQUFNLEVBQUUsT0FBTyxDQUFDO0lBQ3BCLElBQUksQ0FBQyxDQUFDLGdEQUFnRCxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUM7UUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ25GO1FBQ0gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTs7WUFDMUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVDLElBQUksT0FBTyxHQUFXLE1BQUEsTUFBQSxFQUFFLGFBQUYsRUFBRSx1QkFBRixFQUFFLENBQUUsSUFBSSwwQ0FBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksQ0FBQztZQUNwRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtnQkFDeEMsSUFB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