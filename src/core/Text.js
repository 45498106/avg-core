'use strict';

import React from 'react';
import createComponent from 'core/createComponent';
import ContainerMixin from 'core/ContainerMixin';
import NodeMixin from 'core/NodeMixin';
import TextSprite from 'Classes/TextSprite';

var RawText = createComponent('RawText', ContainerMixin, NodeMixin, {

  createNode(element) {
    this.node = new TextSprite();
  },
  mountNode(props) {
    var layer = this.node;
    let options = {
      color: 0xffffff,
      size: 24,
      font: "sans-serif",
      width: -1,
      height: -1,
      xinterval: 0,
      yinterval: 3,
      extrachar: "...",
      bold: false,
      italic: false,
      strike: false,
      under: false,
      shadow: false,
      shadowcolor: 0x0,
      stroke: false,
      strokecolor: 0x0,
      ...props
    };
    layer.setText(props.text || props.children || "").setAnchor(options.anchor).setColor(options.color).setSize(options.size).setFont(options.font)
             .setTextWidth(options.width).setTextHeight(options.height).setXInterval(options.xinterval).setYInterval(options.yinterval)
             .setExtraChar(options.extrachar).setBold(options.bold).setItalic(options.italic)/*.setStrike(strike).setUnder(under)*/
             .setShadow(options.shadow).setShadowColor(options.shadowcolor).setStroke(options.stroke).setStrokeColor(options.strokecolor)
             .exec();
    layer.x = props.x || 0;
    layer.y = props.y || 0;
    return layer;
  },
  updateNode(prevProps, props) {
    this.node.text = props.text || props.children || "";
    this.node.x = props.x || 0;
    this.node.y = props.y || 0;
    let options = {
        color: 0xffffff,
        size: 24,
        font: "sans-serif",
        width: -1,
        height: -1,
        xinterval: 0,
        yinterval: 3,
        extrachar: "...",
        bold: false,
        italic: false,
        strike: false,
        under: false,
        shadow: false,
        shadowcolor: 0x0,
        stroke: false,
        strokecolor: 0x0,
        ...props
    }
    this.node.setAnchor(options.anchor).setColor(options.color).setSize(options.size).setFont(options.font)
    .setTextWidth(options.width).setTextHeight(options.height).setXInterval(options.xinterval).setYInterval(options.yinterval)
    .setExtraChar(options.extrachar).setBold(options.bold).setItalic(options.italic)/*.setStrike(strike).setUnder(under)*/
    .setShadow(options.shadow).setShadowColor(options.shadowcolor).setStroke(options.stroke).setStrokeColor(options.strokecolor)
    .exec();
  }

});

export const Text = React.createClass({
  displayName: 'Text',
  propTypes: {
    text: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    children: React.PropTypes.element
  },
  render() {
    return React.createElement(RawText, this.props, this.props.children);
  }
});

// module.exports = Text;
