import AbstractAction from './AbstractAction';

export default class FadeToAction extends AbstractAction{
	constructor({target,duration,delay,layerDelay,targetOpacity,ease}){
		super(duration,delay,layerDelay,target);
		
		this.targetOpacity = targetOpacity;
		// this.ease = ease;
		
	}
	
	updateTransform(progress,lastProgress,target){
		let deltaProgress = progress - lastProgress;
		target.alpha = (this.targetOpacity - target.alpha)*deltaProgress/(1-lastProgress);
	}
	
	
}
