import { Scenes } from 'telegraf';
import 'moment-timezone';
import { CustomContext } from '../../custom-context';
declare const scheduleScene: Scenes.BaseScene<CustomContext>;
declare const writeDateScene: Scenes.BaseScene<CustomContext>;
export { scheduleScene, writeDateScene };
