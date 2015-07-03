"use strict";

var sides = 11;

window.onload = function init()
{
    var canvas = document.getElementById("webgl-canvas");
    var gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){ alert("Failed initialising WebGL"); }

    setup(canvas , gl);
    render(gl);
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

    return vertices;
}

function render(gl)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES , 0 , sides * 3);
}

function create_polygon(faces)
{
    var nodes = [];
    var pos = Math.PI / 2;
    var angle = (2 * Math.PI) / faces;
    for(var i = 0 ; i < (faces * 6) ; i+=6)
    {
	nodes[i] = 0.0;
	nodes[i + 1] = 0.0;
	nodes[i + 2] = Math.cos(pos);
	nodes[i + 3] = Math.sin(pos);
	pos -= angle;
	nodes[i + 4] = Math.cos(pos);
	nodes[i + 5] = Math.sin(pos);
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
	for(var j = 0 ; j < 3 ; j++)
	{
	    colors.push(i_step);
	    colors.push(i_step);
	    colors.push(i_step);
	}
    }
    colors = new Float32Array(colors);
    return colors;
}
