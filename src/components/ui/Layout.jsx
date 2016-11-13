/**
 * @file        Layout component
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2015-2016 Icemic Jia
 * @link        https://www.avgjs.org
 * @license     Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
const PIXI = require('pixi.js');
import { Layer } from '../Layer';
import { Image } from '../Image';
import { Scroller } from './Scroller';
import combineProps from 'utils/combineProps';

function getValidValueInRange(min, max, value) {
  return Math.min(Math.max(min, value), max);
}

export default class Layout extends React.Component {
  static propTypes = {
    ...Layer.propTypes,
    padding: React.PropTypes.arrayOf(React.PropTypes.number),
    direction: React.PropTypes.string,
    baseline: React.PropTypes.number,
    interval: React.PropTypes.number,
    maxWidth: React.PropTypes.number,
    maxHeight: React.PropTypes.number,
    overflowX: React.PropTypes.string,
    overflowY: React.PropTypes.string,
    children: React.PropTypes.any,
  }
  static defaultProps = {
    x: 0,
    y: 0,
    padding: [0, 0, 0, 0],
    interval: 10,
    direction: 'vertical',
  }
  state = {
    width: null,
    height: null,
    innerX: 0,
    innerY: 0,
    overflowX: 'scroll',
    overflowY: 'scroll',
  }
  componentDidMount() {
    let maxWidth = 0;
    let maxHeight = 0;
    const refs = Object.keys(this.refs);
    let count = refs.length;
    for (let ref of refs) {
      const child = this.refs[ref];
      const node = child._reactInternalInstance._mountImage;
      node.texture.on('update', i => {
        maxWidth = Math.max(maxWidth, node.width);
        maxHeight = Math.max(maxHeight, node.height);
        count--;
        if (count <= 0) {
          this.applyLayout(maxWidth, maxHeight);
        }
      });
    }
  }
  // componentDidUpdate() {
  //   console.log(111)
  // }
  applyLayout(maxWidth, maxHeight) {
    const paddingLeft   = this.props.padding[0],
          paddingTop    = this.props.padding[1],
          paddingRight  = this.props.padding[2],
          paddingBottom = this.props.padding[3];
    const interval = this.props.interval;
    const direction = this.props.direction;
    const baseline = this.props.baseline;

    let lastBottom = paddingTop;
    let lastRight  = paddingLeft;

    const refs = Object.keys(this.refs);
    let count = refs.length;
    for (let ref of refs) {
      const child = this.refs[ref];
      const node = child._reactInternalInstance._mountImage;

      if (direction === 'vertical') {
        node.x = lastRight + (maxWidth - node.width) * baseline;
        node.y = lastBottom;
        lastBottom += interval + node.height;
      } else {
        node.x = lastRight;
        node.y = lastBottom + (maxHeight - node.height) * baseline;
        lastRight += interval + node.width;
      }
    }

    if (direction === 'vertical') {
      this::setLayerSize(paddingLeft + maxWidth + paddingRight,
        lastBottom - interval + paddingBottom);
    } else {
      this::setLayerSize(lastRight - interval + paddingRight,
        paddingTop + maxHeight + paddingBottom);
    }

    PIXI.currentRenderer.view.addEventListener('wheel', evt => {
      this.tempScrollHandler({
        deltaX: evt.deltaX,
        deltaY: evt.deltaY,
        deltaZ: evt.deltaZ,
      });
      evt.preventDefault();
      evt.stopPropagation();
    }, true);

    this.drawScrollBar();
  }
  tempScrollHandler(e) {
    const deltaX = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
    const deltaY = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 0 : e.deltaY;
    const maxWidth = this.props.maxWidth || this.state.width;
    const maxHeight = this.props.maxHeight || this.state.height;

    const innerX = getValidValueInRange(maxWidth - this.state.width, 0, this.state.innerX - deltaX);
    const innerY = getValidValueInRange(maxHeight - this.state.height, 0, this.state.innerY - deltaY);

    let posV, posH;
    posV = Math.min(1, Math.abs(innerY) / (this.state.height - this.props.maxHeight));
    posH = Math.min(1, Math.abs(innerX) / (this.state.width - this.props.maxWidth));

    this.setState({
      innerX: this.props.overflowX === 'scroll' ? innerX : 0,
      innerY: this.props.overflowY === 'scroll' ? innerY : 0,
      scrollButtonPosV: posV,
      scrollButtonPosH: posH,
    });
  }
  drawScrollBar() {
    let backWidthV, backHeightV, xV, yV, lengthV;
    let backWidthH, backHeightH, xH, yH, lengthH;
    const visibleV = (this.props.maxHeight < this.state.height) && this.props.overflowY === 'scroll';
    const visibleH = (this.props.maxWidth < this.state.width) && this.props.overflowX === 'scroll';
    backWidthV = 10;
    backHeightH = 10;
    if (visibleV) {
      backHeightV = this.props.maxHeight - (visibleH ? backHeightH : 0);
      xV = this.props.maxWidth - backWidthV;
      yV = 0;
      lengthV = this.props.maxHeight / this.state.height * this.props.maxHeight;
    }
    if (visibleH) {
      backWidthH = this.props.maxWidth - (visibleV ? backWidthV : 0);
      xH = 0;
      yH = this.props.maxHeight - backHeightH;
      lengthH = this.props.maxWidth / this.state.width * this.props.maxWidth;
    }
    this.setState({
      scrollBackColorV: 0xffffff,
      scrollBackAlphaV: 0.6,
      scrollBackWidthV: backWidthV,
      scrollBackHeightV: backHeightV,
      scrollXV: xV,
      scrollYV: yV,
      scrollVisibleV: visibleV,
      scrollButtonLengthV: lengthV,
      scrollBackColorH: 0xffffff,
      scrollBackAlphaH: 0.6,
      scrollBackWidthH: backWidthH,
      scrollBackHeightH: backHeightH,
      scrollXH: xH,
      scrollYH: yH,
      scrollVisibleH: visibleH,
      scrollButtonLengthH: lengthH,
    })
  }
  render() {
    return (
      <Layer {...combineProps(this.props, Layer.propTypes)}
        ref={node => this.node = node}
        width={this.props.maxWidth || this.state.width}
        height={this.props.maxHeight || this.state.height}>
        <Layer x={this.state.innerX} y={this.state.innerY}
          width={this.state.width} height={this.state.height}>
          {React.Children.map(this.props.children, (element, idx) => {
            return React.cloneElement(element, { ref: idx, key: idx });
          })}
        </Layer>
        <Scroller backgroundColor={0xffffff}
                  backgroundAlpha={0.6}
                  backgroundWidth={this.state.scrollBackWidthV}
                  backgroundHeight={this.state.scrollBackHeightV}
                  x={this.state.scrollXV} y={this.state.scrollYV}
                  visible={this.state.scrollVisibleV}
                  direction='vertical'
                  buttonWidth={6}
                  buttonColor={0xffffff}
                  buttonAlpha={1}
                  buttonLength={this.state.scrollButtonLengthV}
                  buttonPosition={this.state.scrollButtonPosV} key='scrollV' />
        <Scroller backgroundColor={0xffffff}
                  backgroundAlpha={0.6}
                  backgroundWidth={this.state.scrollBackWidthH}
                  backgroundHeight={this.state.scrollBackHeightH}
                  x={this.state.scrollXH} y={this.state.scrollYH}
                  visible={this.state.scrollVisibleH}
                  direction='horizental'
                  buttonWidth={6}
                  buttonColor={0xffffff}
                  buttonAlpha={1}
                  buttonLength={this.state.scrollButtonLengthH}
                  buttonPosition={this.state.scrollButtonPosH} key='scrollH' />
        <Layer visible={this.state.scrollVisibleV && this.state.scrollVisibleH}
               width={this.state.scrollBackWidthV}
               height={this.state.scrollBackHeightH}
               x={this.state.scrollXV} y={this.state.scrollYH}
               fillColor={0xffffff} fillAlpha={0.6} />
      </Layer>
    );
  }
}

function setLayerSize(w, h) {
  this.setState({
    width: w,
    height: h
  });
}
