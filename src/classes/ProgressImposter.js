export default class ProgressImposter {

  constructor(progressIndicator, nbMainTasks) {
    this.timeStepImposting = 500;
    this.progressIndicator = progressIndicator;
    this.isTaskImposted = false;
    this.isImposting = false;
    this.intervalId = null;
    this.imposterRatio = 2;
    this.subTaskStartDate = null;
    this.stepSize = 1;
    this.impostedCurrent = 0;
    this.impostedTotal = 1;
    this.progressIndicator.setNbMainTasks(nbMainTasks);
  }

  advanceToNextMainTask(msg, withSubTask, isImposted) {
    this.progressIndicator.advanceToNextMainTask(msg, withSubTask);
    this.isTaskImposted = isImposted;
    console.log("Progress task", msg, performance.now());
    if (this.isTaskImposted) {
      this.subTaskStartDate = performance.now();
    } else {
      this.subTaskStartDate = null;
    }
    this.impostedCurrent = 0;
    this.impostedTotal = 1;
    this.isImposting = false;
    if (this.intervalId !== null) {
      // console.log("stop imposting because next main task.");
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onSubTaskProgress(current, total) {
    // console.log("TODO wesh", this.isTaskImposted, current, total);
    this.impostedCurrent = current;
    this.impostedTotal = total;
    if (this.isTaskImposted) {
      this.impostedTotal = total * this.imposterRatio;
      if ((current > 0) && (current == total)) {
        // console.log("We start imposting things.");
        // +1 ajouté à l'arrache si jamais startDate = endDate.
        const subTaskEndDate = performance.now() + 1;
        const workRate = current / (subTaskEndDate - this.subTaskStartDate);
        this.stepSize = Math.floor(this.timeStepImposting * workRate);
        if (this.stepSize == 0) {
          this.stepSize = 1;
        }
        console.log("stepSize.", this.stepSize);
        this.isImposting = true;
        this.intervalId = setInterval(
          () => { this.impostedSubTaskProgress() },
          this.timeStepImposting
        );
      }
    }
    const percentage = Math.floor((this.impostedCurrent / this.impostedTotal) * 100);
    this.progressIndicator.setSubTaskProgress(percentage);
  }

  impostedSubTaskProgress() {
    this.impostedCurrent += this.stepSize;
    // console.log("imposting", this.impostedCurrent, this.impostedTotal);
    if (this.impostedCurrent >= this.impostedTotal) {
      this.impostedCurrent = this.impostedTotal;
      this.isImposting = false;
      if (this.intervalId !== null) {
        // console.log("stop imposting");
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    const percentage = Math.floor((this.impostedCurrent / this.impostedTotal) * 100);
    this.progressIndicator.setSubTaskProgress(percentage);
  }

  clearProgress() {
    this.progressIndicator.clearProgress();
    this.isTaskImposted = false;
    this.impostedCurrent = 0;
    this.impostedTotal = 1;
    this.isImposting = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

}
