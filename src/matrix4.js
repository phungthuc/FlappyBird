export default class Matrix4 {
  constructor() {}

  identity() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  mul(a, b) {
    return [
      b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12],
      b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13],
      b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14],
      b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15],
      b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12],
      b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13],
      b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14],
      b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15],
      b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12],
      b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13],
      b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14],
      b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15],
      b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12],
      b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13],
      b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14],
      b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15],
    ];
  }

  translate(tx, ty, tz) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  }

  xRotate(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }

  yRotate(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }

  zRotate(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  scale(sx, sy, sz) {
    return [sz, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  }
}
