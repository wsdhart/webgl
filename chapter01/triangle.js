"use strict";

var vertices = new Float32Array([-1 ,-1 , 0 , 1 , 1 , -1]);

window.onload = function init()
{
    var canvas = document.getElementById("webgl-canvas");
    var gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){ alert("Failed initialising WebGL"); }

    setup(canvas , gl);
    render(canvas , gl);
}

function setup(canvas , gl)
{
    gl.viewport(0 , 0 , canvas.width , canvas.height);
    gl.clearColor(1.0 , 1.0 , 1.0 , 1.0);

    var program = init_program(gl , "vertex-shader" , "fragment-shader");
    gl.useProgram(program);

    bind_buffer(gl , vertices);
    bind_attribute(gl, program , "v_position" , 2);
}

function render(canvas , gl)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES , 0 , 3);
}
