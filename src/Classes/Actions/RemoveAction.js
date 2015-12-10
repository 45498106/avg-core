import AbstractAction from './AbstractAction';
import SpriteManager from '../SpriteManager';

export default class RemoveAction extends AbstractAction{
	constructor({target,_delete=false,delay,layerDelay}){
		super(0,delay,layerDelay,target);
		
		this._delete = _delete;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let parent = target.parent;
        if(!parent)
            return true;
        parent.removeChild(target);
        if(this._delete){
            SpriteManager.remove(target.index);
        }
	}
	
	
}
