import UAParser from 'ua-parser-js';
import { detectStandalone } from './PWA';

const system = new UAParser().getResult();
const { os, device, browser } = system;
const standalone = detectStandalone();

const is = {
    // os
    ios: new RegExp(/ios/i).test(os.name),
    mac: new RegExp(/mac/i).test(os.name),
    android: new RegExp(/android/i).test(os.name),
    // device
    tablet: new RegExp(/tablet/i).test(device.type),
    mobile: new RegExp(/mobile/i).test(device.type),
    ipad: new RegExp(/ipad/i).test(device.model),
    // browser
    safari: new RegExp(/safari/i).test(browser.name),
    chrome: new RegExp(/chrome/i).test(browser.name),
    // pwa mode
    standalone,
    browser: !standalone,
};

is.desktop = !is.tablet && !is.mobile;
is.appleMobile = is.ios || is.ipad;
system.is = is;

export default system;
