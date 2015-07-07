"use strict";

function rotate_points(vertices , angle)
{
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
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

function twist_points(vertices , angle)
{
    for(var i = 0 ; i < vertices.length ; i+=2)
    {
	var x = vertices[i];
	var y = vertices[i + 1];
	var distance = Math.sqrt((x * x)+(y * y));
	var delta = angle * distance;
	var sin = Math.sin(delta);
	var cos = Math.cos(delta);
	var xp = (x * sin) + (y * cos);
	var yp = (x * cos) - (y * sin);
	vertices[i] = xp;
	vertices[i + 1] = yp;
    }
    return vertices;
}
