import { welcomeScene } from './welcome/welcome.scene';
// import progressScene from './progressScene';
import { chooseScene } from './choose/choose.scene';
import { studentScene, teacherScene } from './select/select.scene';
import { scheduleScene, writeDateScene } from './schedule/schedule.scene';
import { logInAdminScene, adminPanelScene, mailingSimpleScene, mailingCbScene, mailingUpdateScene } from './admin.scene';
import { defaultValueScene } from './default-value/default-value.scene';
import { cbScene } from './cb.scene.js';

export default
  [
    welcomeScene,
    // progressScene,
    chooseScene,
    logInAdminScene,
    adminPanelScene,
    mailingSimpleScene,
    mailingCbScene,
    mailingUpdateScene,
    defaultValueScene,
    cbScene,
    studentScene,
    teacherScene,
    scheduleScene,
    writeDateScene
  ]
