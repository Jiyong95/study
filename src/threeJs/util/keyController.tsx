export class KeyController {
  keys = new Map<string, boolean>();

  constructor() {
    window.addEventListener('keydown', (e) => this.keys.set(e.code, true));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
  }
}
