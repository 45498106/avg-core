import React from 'react';
import ReactUpdates from 'react/lib/ReactUpdates';
import ReactInstanceMap from 'react/lib/ReactInstanceMap';
import ContainerMixin from 'core/ContainerMixin';

import PIXI from 'Library/pixi.js/src/index';
import Container from 'Classes/Container';

/**
 * Surface is a standard React component and acts as the main drawing canvas.
 * ReactCanvas components cannot be rendered outside a Surface.
 */

export const Surface = React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    children: React.PropTypes.any,
  },

  mixins: [ContainerMixin],

  getDefaultProps() {
    return {
    };
  },

  componentDidMount() {
    // scale
    //
    function adjustSize(exchange) {
      // this.refs.canvas.webkitRequestFullScreen()
      if (navigator.userAgent.toLowerCase().indexOf('mobile') !== -1) {
        let width, height;
        // if (exchange) {
        //   width = document.body.clientHeight;
        //   height = document.body.clientWidth;
        // } else {
        width = document.body.clientWidth;
        height = document.body.clientHeight;
        // }

        const dom = this.canvas;
        // alert(height)
        if (width / height > 1) {
          dom.style.height = `${height}px`;
        } else {
          dom.style.width = `${width}px`;
        }
        // dom.style.height = '' + height + 'px';
        // dom.style.objectFit = 'contain';
      }
    }
    adjustSize.bind(this)();
    window.onload = window.onorientationchange = () => {
      // console.log(window.orientation)
      // switch(window.orientation) {
      //   case 0:
      //   case 180:
      //     adjustSize.bind(this)(true);
      //     this.refs.canvas.style.transform = 'rotate(90deg)';
      //     this.refs.canvas.style.position = 'absolute';
      //     this.refs.canvas.style.left = '-50%';
      //     this.refs.canvas.style.top = '50%';
      //     break;
      //   default:
      //     this.refs.canvas.style.transform = 'none';
      //     adjustSize.bind(this)(false);break;
      // }
    };


    // Prepare the <canvas> for drawing.
    this.renderer = new PIXI.WebGLRenderer(this.props.width, this.props.height, {
      view: this.canvas,
    });
    PIXI.currentRenderer = this.renderer;
    this.node = new Container();
    window.stage = this.node;
    // window.renderer = this.renderer;

    // This is the integration point between custom canvas components and React
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(
      this.mountAndInjectChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);

    // Execute initial draw on mount.
    this.tick();
  },


  componentDidUpdate(prevProps, prevState) {
    // We have to manually apply child reconciliation since child are not
    const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(
      this.updateChildren,
      this,
      this.props.children,
      transaction,
      ReactInstanceMap.get(this)._context
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);

    // Re-scale the <canvas> when changing size.
    // if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
    //   this.scale();
    // }
  },

  componentWillUnmount() {
    // Implemented in ReactMultiChild.Mixin
    this.node.removeChildren();
  },

  // Drawing
  // =======

  scale() {
    // this.getContext().scale(this.props.scale, this.props.scale);
  },

  tick() {
    this.renderer.render(this.node);
    // requestAnimationFrame(this.tick);
    setTimeout(this.tick, 33);
  },
  render() {
    return (
      React.createElement('canvas', {
        ref: canvas => this.canvas = canvas,
        width: this.props.width,
        height: this.props.height,
      })
    );
  },
});

// module.exports = Surface;
