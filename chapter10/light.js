"use strict";

function Light(gl , program)
{
    this.gl = gl;
    this.program = program;

    this.position = [0 , 2 , -3 , 0];

    this.ambient = [1 , 1 , 1 , 1];
    this.diffuse = [1 , 1 , 1 , 1];
    this.specula = [1 , 1 , 1 , 1];
    this.enabled = true;

    this.name = "Unknown";
}

Light.prototype.render = function()
{

}

