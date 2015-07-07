"use strict";

var sides = 6;
var subdivisions = 6;
var holes = false;

var update;
var theta = Math.PI / 20.0;

window.onload = function init()
{
    var canvas = document.getElementById("webgl-canvas");
    var gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){ alert("Failed initialising WebGL"); }

    var vertices = setup(canvas , gl);
    render(gl , vertices);
}

function setup(canvas , gl)
{
    gl.viewport(0 , 0 , canvas.width , canvas.height);
    gl.clearColor(1.0 , 1.0 , 1.0 , 1.0);

    var program = init_program(gl , "vertex-shader" , "fragment-shader");
    gl.useProgram(program);

    var vertices = create_polygon(sides);
    for(var i = 0 ; i < subdivisions ; i++)
	vertices = split_vertices(vertices , holes);

    var vertex_buffer = bind_buffer(gl , vertices);
    bind_attribute(gl, program , "v_position" , 2);

    var colors = create_colors(vertices.length / 6);
    bind_buffer(gl , colors);
    bind_attribute(gl , program , "v_color" , 3);

    update = updater(gl , vertices , program , vertex_buffer);

    return vertices;
}

function render(gl , vertices)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES , 0 , vertices.length / 2);
}

function updater(gl , vertices , program , buffer)
{
    function inner()
    {
	vertices = twist_points(vertices , -theta);
	vertices = twist_points(vertices , theta);
	bind_buffer(gl , vertices , buffer);
	bind_attribute(gl, program , "v_position" , 2);
	render(gl , vertices);
    }
    return inner;
}

