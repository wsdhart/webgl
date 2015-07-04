"use strict";

var sides = 11;
var subdivisions = 4;
var holes = false;

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
	vertices = split_vertices(vertices);
    var polygon = new Float32Array(vertices);
    bind_buffer(gl , polygon);
    bind_attribute(gl, program , "v_position" , 2);

    var colors = create_colors(vertices.length / 6);
    bind_buffer(gl , colors);
    bind_attribute(gl , program , "v_color" , 3);

    return polygon;
}

function render(gl , vertices)
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES , 0 , vertices.length / 2);
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

    return nodes;
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
    colors = new Float32Array(colors);
    return colors;
}

function midpoint(x1 , x2)
{
    return x1 + ((x2 - x1) / 2.0);
}

function split_vertices(vertices)
{
    var nodes = [];
    for(var i = 0 ; i < vertices.length ; i+=6)
    {
	var x1 = vertices[i];
	var y1 = vertices[i + 1];
	var x2 = vertices[i + 2];
	var y2 = vertices[i + 3];
	var x3 = vertices[i + 4];
	var y3 = vertices[i + 5];
	var split = split_triangle(x1 , y1 , x2 , y2 , x3 , y3 , !holes);
	for(var j = 0 ; j < split.length ; j++)
	    nodes.push(split[j]);
    }
    return nodes;
}

function split_triangle(x1 , y1 , x2 , y2 , x3 , y3 , center)
{
    var mx1 = midpoint(x1 , x2);
    var my1 = midpoint(y1 , y2);
    var mx2 = midpoint(x2 , x3);
    var my2 = midpoint(y2 , y3);
    var mx3 = midpoint(x1 , x3);
    var my3 = midpoint(y1 , y3);

    var array = [];

    array.push(x1);
    array.push(y1);
    array.push(mx1);
    array.push(my1);
    array.push(mx3);
    array.push(my3);

    array.push(mx1);
    array.push(my1);
    array.push(x2);
    array.push(y2);
    array.push(mx2);
    array.push(my2);

    array.push(mx3);
    array.push(my3);
    array.push(mx2);
    array.push(my2);
    array.push(x3);
    array.push(y3);

    if(center)
    {
	array.push(mx1);
	array.push(my1);
	array.push(mx2);
	array.push(my2);
	array.push(mx3);
	array.push(my3);
    }

    return array;
}
