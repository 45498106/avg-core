// Adapted from ReactART:
// https://github.com/reactjs/react-art

const ReactMultiChild = require('react-dom/lib/ReactMultiChild');

const ContainerMixin = Object.assign({}, ReactMultiChild.Mixin, {

  /**
   * Moves a child component to the supplied index.
   *
   * @param {ReactComponent} child Component to move.
   * @param {ReactComponent} afterNode
   * @param {number} toIndex
   * @param {number} lastIndex
   * @protected
   */
  moveChild(child /* , afterNode, toIndex, lastIndex */) {
    // console.log('move:', child._mountImage.filename, 'to', toIndex);
    const childNode = child._mountImage;
    const layer = this.node;
    // TODO: wrong implementation

    layer.addChild(childNode);
  },

  /**
   * Creates a child component.
   *
   * @param {ReactComponent} child Component to create.
   * @param {ReactComponent} afterNode
   * @param {ReactComponent} childNode ART node to insert.
   * @protected
   */
  createChild(child, afterNode, childNode) {
    // console.log('create:', childNode.filename)
    child._mountImage = childNode;
    const layer = this.node;

    layer.addChild(childNode);
  },

  /**
   * Removes a child component.
   *
   * @param {ReactComponent} child Child to remove.
   * @protected
   */
  removeChild(child) {
    // console.log('remove:', child._mountImage.filename)
    this.node.removeChild(child._mountImage);
    child._mountImage.destroy();
    child._mountImage = null;
  },

  mountAndInjectChildren(children, transaction, context) {
    const mountedImages = this.mountChildren(
      children,
      transaction,
      context
    );

    // Each mount image corresponds to one of the flattened children
    let i = 0;

    for (const key in this._renderedChildren) {
      if (this._renderedChildren.hasOwnProperty(key)) {
        const child = this._renderedChildren[key];

        child._mountImage = mountedImages[i];
        this.node.addChild(mountedImages[i]);
        // mountedImages[i].inject(this.node);
        i++;
      }
    }
  },

});

export default ContainerMixin;
