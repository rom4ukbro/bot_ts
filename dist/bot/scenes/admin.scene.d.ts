import { Scenes } from 'telegraf';
import 'moment-timezone';
import { CustomContext } from '../custom-context';
declare const logInAdminScene: Scenes.BaseScene<CustomContext>;
declare const adminPanelScene: Scenes.BaseScene<CustomContext>;
declare const mailingSimpleScene: Scenes.BaseScene<CustomContext>;
declare const mailingCbScene: Scenes.BaseScene<CustomContext>;
declare const mailingUpdateScene: Scenes.BaseScene<CustomContext>;
export { logInAdminScene, adminPanelScene, mailingSimpleScene, mailingCbScene, mailingUpdateScene, };
