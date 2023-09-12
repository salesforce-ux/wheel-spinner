/*
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as Util from './Util.js';

export default class WheelConfig {

  constructor(winnerMessage) {
    this.title = 'Design with Styling Hooks';
    this.description = '';
    this.entries = [
      {
        text: "Default",
        colorName: "Cloud Blue",
        colorTint: "60",
        color: "#0D9DDA",
        accessible: false,
      },
      {
        text: "Cozy",
        colorName: "Teal",
        colorTint: "70",
        color: "#01C3B3",
        accessible: false,
      },
      {
        text: "Efficient",
        colorName: "Orange",
        colorTint: "70",
        color: "#FE9339",
        accessible: false,
      },
      {
        text: "Default",
        colorName: "Pink",
        colorTint: "50",
        color: "#E3066A",
        accessible: true,
      },
      {
        text: "Cozy",
        colorName: "Green",
        colorTint: "70",
        color: "#45C65A",
        accessible: false,
      },
      {
        text: "Efficient",
        colorName: "Violet",
        colorTint: "30",
        color: "#730394",
        accessible: true,
      },
      {
        text: "Default",
        colorName: "Hot Orange",
        colorTint: "60",
        color: "#FF5D2D",
        accessible: false,
      },
      {
        text: "Cozy",
        colorName: "Indigo",
        colorTint: "40",
        color: "#3A49DA",
        accessible: true,
      },
      {
        text: "Efficient",
        colorName: "Yellow",
        colorTint: "80",
        color: "#FCC003",
        accessible: false,
      },
      {
        text: "Default",
        colorName: "Blue",
        colorTint: "50",
        color: "#0176D3",
        accessible: true,
      },
      {
        text: "Cozy",
        colorName: "Purple",
        colorTint: "40",
        color: "#7526E3",
        accessible: true,
      },
      {
        text: "Efficient",
        colorName: "Red",
        colorTint: "50",
        color: "#EA001E",
        accessible: true,
      },
    ].reverse();
    this.colorSettings = this.entries.map(entry => ({ color: entry.color, enabled: true}));
    this.pageBackgroundColor = 'none';
    this.type = 'color';
    this.pictureType = 'none';
    this.coverImageType = '';
    this.coverImageName = '';
    this.galleryPicture = '/images/none.png';
    this.customPictureName = '';
    this.customPictureDataUri = '';
    this.customCoverImageDataUri = '';
    this.centerText = '';
    this.allowDuplicates = true;
    this.duringSpinSound = 'ticking-sound';
    this.duringSpinSoundVolume = 100;
    this.afterSpinSound = 'applause-sound';
    this.afterSpinSoundVolume = 100;
    this.maxNames = 500;
    this.spinTime = 10;
    this.playCheers = true;
    this.launchConfetti = true;
    this.animateWinner = false;
    this.autoRemoveWinner = false;
    this.displayWinnerDialog = true;
    this.displayRemoveButton = true;
    this.displayHideButton = true;
    this.winnerMessage = winnerMessage || 'We have a winner!';
    this.playClickWhenWinnerRemoved = false;
    this.hubSize = 'S';
    this.drawOutlines = false;
    this.slowSpin = false;
    this.showTitle = true;
    this.isAdvanced = false;
  }

  loadJson(jsonString) {
    try {
      let obj = JSON.parse(jsonString);
      this.copyPropertiesFrom(obj);
    }
    catch (ex) {
      console.error(ex);
    }
  }

  getJson() {
    var keys = Object.keys(this);
    var retVal = {};
    keys.forEach(key => {
      retVal[key] = this[key];
    });
    return JSON.stringify(retVal);
  }

  getValues() {
    return JSON.parse(this.getJson());
  }

  loadValues(values) {
    this.copyPropertiesFrom(values);
  }

  clone() {
    const clone = new WheelConfig();
    clone.loadValues(this.getValues());
    return clone;
  }

  hasOnlyDefaultEntries() {
    return Util.arraysEqual(this.getTexts(), new WheelConfig().getTexts());
  }

  setCustomPicture(name, dataUri) {
    this.customPictureName = name;
    this.customPictureDataUri = dataUri;
    this.pictureType = 'uploaded';
  }

  setCustomCoverImage(name, dataUri) {
    this.coverImageName = name;
    this.customCoverImageDataUri = dataUri;
    this.coverImageType = 'uploaded';
  }

  getWheelImage() {
    if (this.pictureType == 'none') {
      return '/images/none.png';
    }
    if (this.pictureType == 'gallery') {
      if (this.galleryPicture) {
        return this.galleryPicture;
      }
    }
    if (this.pictureType == 'uploaded' || this.pictureType == 'text') {
      if (this.customPictureDataUri) {
        return this.customPictureDataUri;
      }
    }
    return null;
  }

  getCoverImage() {
    if (this.coverImageType == 'gallery') {
      if (this.coverImageName) {
        return this.coverImageName;
      }
    }
    if (this.coverImageType == 'uploaded') {
      if (this.customCoverImageDataUri) {
        return this.customCoverImageDataUri;
      }
    }
    return null;
  }

  shouldPlayTicks() {
    return (this.duringSpinSound=='ticking-sound');
  }

  setColorValues(colorValues) {
    if (!colorValues) return;
    this.colorSettings = colorValues.map(cv => ({color: cv, enabled: true}));
    while (this.colorSettings.length<6) {
      this.colorSettings.push({color: '#000000', enabled: false});
    }
  }

  getCoalescedColors() {
    const retVal = this.colorSettings
                       .filter(cs => cs.enabled)
                       .map(cs => cs.color);
    return retVal.length>0 ? retVal : ['#CCCCCC'];
  }

  isTooBigForDatabase() {
    return (this.getJson().length > 990000);
  }

  getTexts() {
    return this.entries.map(e=>e.text).filter(txt=>txt);
  }

  getFirstText() {
    const texts = this.getTexts();
    return texts.length>0 ? texts[0] : '';
  }

  copyPropertiesFrom(obj) {
    Object.assign(this, JSON.parse(JSON.stringify(obj)));
    this.convertOldData();
  }

  convertOldData() {
    if (Array.isArray(this.names)) {
      this.entries = this.names.map(name => {
        return Util.createEntry(Util.extractText(name), Util.extractImage(name));
      });
      delete this.names;
    }
    this.maxNames = parseInt(this.maxNames);
    this.spinTime = parseInt(this.spinTime);
    if (this.playTicks===false) {
      this.duringSpinSound = 'no-sound';
    }
    delete this.playTicks;
    if (this.playCheers===false) {
      this.afterSpinSound = 'no-sound';
    }
    delete this.playCheers;
    if (!this.hasOwnProperty('showTitle')) {
      this.showTitle = true;
    }
    if (this.type=='image' && !this.coverImageType) {
      this.coverImageType = 'gallery';
    }
    if (this.isAdvanced && this.entries.length > 0) {
      if (!this.entries[0].hasOwnProperty('enabled')) {
        this.entries.forEach(entry => {
          entry.enabled = true;
        });
      }
    }
  }
}