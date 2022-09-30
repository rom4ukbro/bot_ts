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
    const data = {};
    const $ = cheerio_1.default.load(html);
    if ($("#wrap > div > div > div > div.alert.alert-info").length > 0)
        return { vx: "bx" };
    else {
        $("table").each((i, elem) => {
            var _a, _b;
            const trArr = $(elem).find("tr");
            const h4 = $(".col-md-6 h4")[i].childNodes[0];
            const weekDay = (_b = (_a = h4 === null || h4 === void 0 ? void 0 : h4.next) === null || _a === void 0 ? void 0 : _a.childNodes[0]) === null || _b === void 0 ? void 0 : _b.data;
            const data1 = [];
            let z = 0;
            for (let ii = 0; ii < trArr.length; ii++) {
                try {
                    const numLess = trArr[ii].childNodes[0].childNodes[0].data;
                    const timeBounds = trArr[ii].childNodes[1].childNodes;
                    const lesson = trArr[ii].childNodes[2].childNodes[0];
                    const buildName = buildNameLess(lesson).trim();
                    if (buildName != "") {
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
function buildNameLess(lessTag, names = "") {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (lessTag.next === null) {
        if (names == undefined)
            return lessTag.data;
        names = names.replace("\n\n\n", "\n");
        return names;
    }
    if (lessTag.name) {
        if (lessTag.name === "div") {
            if (lessTag.childNodes.length === 6) {
                const str = lessTag.childNodes[2].data;
                const reg = new RegExp(";", "ig");
                let arrOfStr, st = 0;
                const costyl = [];
                while ((arrOfStr = reg.exec(str)) != null) {
                    let less = str.slice(st, arrOfStr.index);
                    if (linkify.find(less)[0]) {
                        const link = linkify.find(less);
                        less = less.slice(0, link[0].start - 3);
                        if (!parseInt(less))
                            names += `\n[${less.trim()}](${link[0].href})`;
                    }
                    else {
                        if (!parseInt(less))
                            names += "\n" + less.trim();
                    }
                    costyl.push(st);
                    st = arrOfStr.index + 1;
                }
                if (str.slice(st))
                    names += "\n" + str.slice(st);
                if ((_b = (_a = lessTag.childNodes[4]) === null || _a === void 0 ? void 0 : _a.attribs) === null || _b === void 0 ? void 0 : _b.href.length) {
                    if (str.slice(st)) {
                        names = names.replace(str.slice(st), `[${str.slice(st, str.length - 2)}](${(_d = (_c = lessTag.childNodes[4]) === null || _c === void 0 ? void 0 : _c.attribs) === null || _d === void 0 ? void 0 : _d.href})`);
                        names = names.replace(/\n /g, "\n");
                    }
                    else {
                        names = names.replace(str.slice(costyl[costyl.length - 1], str.length - 3).trim(), `[${str
                            .slice(costyl[costyl.length - 1], str.length - 5)
                            .trim()}](${(_f = (_e = lessTag.childNodes[4]) === null || _e === void 0 ? void 0 : _e.attribs) === null || _f === void 0 ? void 0 : _f.href})`);
                    }
                }
            }
            else if (((_h = (_g = lessTag.childNodes[2]) === null || _g === void 0 ? void 0 : _g.attribs) === null || _h === void 0 ? void 0 : _h.href.length) > 2) {
                names = names.trim();
                names += `\n[посилання](${lessTag.childNodes[2].attribs.href})\n\n`;
            }
            else {
                names += "\n\n";
            }
            return buildNameLess(lessTag.next, names);
        }
        else
            return buildNameLess(lessTag.next, names);
    }
    if (lessTag.type === "text") {
        if (lessTag.data.trim() === "онлайн") {
            names = names.slice(0, -1);
            names += "онлайн";
            return buildNameLess(lessTag.next, names);
        }
        if (names === "") {
            names = `${lessTag.data}`;
            return buildNameLess(lessTag.next, names);
        }
        names += ` ${lessTag.data.trim()}`;
        return buildNameLess(lessTag.next, names);
    }
    return "";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0RGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvZ2V0RGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHNEQUE4QjtBQUM5QixtREFBcUM7QUFZckMsU0FBUyxPQUFPLENBQUMsSUFBWTtJQUMzQixNQUFNLElBQUksR0FBYSxFQUFFLENBQUM7SUFDMUIsTUFBTSxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsSUFBSSxDQUFDLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUNoRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ2pCO1FBQ0gsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRTs7WUFDMUIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlDLE1BQU0sT0FBTyxHQUFXLE1BQUEsTUFBQSxFQUFFLGFBQUYsRUFBRSx1QkFBRixFQUFFLENBQUUsSUFBSSwwQ0FBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksQ0FBQztZQUN0RCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7Z0JBQ3hDLElBQUk7b0JBRUYsTUFBTSxPQUFPLEdBQUcsS0FBSyxD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