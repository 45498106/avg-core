import PIXI from 'pixi.js';

import TextWindow from './TextWindow';
import Err from './ErrorHandler';

const SpriteManager = null;
let CurrentTextWindow = null;

const Methods = {
  create(index) {
    let textwindow = SpriteManager.fromIndex(index);
    if (textwindow && !(textwindow instanceof TextWindow)) {
      Err.warn(`[TextWindowManager] Index<${index}> is not empty,
        which may be an other kind of Sprite. However, it will be destroyed to create a new TextWindow.`);
      textwindow.destroy();
    }
    else if (textwindow) {
      Err.warn(`[TextWindowManager] Index<${index}> has been used by a TextWindow, ignored.`);
      return;
    }
    textwindow = CurrentTextWindow.clone();
    textwindow.setIndex(index);
    textwindow.clearText();

    SpriteManager.insert(index, textwindow);
    SpriteManager.addto(index, -1, 50);
  },
  switchTo(index) {
    const textwindow = SpriteManager.fromIndex(index);
    if (textwindow && textwindow instanceof TextWindow)
      CurrentTextWindow = textwindow;
    else
      Err.warn(`[TextWindowManager] Index<${index}> does not exist, or it is not a TextWindow, ignored.`);
  },
};

export default function Manager(SpriteManager) {
  // create default textwindow
  const textwindow = new TextWindow();
  textwindow.setIndex(-2);
  SpriteManager.insert(-2, textwindow);
  SpriteManager.addto(-2, -1, 50);
  CurrentTextWindow = textwindow;

  // return new Proxy(Methods, {
  //   get: function(target, property, receiver) {
  //     if (target.hasOwnProperty(property)) {
  //       // console.log(`getting ${property} from Methods!`);
  //       return Reflect.get(target, property, receiver);
  //     }
  //     else {
  //       // console.log(`getting ${property} from CurrentTextWindow!`);
  //       return Reflect.get(CurrentTextWindow, property, CurrentTextWindow);
  //     }
  //   },
  //   set: function(target, key, value, receiver) {
  //     // console.log(`setting ${key}!`);
  //     return Reflect.set(CurrentTextWindow, key, value, CurrentTextWindow);
  //   }
  // })
}
