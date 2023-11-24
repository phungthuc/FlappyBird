export default class Matrix3 {
  constructor(matrix) {
    this.matrix = matrix;
  }

  /**
   * @param m{Matrix3}
   */

  add(m) {
    this.matrix[0] += m[0];
    this.matrix[1] += m[1];
    this.matrix[2] += m[2];
    this.matrix[3] += m[3];
    this.matrix[4] += m[4];
    this.matrix[5] += m[5];
    this.matrix[6] += m[6];
    this.matrix[7] += m[7];
    this.matrix[7] += m[8];
    return this;
  }

  sub(m) {
    this.matrix[0] -= m[0];
    this.matrix[1] -= m[1];
    this.matrix[2] -= m[2];
    this.matrix[3] -= m[3];
    this.matrix[4] -= m[4];
    this.matrix[5] -= m[5];
    this.matrix[6] -= m[6];
    this.matrix[7] -= m[7];
    this.matrix[7] -= m[8];
    return this;
  }

  mulScalar(number) {
    this.matrix[0] *= number;
    this.matrix[1] *= number;
    this.matrix[2] *= number;
    this.matrix[3] *= number;
    this.matrix[4] *= number;
    this.matrix[5] *= number;
    this.matrix[6] *= number;
    this.matrix[7] *= number;
    this.matrix[7] *= number;
    return this;
  }

  mul(m) {
    return [
      this.matrix[0] * m[0] + this.matrix[3] * m[1] + this.matrix[6] * m[2],
      this.matrix[1] * m[0] + this.matrix[4] * m[1] + this.matrix[7] * m[2],
      this.matrix[2] * m[0] + this.matrix[5] * m[1] + this.matrix[8] * m[2],
      this.matrix[0] * m[3] + this.matrix[3] * m[4] + this.matrix[6] * m[5],
      this.matrix[1] * m[3] + this.matrix[4] * m[4] + this.matrix[7] * m[5],
      this.matrix[2] * m[3] + this.matrix[5] * m[4] + this.matrix[8] * m[5],
      this.matrix[0] * m[6] + this.matrix[3] * m[7] + this.matrix[6] * m[8],
      this.matrix[1] * m[6] + this.matrix[4] * m[7] + this.matrix[7] * m[8],
      this.matrix[2] * m[6] + this.matrix[5] * m[7] + this.matrix[8] * m[8],
    ];
  }

  rotate(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var rotateMatrix = [c, -s, 0, s, c, 0, 0, 0, 1];

    return this.mul(rotateMatrix);
  }

  translate(tx, ty) {
    var translateMatrix = [1, 0, 0, 0, 1, 0, tx, ty, 1];

    return this.mul(translateMatrix);
  }

  scale(sx, sy) {
    var scaleMatrix = [sx, 0, 0, 0, sy, 0, 0, 0, 1];

    return this.mul(scaleMatrix);
  }

  identity() {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }
}
