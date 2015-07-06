"use strict";

var sides = 3;
var subdivisions = 3;
var holes = true;

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
    vertices = rotate_points(vertices , Math.PI / 2);
    bind_buffer(gl , vertices);
    bind_attribute(gl, program , "v_position" , 2);

    var colors = create_colors(vertices.length / 6);
    bind_buffer(gl , colors);
    bind_attribute(gl , program , "v_color" , 3);

    return vertices;
}

function render(gl , vertices)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES , 0 , vertices.length / 2);
}

function create_colors(faces)
{
    var colors = [];
    var step = 1.0 / faces;
    for(var i = 0 ; i < faces ; i++)
    {
	var i_step = i * step;
	for(var j = 0 ; j < 9 ; j++)
	    colors.push(i_step);
    }
    return colors;
}

function rotate_points(vertices , angle)
{
    var sin= Math.sin(angle);
    var cos= Math.cos(angle);
    for(var i = 0 ; i < vertices.length ; i+=2)
    {
	var x = vertices[i];
	var y = vertices[i + 1];
	var xp = (x * sin) + (y * cos);
	var yp = (x * cos) - (y * sin);
	vertices[i] = xp;
	vertices[i + 1] = yp;
    }
    return vertices;
}
