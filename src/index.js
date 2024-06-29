"use strict";

import { GameConstants } from "./gameConstants";
import Matrix4 from "./matrix4";

var vertexShaderSource = `#version 300 es

in vec2 a_position;

in vec2 a_texCoord;

uniform vec2 u_resolution;

uniform mat4 u_matrix;

out vec2 v_texCoord;


void main(){
    vec2 position = (u_matrix * vec4(a_position, 0, 1)).xy;

    vec2 zeroToOne = position / u_resolution;

    vec2 zeroToTwo = zeroToOne * 2.0;
    
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

    v_texCoord = a_texCoord;
}`;

var fragmentShaderSource = `#version 300 es

precision highp float;

in vec2 v_texCoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {

    outColor = texture(u_texture, v_texCoord);

}`;

var createShader = function (gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return undefined;
};

var createProgram = function (gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;
};

function main() {
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    console.log("Web GL 2 is not supported!");
    return;
  }

  //Score variables
  let scoreDiv = document.getElementById("score-display");
  let score = 0;
  let isEndGame = false;
  let isLose = false;
  let counted = false;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  var program = createProgram(gl, vertexShader, fragmentShader);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

  var resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  var matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");
  var textureUniformLocation = gl.getUniformLocation(program, "u_texture");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var position = [0, 0, 20, 0, 0, 10, 0, 10, 20, 0, 20, 10];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

  var vao = gl.createVertexArray(gl);
  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttributeLocation);

  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;

  var primitiveType = gl.TRIANGLES;
  var count = 6;

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  //texCoord
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

  var textCoord = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoord), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(texCoordAttributeLocation);

  gl.vertexAttribPointer(
    texCoordAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  var m4 = new Matrix4();

  //load Image and create Texture Info
  function loadImageAndCreateTextureInfo(url) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    var textureInfo = {
      width: 1,
      height: 1,
      texture: tex,
    };

    var img = new Image();
    img.crossOrigin = "anonymous";
    img.addEventListener("load", function () {
      textureInfo.width = img.width;
      textureInfo.height = img.height;

      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    });
    img.src = url;

    return textureInfo;
  }

  var birdImg = loadImageAndCreateTextureInfo("assets/bird.png");
  var pipeBottomImg = loadImageAndCreateTextureInfo("assets/pipe.png");
  var pipeTopImg = loadImageAndCreateTextureInfo("assets/pipe2.png");

  var pipes = {
    pipeTop: {
      x: canvas.clientWidth + GameConstants.PIPE_SCALE_HIDEN_X,
      y: GameConstants.DEFAULT_POSITION_PIPE_TOP_Y,
      dx: GameConstants.PIPE_DX,
      dy: GameConstants.PIPE_DY,
      scale: GameConstants.PIPE_SCALE,
      textureInfo: pipeTopImg,
    },
    pipeBottom: {
      x: canvas.clientWidth + GameConstants.PIPE_SCALE_HIDEN_X,
      y: GameConstants.DEFAULT_POSITION_PIPE_BOTTOM,
      dx: GameConstants.PIPE_DX,
      dy: GameConstants.PIPE_DY,
      scale: GameConstants.PIPE_SCALE,
      textureInfo: pipeBottomImg,
    },
  };

  var bird = {
    x: GameConstants.DEFAULT_POSITION_BIRD_X,
    y: canvas.clientHeight / 2,
    dx: GameConstants.BIRD_DX,
    dy: GameConstants.BIRD_DY,
    scale: GameConstants.BIRD_SCALE,
    acceleration: GameConstants.DEFAULT_BIRD_ACCELERATION,
    maxAcceleration: GameConstants.MAX_BIRD_ACCELERATION,
    gravity: GameConstants.GRAVITY,
    textureInfo: birdImg,
  };

  document.body.onkeyup = function (e) {
    if (e.code == "Space") {
      bird.acceleration = GameConstants.BIRD_ACCELERATION_INPUT;
    }
  };

  requestAnimationFrame(render);

  function update(deltaTime) {
    if(isLose) return;
    if (isEndGame) {
      // alert("Game Over!");
      console.log("game over!");
      var restartButton = document.getElementById("restartButton");
      restartButton.style.display = "block";
      restartButton.addEventListener("click", function () {
        location.reload();
        isLose = false;
      });
      isLose = true;
      return;
    }
    checkCollision();
    increaseScore();

    bird.acceleration +=
      deltaTime * bird.gravity * GameConstants.BIRD_ACCELERATION_SCALE;
    bird.y += bird.acceleration;
    pipes.pipeTop.x -= pipes.pipeTop.dx * GameConstants.FRAME_RATE * deltaTime;
    pipes.pipeBottom.x -=
      pipes.pipeBottom.dx * GameConstants.FRAME_RATE * deltaTime;
    if (pipes.pipeTop.x <= -50) {
      var random = Math.floor(Math.random() * 301) - 150;
      if (pipes.pipeBottom.y < 200) {
        random = GameConstants.DEFAULT_RANDOM_POSITION_PIPE;
      }
      if (pipes.pipeBottom.y > canvas.clientHeight - 200) {
        random = -GameConstants.DEFAULT_RANDOM_POSITION_PIPE;
      }
      pipes.pipeTop.y += random;
      pipes.pipeBottom.y += random;
      pipes.pipeTop.x = canvas.clientWidth + 100;
      pipes.pipeBottom.x = canvas.clientWidth + 100;
      counted = false;
    }
  }
  var then = 0;

  function render(time) {
    var now = time * 0.001;
    var deltaTime = Math.min(0.1, now - then);
    then = now;

    update(deltaTime);
    draw();
    requestAnimationFrame(render);
  }

  function draw() {
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawImage(
      pipes.pipeTop.textureInfo.texture,
      pipes.pipeTop.textureInfo.width,
      pipes.pipeTop.textureInfo.height,
      pipes.pipeTop.x,
      pipes.pipeTop.y,
      pipes.pipeTop.scale
    );
    drawImage(
      pipes.pipeBottom.textureInfo.texture,
      pipes.pipeBottom.textureInfo.width,
      pipes.pipeBottom.textureInfo.height,
      pipes.pipeBottom.x,
      pipes.pipeBottom.y,
      pipes.pipeBottom.scale
    );
    drawImage(
      bird.textureInfo.texture,
      bird.textureInfo.width,
      bird.textureInfo.height,
      bird.x,
      bird.y,
      bird.scale
    );
  }

  function drawImage(texture, width, height, x, y, scale) {
    gl.useProgram(program);

    gl.uniform1i(textureUniformLocation, 0);
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    var matrix_translate = m4.translate(x, y, 0);
    var matrix_rotate_x = m4.xRotate(0);
    var matrix_rotate_y = m4.yRotate(0);
    var matrix_rotate_z = m4.zRotate(0);
    var matrix_scale = m4.scale(width, height / scale, 1);
    var matrix = m4.identity();
    matrix = m4.mul(matrix, matrix_translate);
    matrix = m4.mul(matrix, matrix_rotate_x);
    matrix = m4.mul(matrix, matrix_rotate_y);
    matrix = m4.mul(matrix, matrix_rotate_z);
    matrix = m4.mul(matrix, matrix_scale);

    gl.uniform2f(
      resolutionUniformLocation,
      canvas.clientWidth,
      canvas.clientHeight
    );
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

    gl.drawArrays(primitiveType, offset, count);
  }

  function checkCollision() {
    const birdRight = bird.x + bird.textureInfo.width;
    const birdBottom = bird.y + bird.textureInfo.height;
    const pipeRight = pipes.pipeTop.x + pipes.pipeTop.textureInfo.width;
    if (bird.y < 0) {
      bird.y = 0;
    }
    if (
      (birdRight > pipes.pipeTop.x + GameConstants.PIPE_COLLISION_SCALE &&
        bird.x < pipeRight - GameConstants.PIPE_COLLISION_SCALE * 2 &&
        bird.y <
          pipes.pipeTop.y +
            pipes.pipeTop.textureInfo.height * 2 -
            GameConstants.PIPE_COLLISION_SCALE) ||
      (birdRight > pipes.pipeBottom.x + GameConstants.PIPE_COLLISION_SCALE &&
        bird.x < pipeRight - GameConstants.PIPE_COLLISION_SCALE * 2 &&
        birdBottom > pipes.pipeBottom.y + GameConstants.PIPE_COLLISION_SCALE) ||
      birdBottom > canvas.clientHeight
    ) {
      isEndGame = true;
    }
  }

  function increaseScore() {
    if (!counted) {
      if (bird.x > pipes.pipeTop.x + pipes.pipeTop.textureInfo.width) {
        score++;
        counted = true;
        scoreDiv.innerHTML = "Score " + score;
      }
    }
  }
}

main();
