"use strict";

var canvas;
var gl;
var program;

var perspective;
var u_perspective;

var u_ambient;
var u_diffuse;
var u_specula;

var ambient = [1.0 , 1.0 , 1.0 , 1.0];
var diffuse = [1.0 , 1.0 , 1.0 , 1.0];
var specula = [1.0 , 1.0 , 1.0 , 1.0];

var u_shiney;

var u_specula_light;
var specula_light = [0 , 2 , -3 , 0];

var u_diffuse_light;
var diffuse_light = [0 , 2 , -3 , 0];

var light_ambient = [1.0 , 1.0 , 1.0 , 1.0];
var light_diffuse = [1.0 , 1.0 , 1.0 , 1.0];
var light_specula = [1.0 , 1.0 , 1.0 , 1.0];

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
    gl.clearColor(0.0 , 0.0 , 0.0 , 1.0);
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

    update_object_list();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    u_perspective = gl.getUniformLocation(program , "u_perspective");
    gl.uniformMatrix4fv(u_perspective , false , perspective);

    for(var j = 0 ; j < shapes.length ; j++)
    {
	var shape = shapes[j];

	for(var i = 0 ; i < 4 ; i++)
	    ambient[i] = shape.ambient[i] * light_ambient[i];
	u_ambient = gl.getUniformLocation(program , "u_ambient");
	gl.uniform4fv(u_ambient , new Float32Array(ambient));

	for(var i = 0 ; i < 4 ; i++)
	    diffuse[i] = shape.diffuse[i] * light_diffuse[i];
	u_diffuse = gl.getUniformLocation(program , "u_diffuse");
	gl.uniform4fv(u_diffuse , new Float32Array(diffuse));

	for(var i = 0 ; i < 4 ; i++)
	    specula[i] = shape.specula[i] * light_specula[i];
	u_specula = gl.getUniformLocation(program , "u_specula");
	gl.uniform4fv(u_specula , new Float32Array(specula));

	u_shiney = gl.getUniformLocation(program , "u_shiney");
	gl.uniform1f(u_shiney , shape.shiney);

	u_specula_light = gl.getUniformLocation(program , "u_specula_light");
	gl.uniform4fv(u_specula_light , new Float32Array(specula_light));

	u_diffuse_light = gl.getUniformLocation(program , "u_diffuse_light");
	gl.uniform4fv(u_diffuse_light , new Float32Array(diffuse_light));

	shape.render();
    }
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

    input = document.getElementById("ambient_color");
    input.value = get_color(current_shape.ambient);

    input = document.getElementById("diffuse_color");
    input.value = get_color(current_shape.diffuse);

    input = document.getElementById("specula_color");
    input.value = get_color(current_shape.specula);

    input = document.getElementById("shininess");
    input.value = current_shape.shiney;

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

    var panel = document.getElementById("object_panel");

    if(shapes.length == 0)
	panel.style.display = 'none';
    else
	panel.style.display = 'inline';
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

function shininess(pos)
{
    if(shapes[current])
    {
	shapes[current].shiney = pos;
	render();
    }
}

function set_ambientcolor(color)
{
    if(shapes[current])
    {
	shapes[current].ambient = set_color(color);
	render();
    }
}

function set_diffusecolor(color)
{
    if(shapes[current])
    {
	shapes[current].diffuse = set_color(color);
	render();
    }
}

function set_speculacolor(color)
{
    if(shapes[current])
    {
	shapes[current].specula = set_color(color);
	render();
    }
}

function set_bgcolor(color)
{
    var bg_color = set_color(color);
    gl.clearColor(bg_color[0] , bg_color[1] , bg_color[2] , bg_color[3]);

    render();
}

function specula_x(pos)
{
    specula_light[0] = pos;
    render();
}

function specula_y(pos)
{
    specula_light[1] = pos;
    render();
}

function specula_z(pos)
{
    specula_light[2] = pos;
    render();
}

function diffuse_x(pos)
{
    diffuse_light[0] = pos;
    render();
}

function diffuse_y(pos)
{
    diffuse_light[1] = pos;
    render();
}

function diffuse_z(pos)
{
    diffuse_light[2] = pos;
    render();
}

function set_ambientlight(color)
{
    light_ambient = set_color(color);
    render();
}

function set_diffuselight(color)
{
    light_diffuse = set_color(color);
    render();
}

function set_speculalight(color)
{
    light_specula = set_color(color);
    render();
}
