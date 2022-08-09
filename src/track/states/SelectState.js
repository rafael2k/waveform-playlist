import { pixelsToSeconds } from "../../utils/conversions";

export default class {
  constructor(track) {
    this.track = track;
    this.active = false;
  }

  static getClass() {
    return ".state-select";
  }

  static getEvents() {
    return ["mousedown", "mousemove", "mouseup", "mouseleave"];
  }

  setup(samplesPerPixel, sampleRate) {
    this.samplesPerPixel = samplesPerPixel;
    this.sampleRate = sampleRate;
  }

  emitSelection(x) {
    const minX = Math.min(x, this.startX);
    const maxX = Math.max(x, this.startX);
    let startTime = pixelsToSeconds(
      minX,
      this.samplesPerPixel,
      this.sampleRate
    );
    if (startTime < this.track.startTime) {
      startTime = this.track.startTime;
    }
    let endTime = pixelsToSeconds(maxX, this.samplesPerPixel, this.sampleRate);
    if (endTime > this.track.endTime) {
      endTime = this.track.endTime;
    }
    this.track.ee.emit("select", startTime, endTime, this.track);
  }

  complete(x) {
    this.emitSelection(x);
    this.active = false;
  }

  mousedown(e) {
    e.preventDefault();
    this.active = true;

    this.startX = e.offsetX;
    const startTime = pixelsToSeconds(
      this.startX,
      this.samplesPerPixel,
      this.sampleRate
    );

    this.track.ee.emit("select", startTime, startTime, this.track);
  }

  mousemove(e) {
    if (this.active) {
      e.preventDefault();
      this.emitSelection(e.offsetX);
    }
  }

  mouseup(e) {
    if (this.active) {
      e.preventDefault();
      this.complete(e.offsetX);
    }
  }

  mouseleave(e) {
    this.mouseup(e);
  }
}
