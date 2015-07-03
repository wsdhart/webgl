"use strict";

var sides = 7;

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

    var vertices = create_polygon(sides);
    bind_buffer(gl , vertices);
    bind_attribute(gl, program , "v_position" , 2);

    var colors = create_colors(sides);
    bind_buffer(gl , colors);
    bind_attribute(gl , program , "v_color" , 3);
}

function render(canvas , gl)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN , 0 , sides);
}

function create_polygon(faces)
{
    var nodes = [];
    var pos = Math.PI / 2;
    var angle = (2 * Math.PI) / faces;
    for(var i = 0 ; i < (faces * 2) ; i+=2)
    {
	nodes[i] = Math.cos(pos);
	nodes[i + 1] = Math.sin(pos);
	pos -= angle;
    }

    var polygon = new Float32Array(nodes);
    return polygon;
}

function create_colors(faces)
{
    var colors = [];
    var step = 1.0 / faces;
    for(var i = 0 ; i < faces ; i++)
    {
	var i_step = i * step;
	colors.push(i_step);
	colors.push(i_step);
	colors.push(i_step);
    }
    colors = new Float32Array(colors);
    return colors;
}
