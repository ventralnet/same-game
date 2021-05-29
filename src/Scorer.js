// (n - k) ^ 2

export default class {
  constructor() {
    this.totalScore = 0;
    this.k = 1;
  }

  calculatePotentialScore(numberOfItems) {
    console.log(`(${numberOfItems} - ${this.k}) ** 2`);

    return (numberOfItems - this.k) ** 2;
  }

  updateScore(addend) {
    this.totalScore += addend;
    return this.totalScore;
  }
}
