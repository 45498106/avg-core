import ReactUpdates from 'react/lib/ReactUpdates';
import emptyObject from 'fbjs/lib/emptyObject';
import { attachToSprite } from 'Classes/EventManager';

const NodeMixin = {
  construct: function(element) {
    this._currentElement = element;

    this.createNode(element);
    if (!this.node) {
      Err.error('`this.node` is null, you should init it at `this.createNode`');
    }

    // bind event handlers
    attachToSprite(this.node);
    this.node.buttonMode = false;
    let keys = Object.keys(element.props);
    for (let key of keys) {
      if (/^on[A-Z]/.test(key)) {
          if (key === 'onClick') {
              this.node.buttonMode = true;
          }
          this.node['_on' + key.replace(/^on/, '').toLowerCase()] = element.props[key].bind(element);
      }
    }
  },

  getPublicInstance: function() {
    return this.node;
  },

  mountComponentIntoNode: function(rootID, container) {
    throw new Error(
      'You cannot render a Canvas component standalone. ' +
      'You need to wrap it in a Surface.'
    );
  },

  unmountComponent: function() {
    // this.destroyEventListeners();
    this.node.removeChildren();
  },

  getHostNode(...props) {
    // React@15.0 之后新添加的东西
    // 不知道干啥用的，先放着吧……
  },

  mountComponent: function (transaction, nativeParent, nativeContainerInfo, context) {
    var props = this._currentElement.props;

    let layer = this.mountNode(props);

    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(
      this.mountAndInjectChildren,
      this,
      props.children,
      transaction
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);

    return layer;
  },

  receiveComponent: function (nextComponent, transaction, context) {
    var prevProps = this._currentElement.props;
    var props = nextComponent.props;

    this.updateNode(prevProps, props);

    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(
      this.updateChildren,
      this,
      props.children,
      transaction
    );
    ReactUpdates.ReactReconcileTransaction.release(transaction);

    this._currentElement = nextComponent;
  }
};

export default NodeMixin;
