import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import ShaderTest from './ShaderTest.js'
import InstanceExample from './InstanceExample.js'
import InstancedCustomGeometryExample from './InstancedCustomGeometryExample.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
            this.shaderTest = new ShaderTest()
            this.instanceExample = new InstanceExample()
            this.instancedCustomGeometryExample = new InstancedCustomGeometryExample()
        })
    }

    update()
    {
        if(this.fox)
            this.fox.update()
        
        if(this.shaderTest)
            this.shaderTest.update()

        if(this.instanceExample)
            this.instanceExample.update()
        
        if(this.instancedCustomGeometryExample)
            this.instancedCustomGeometryExample.update()
    }
}