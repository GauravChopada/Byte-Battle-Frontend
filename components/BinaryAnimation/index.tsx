"use client"

import { FC, useEffect } from 'react';

import styles from './BinaryAnimation.module.scss'

const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

class Random {
  static generateBinary() {
    var random = Math.random();
    return random > 0.5 ? 1 : 0;
  }

  static generate(min: number, max: number) {
    return Math.floor(Math.random() * max) + min;
  }
}

class Binary {
  value: number;

  constructor() {
    this.value = Random.generateBinary();
  }

  animate(ts: number, leftOffset: number, topOffset: number) {
    var div = document.createElement('div');
    div.style.fontSize = ts + 'px';
    div.style.top = topOffset * (ts / 2) + 'px';
    div.style.left = leftOffset + 'px';
    div.style.zIndex = '10px';
    div.textContent = this.value.toString();
    div.classList.add('binary');
    div.style.display = 'none';

    const outerDivElement = document.querySelector('[class*="outerDiv"]');
    
    if (outerDivElement !== null) {
      outerDivElement.appendChild(div);
    }

    div.style.display = 'block';
    div.classList.add('animated', 'fadeIn');
    div.addEventListener(animationEnd, this.fadeInEnd);

    setInterval(function () {
        div.remove();
      }, 800);

    return div.offsetTop;
  }

  fadeInEnd(event: Event) {
    var binary = event.currentTarget as HTMLDivElement;
    binary.classList.remove('animated', 'fadeIn');
    binary.classList.add('animated', 'fadeOut');
    binary.addEventListener(animationEnd, function () {
      binary.remove();
    });
  }
}

class BinaryLine {
  leftOffset: number;
  textSize: number;
  documentSize: number;

  constructor(lO: number, tS: number, dS: number) {
    this.leftOffset = lO;
    this.textSize = tS;
    this.documentSize = dS;
  }

  generate() {
    var iterator = 1;
    var fontSize = this.textSize;
    var documentSize = this.documentSize;
    var currentOffset = 0;
    var leftOffset = this.leftOffset;
    var interval = setInterval(function () {
      if (currentOffset < documentSize) {
        var binary = new Binary();
        currentOffset = binary.animate(fontSize, leftOffset, iterator);
        iterator++;
      } else {
        clearInterval(interval);
      }
    }, 80);
  }
}

const BinaryAnimation: FC = () => {

  useEffect(() => {
    new BinaryLine(Random.generate(0, window.innerWidth), Random.generate(window.innerWidth * 0.002, window.innerWidth * 0.008), window.innerHeight).generate();

    const binaryLineInterval = setInterval(function () {
      new BinaryLine(Random.generate(0, window.innerWidth), Random.generate(window.innerWidth * 0.002, window.innerWidth * 0.008), window.innerHeight).generate();
    }, 800);

    return () => {
      clearInterval(binaryLineInterval);
    };
  });

  return <div className={styles.outerDiv} />;
};

export default BinaryAnimation;
