import './index.css';
import time128 from '../../assets/time_128.png';

export function helloWorld() {
  loadImg();

  getComponent().then((component) => {
    document.body.appendChild(component);
  });
}

function loadImg() {
  const img = new Image();
  img.src = time128;
  img.classList.add('logo');
  document.body.appendChild(img);
}

function getComponent() {
  // lodash 现在使用 import 引入
  return import(/* webpackChunkName: 'lodash' */ 'lodash')
    .then(({ default: _ }) => {
      const element = document.createElement('div');
      element.classList.add('hello');

      element.innerHTML = _.join(['1Hello', 'webpack', '999'], ' ');

      return element;
    })
    .catch((error) => 'An error occurred while loading the component');
}
