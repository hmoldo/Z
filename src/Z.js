import resize from "./RESIZE";
import is from "./is";
import UAParser from "ua-parser-js";
import mitt from "mitt";
import $ from "cash-dom";

const W = window,
  N = W.navigator;

let id = 0;
W.rAF = requestAnimationFrame;
W.$ = $;

function detectStandalone() {
  const { hash } = W.location;
  if (N.standalone) return true;
  if (W.matchMedia("(display-mode: standalone)").matches) return true;
  if (hash === "#:standalone:") {
    // first run (open app) in standalone mode cache state in sessionStorage
    sessionStorage.setItem(":standalone:", "1");
    // remove hash part from the url before actual app start, in case if your app uses hash (#) routing
    history.replaceState(history.state, "", "/");
    return true;
  } else if (sessionStorage.getItem(":standalone:")) {
    // Second and subsequent runs (reloads) sessionStorage is unique per tab
    // and Home Screen app is just a chrome-less tab.
    // So it's safe to assume that user is still in standalone mode
    return true;
  }
  return false;
}

const Z = {
  canShare: (() => {
    if (!navigator.canShare) return false;
    return navigator.canShare({ title: "", url: "" });
  })(),

  is: {
    prod: __IS_PROD__,
    dev: __IS_DEV__,
  },

  init(devConfig = {}) {
    window.Z = Z;
    var parser = new UAParser();
    Z.system = parser.getResult();
    let { os, device, browser } = Z.system,
      standalone = (__IS_DEV__ && devConfig.standalone) || detectStandalone();

    Object.assign(Z.is, {
      // mode
      standalone,
      browser: !standalone,
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
    });
    Z.is.desktop = !Z.is.tablet && !Z.is.mobile;
    Z.is.appleMobile = Z.is.ios || Z.is.ipad;
    resize.init();
    Object.assign(Z, resize);
  },

  uid: () => "uid-" + id++,
  fn: (f) => (Z.is.function(f) ? f() : f),
};

Object.assign(Z.is, is);

// import base utils
import * as NET from "./NET.js";
Z.net = NET;
import * as URLutils from "./URL";
Z.url = URLutils;
import * as VALID from "./VALID.js";
Z.valid = VALID;
import * as MATH from "./MATH.js";
Z.math = MATH;
import STRING from "./STRING.js";
Z.str = STRING;
import ARRAY from "./ARRAY.js";
Z.arr = ARRAY;
import * as IO from "@Z/IO";
Z.io = IO;
import * as IMG from "./IMG.js";
Z.img = IMG;
import * as OBJ from "./OBJ.js";
Z.obj = OBJ;
import * as MIME from "./MIME.js";
Z.mime = MIME;

Z.mit = mitt();

export default Z;
