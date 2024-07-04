export class Variable {
  constructor(args, name, pixelUnit) {
    if (args) {
      this.name = name;
      this.vari = pixelUnit.createSize(args);
      this.linkedP = [];
    }
  }

  set() {
    const value = this.vari.getReal();
    this.linkedP.forEach((_, key) => {
      this.linkedP[key].abs = value;
    });
  }

  link(p) {
    this.linkedP.push(p);
  }
}
