// physics/tick-engine.js
export class TickEngine {
  constructor() {
    this.handlers = new Set();
    this.intervalId = null;
  }

  onTick(fn) {
    this.handlers.add(fn);
    return () => this.handlers.delete(fn);
  }

  start(ms = 1000) {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      for (const fn of this.handlers) fn();
    }, ms);
  }

  stop() {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
