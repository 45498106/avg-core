/*
* 抽象动作类
* 继承后必须重载 updateTransform(progress,target) 方法，用于更新绘制
* 返回 true 表示完成，返回 false 表示动作未完成
*/

export default class AbstractAction {
  constructor(duration, target) {
    this.duration = duration;
    this.finished = true;
    this.target = target;
    this.times = 0;
  }

  initAction(time) {
    this.startTime = time;
    this.lastProgress = 0;
  }

  reset() {
    this.startTime = null;
    this.finished = false;
  }

  resetTimes() {
    this.times = 0;
  }

  update(time, target, times) {
    // console.log(times)
    if (this.finished && (this.times < times)) {
      this.reset();
      this.times++;

      return false;
    } else if (this.finished) { return true; }

    if (!this.startTime) {
      this.initAction(time, this.target || target);

      return false;
    }

    if (time - this.startTime < 0) { return false; }

    let progress = (time - this.startTime) / this.duration;

    if (progress >= 1) {
      progress = 1;
      this.finished = true;
    }

    this.updateTransform(progress, this.lastProgress, this.target || target);

    this.lastProgress = progress;

    return this.finished;
  }

  /* eslint-disable */
  updateTransform(progress, lastProgress, target) {

  }
  /* eslint-enable */

}

