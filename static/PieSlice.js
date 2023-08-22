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
import * as ImageUtil from './ImageUtil.js';
import tinycolor from 'tinycolor2';

export default class PieSlice {

  constructor(wheelConfig, radians, wheelRadius, hubRadius, index, entry, image) {
    this.wheelConfig = wheelConfig;
    this.radians = radians;
    this.wheelRadius = wheelRadius;
    this.hubRadius = hubRadius;
    this.displayText = Util.shortenText(entry.text);
    this.customBackgoundColor = entry.color;
    this.image = image;
    const colors = this.wheelConfig.getCoalescedColors();
    this.color = colors[index % colors.length];
    this.entry = entry;
    this.colorTint = entry.colorTint;
    this.wheelImages = {};
  }

  draw(context) {
    if (!this.displayText && !this.image && !this.customBackgoundColor) return;
    context.save();
    if (this.wheelConfig.type=='image') {
      this.drawImageWheelSlice(context);
    }
    if (this.wheelConfig.type=='color') {
      if (this.image) {
        const topLeftColor = ImageUtil.getTopLeftColor(this.image);
        if (ImageUtil.isTransparent(topLeftColor)) {
          this.drawColorWheelWithTransparentImage(context);
        }
        else {
          this.drawColorWheelWithRegularImage(context);
        }
      }
      else {
        this.drawColorWheelWithNoImage(context);
      }
    }
    context.restore();
  }

  drawImageWheelSlice(context) {
    drawImage(context, this.radians/2, this.wheelRadius, this.hubRadius, this.image);
    const textColor = {fill: 'white', outline: 'black'};
    // drawText(context, this.wheelRadius, this.displayText, textColor);
    drawIndexText(context, this.wheelRadius, this.colorTint, textColor);
    drawColorNameText(context, this.wheelRadius, this.entry, textColor);
    drawBorder(context, this.wheelConfig.drawOutlines, this.wheelRadius, this.radians);
  }

  drawColorWheelWithNoImage(context) {
    let textColor;
    if (this.customBackgoundColor) {
      drawBackColorNew(context, this.wheelRadius, this.radians, this.customBackgoundColor);
      textColor = {fill: getTextColor(this.customBackgoundColor), outline: ''};
    }
    else {
      drawBackColorNew(context, this.wheelRadius, this.radians, this.color);
      textColor = {fill: getTextColor(this.color), outline: ''};
    }
    // drawText(context, this.wheelRadius, this.displayText, textColor);
    drawIndexText(context, this.wheelRadius, this.colorTint, textColor);
    drawColorNameText(context, this.wheelRadius, this.entry, textColor);
    drawBorder(context, this.wheelConfig.drawOutlines, this.wheelRadius, this.radians);
  }

  drawColorWheelWithTransparentImage(context) {
    if (this.customBackgoundColor) {
      drawBackColorNew(context, this.wheelRadius, this.radians, this.customBackgoundColor);
    }
    else {
      drawBackColorNew(context, this.wheelRadius, this.radians, this.color);
    }
    drawImage(context, this.radians/2, this.wheelRadius, this.hubRadius, this.image);
    const textColor = {fill: 'white', outline: 'black'};
    // drawText(context, this.wheelRadius, this.displayText, textColor);
    drawIndexText(context, this.wheelRadius, this.colorTint, textColor);
    drawColorNameText(context, this.wheelRadius, this.entry, textColor);
    drawBorder(context, this.wheelConfig.drawOutlines, this.wheelRadius, this.radians);
  }

  drawColorWheelWithRegularImage(context) {
    if (this.customBackgoundColor) {
      drawBackColorNew(context, this.wheelRadius, this.radians, this.customBackgoundColor);
    }
    else {
      const imgBgColor = ImageUtil.getTopLeftColor(this.image);
      drawBackColorNew(context, this.wheelRadius, this.radians, imgBgColor);
    }
    drawImage(context, this.radians/2, this.wheelRadius, this.hubRadius, this.image);
    const textColor = {fill: 'white', outline: 'black'};
    // drawText(context, this.wheelRadius, this.displayText, textColor);
    drawIndexText(context, this.wheelRadius, this.colorTint, textColor);
    drawColorNameText(context, this.wheelRadius, this.entry, textColor);
    drawBorder(context, this.wheelConfig.drawOutlines, this.wheelRadius, this.radians);
  }

}

function drawBackColor(context, radius, radians, color) {
  // console.log(radius, radians, color);
  context.beginPath();
  context.moveTo(0, 0);
  context.arc(0, 0, radius, -radians/2, radians/2);
  context.lineTo(0, 0);
  context.fillStyle = color;
  context.fill();
}

function drawBackColorNew(context, radius, radians, color) {
  const startX = 0;
  const startY = 0;
  const new_radius = radius + 12;
  const new_color = "#777";

  context.beginPath();
  context.moveTo(startX, startY);
  context.arc(startX, startY, new_radius, -radians / 2, radians / 2);
  context.lineTo(startX, startY);
  context.fillStyle = new_color;
  context.fill();

  // Draw the new shape
  const gradient = context.createLinearGradient(startX, startY, radius, startY);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.5, tinycolor(color).lighten(30).toString());
  gradient.addColorStop(1, color);
  context.beginPath();
  context.moveTo(startX, startY);
  context.arc(startX, startY, radius, -radians / 2, radians / 2);
  context.lineTo(startX, startY);
  context.fillStyle = gradient;
  context.fill();

  // Draw the stroke
  context.beginPath();
  context.moveTo(startX, startY);
  context.arc(startX, startY, new_radius, -radians / 2, radians / 2);
  context.lineTo(startX, startY);
  context.strokeStyle = "#000";
  context.lineWidth = "5";
  context.stroke();

  // Draw the pegs
  const pegRadius = 4;
  const numPegs = 3;
  const arcStart = -radians / numPegs;

  for (let i = 0; i < numPegs; i++) {
    var x =
      startX + Math.cos(arcStart + radians * (i / numPegs)) * (radius + 6);
    var y =
      startY + Math.sin(arcStart + radians * (i / numPegs)) * (radius + 6);
    console.log(i, "x:", x, "y:", y);
    context.beginPath();
    context.arc(x, y, pegRadius, 0, 2 * Math.PI);
    context.fillStyle = "#fff";
    context.fill();
  }
}

function drawTriangleBackColor(context, radius, radians, color) {
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(
    radius * Math.cos(radians / 2),
    -(radius * Math.sin(radians / 2))
  );
  context.lineTo(
    radius * Math.cos(radians / 2),
    radius * Math.sin(radians / 2)
  );
  context.lineTo(0, 0);
  context.fillStyle = color;
  context.fill();
}

function drawText(context, radius, displayText, textColor) {
  context.lineJoin = 'round';
  context.textBaseline = 'middle';
  context.textAlign = 'end';
  if (textColor.outline) {
    context.lineWidth = 4;
    context.strokeStyle = textColor.outline;
    context.strokeText(` ${displayText} `, radius, 0);
  }
  context.fillStyle = textColor.fill;
  context.fillText(` ${displayText} `, radius, 0);
}

function drawIndexText(context, radius, displayText, textColor) {
  context.save();
  const myRadius = 0;
  context.lineJoin = 'round';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillStyle = textColor.fill;
  context.font = `${getSizeInPx(radius, 20)} ITC Avant Garde`;
  const textWidth = context.measureText(` ${displayText} `).width;
  const textHeight = context.measureText("M").width; // Approximation of text height
  context.translate(radius * 0.66, 0); // position at 66% of radius
  context.rotate(Math.PI/2);
  // context.fillText(` ${displayText} `, 0 , 0);

  const lineHeight = parseInt(getSizeInPx(radius,17));
  // Split the text into an array of lines
  const lines = displayText.split("");

  // Draw each line of text
  lines.forEach((line, index) => {
    context.font = `${getSizeInPx(radius, 20)} ITC Avant Garde`;
    context.fillText(line, 0, index * lineHeight);
  });

  // context.strokeStyle = "black";
  // context.lineWidth = 1;
  // context.strokeRect(
  //   myRadius - textWidth / 2,
  //   -textHeight / 2,
  //   textWidth,
  //   textHeight
  //   );
  context.restore();
}

function drawColorNameText(context, radius, entry, textColor) {
  // console.log("drawColorNameText:", getSizeInPx(radius, 6));
  context.save();
  const colorName = entry.colorName;
  const colorMood = entry.text;
  const myRadius = 0;
  context.lineJoin = 'round';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillStyle = textColor.fill;
  context.font = `${getSizeInPx(radius, 6)} ITC Avant Garde`;
  const textWidth = context.measureText(` ${colorName} `).width;
  const textHeight = context.measureText("M").width; // Approximation of text height
  context.translate(radius*.9, 0); //  // position at 66% of radiusposition at 90% of radius
  context.rotate(Math.PI/2);

  const lineHeight = parseInt(getSizeInPx(radius, 7.5));
  // Split the text into an array of lines
  const lines = colorName.split('\n');

  // Draw each line of text
  lines.forEach((line, index) => {
    context.fillText(line, 0, index * lineHeight);
  });

  context.font = `${getSizeInPx(radius, 6)} ITC Avant Garde`;
  context.fillText(colorMood, 0, lines.length * lineHeight);

  // context.fillText(` ${colorName} `, 0 , 0);

  context.restore();
}

function drawBorder(context, drawOutlines, radius, radians) {
  if (!drawOutlines) return;
  context.beginPath();
  context.moveTo(0, 0);
  context.arc(0, 0, radius, -radians/2, radians/2);
  context.lineTo(0, 0);
  context.lineWidth = 1;
  context.strokeStyle = '#333333';
  context.stroke();
}

function drawImage(context, a, r, b, image) {
  if (!image) return;
  let p = getImagePos(a, r, b, image.height/image.width);
  context.drawImage(image, p.x, p.y, p.w, p.h);
}

function getImagePos(a, r, b, imageRatio) {
  let w, h;
  for (w=r; w>0; w--) {
    h = w * imageRatio;
    if (Util.boxFits(a, r, b, w, h)) {
      break;
    }
  }
  return {
    x: Math.max(h*Math.cos(a)/(2*Math.sin(a)), b),
    y: -h/2,
    w: w,
    h: h
  }
}

function getTextColor(bgColor) {
  if (!bgColor) return '#000000';
  let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  let uicolors = [r / 255, g / 255, b / 255];
  let c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  let L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  if (L > 0.179) {
    return '#000000';
  }
  else
  {
    return '#FFFFFF';
  }
}

function getSizeInPx(radius, size) {
  // this returns a pixel value relative to the radius
  console.log(`${((size * radius) / 100).toFixed(1)}px`);
  return `${((size * radius) / 100).toFixed(1)}px`;
}
