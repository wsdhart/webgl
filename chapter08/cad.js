"use strict";

var canvas;
var gl;
var program;

var perspective;
var u_perspective;

var to_radians = Math.PI / 180.0;
var to_degrees = 180.0 / Math.PI;

var shapes = [];
var current = 0;

window.onload = function init()
{
    canvas = document.getElementById("webgl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(gl)
    {
	setup();
	render();
    }
    else
    { alert("Failed initialising WebGL"); }
}

function setup()
{
    gl.viewport(0 , 0 , gl.drawingBufferWidth , gl.drawingBufferHeight);
    gl.clearColor(1.0 , 1.0 , 1.0 , 1.0);
    gl.lineWidth(1.0);
    gl.polygonOffset(0.0 , 0.0);
    gl.enable(gl.DEPTH_TEST);

    program = init_program(gl , "vertex-shader" , "fragment-shader");
    gl.useProgram(program);

    perspective = mat4.create();
    perspective = mat4.identity(perspective);
    perspective = mat4.perspective
    (
	perspective ,
	45.0 ,
	gl.drawingBufferWidth / gl.drawingBufferHeight ,
	0.001 ,
	100.0
    );
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    u_perspective = gl.getUniformLocation(program , "u_perspective");
    gl.uniformMatrix4fv(u_perspective , false , perspective);

    for(var i = 0 ; i < shapes.length ; i++)
	shapes[i].render();
}

function create_object(type)
{
    var element = document.getElementById("create_object");
    element.selectedIndex = 0;

    var shape;
    if(type == 0)
	shape = new Cone(gl , program);
    else if(type == 1)
	shape = new Cylinder(gl , program);
    else if(type == 2)
	shape = new Sphere(gl , program , 15 , 15);
    else if(type == 3)
	shape = new Cube(gl , program);
    else if(type == 4)
	shape = new Tetrahedron(gl , program);
    else return ;

    shape.create();
    shapes.push(shape);

    update_object_list();
    select_object(shapes.length - 1);

    render();
}

function select_object(item)
{
    current = item;

    var input;

    input = document.getElementById("select_object");
    input.selectedIndex = item;

    var current_shape = shapes[current];
    if(!current_shape)
	return

    input = document.getElementById("drawtype");
    if(current_shape.wireframe && current_shape.fill)
	input.value = 1;
    else if(current_shape.wireframe)
	input.value = 0;
    else if(current_shape.fill)
	input.value = 2;

    input = document.getElementById("rotate_x");
    input.value = current_shape.x_theta * to_degrees;
    input = document.getElementById("rotate_y");
    input.value = current_shape.y_theta * to_degrees;
    input = document.getElementById("rotate_z");
    input.value = current_shape.z_theta * to_degrees;

    input = document.getElementById("translate_x");
    input.value = current_shape.x_pos;
    input = document.getElementById("translate_y");
    input.value = current_shape.y_pos;
    input = document.getElementById("translate_z");
    input.value = current_shape.z_pos;

    input = document.getElementById("fill_color");
    input.value = get_color(current_shape.fill_color);

    input = document.getElementById("trim_color");
    input.value = get_color(current_shape.trim_color);

    input = document.getElementById("scale_x");
    input.value = current_shape.x_scale;
    input = document.getElementById("scale_y");
    input.value = current_shape.y_scale;
}

function update_object_list()
{
    var list = document.getElementById("select_object");

    while(list.firstChild)
	list.removeChild(list.firstChild);

    for(var i = 0 ; i < shapes.length ; i++)
    {
	var option = document.createElement("option");
	option.value = i;
	option.text = shapes[i].name();
	list.add(option , i);
    }
}

function delete_object()
{
    var j = 0;
    for(var i = 0 ; i < shapes.length ; i++)
    {
	shapes[j++] = i != current ? shapes[i] : shapes[++i];
    }
    shapes.pop();

    update_object_list();
    select_object(0);

    render();
}

function update_draw_type(type)
{
    if(shapes[current])
    {
	if(type == 0)
	    shapes[current].change_draw_type(true , false);
	else if(type == 1)
	    shapes[current].change_draw_type(true , true);
	else if(type == 2)
	    shapes[current].change_draw_type(false , true);
	else
	    return;
	render();
    }
}

function rotate_x(angle)
{
    if(shapes[current])
    {
	shapes[current].x_theta = angle * to_radians;
	render();
    }
}

function rotate_y(angle)
{
    if(shapes[current])
    {
	shapes[current].y_theta = angle * to_radians;
	render();
    }
}

function rotate_z(angle)
{
    if(shapes[current])
    {
	shapes[current].z_theta = angle * to_radians;
	render();
    }
}

function translate_x(pos)
{
    if(shapes[current])
    {
	shapes[current].x_pos = pos;
	render();
    }
}

function translate_y(pos)
{
    if(shapes[current])
    {
	shapes[current].y_pos = pos;
	render();
    }
}

function translate_z(pos)
{
    if(shapes[current])
    {
	shapes[current].z_pos = pos;
	render();
    }
}

function scale_x(pos)
{
    if(shapes[current])
    {
	shapes[current].x_scale = pos;
	render();
    }
}

function scale_y(pos)
{
    if(shapes[current])
    {
	shapes[current].y_scale = pos;
	render();
    }
}

function set_fillcolor(color)
{
    if(shapes[current])
    {
	shapes[current].fill_color = set_color(color);
	render();
    }
}

function set_trimcolor(color)
{
    if(shapes[current])
    {
	shapes[current].trim_color = set_color(color);
	render();
    }
}

function set_bgcolor(color)
{
    var bg_color = set_color(color);
    gl.clearColor(bg_color[0] , bg_color[1] , bg_color[2] , bg_color[3]);

    render();
}
