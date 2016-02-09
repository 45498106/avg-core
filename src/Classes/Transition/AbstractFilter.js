let PIXI = require('../../Library/pixi.js/src/index');
import ErrorHandler from '../ErrorHandler';

export default class AbstractFilter extends PIXI.AbstractFilter {
    constructor(...args){
        super(...args);
        
        this.startTime = 0;
        this.duration = 5000;
        
        this.finished = false;
        
        this.uniforms.previousTexture = {type: 'sampler2D', value: null};
        this.uniforms.nextTexture = {type: 'sampler2D', value: null};
        this.uniforms.progress = {type: '1f', value: 0};
        
    }
    
    setPreviousTexture(texture){
        this.uniforms.previousTexture.value = texture;
    }
    
    
    setNextTexture(texture){
        this.uniforms.nextTexture.value = texture;
    }
    
    //返回false说明转场未完成，返回true说明完成
    update(time){
        //第一次执行.update()时初始化
        if(!this.startTime)
        {
            this.startTime = time;
            return false;
        }
        
        //判断转场是否完成
        if(time - this.startTime >= this.duration)
        {
            this.uniforms.progress.value = 1;
            this.finished = true;
            return true;
        }

        this.uniforms.progress.value = (time - this.startTime) / this.duration;
        return false;
    }
    
}