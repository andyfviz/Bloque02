import * as THREE from 'three'
import Experience from '../Experience.js'
import testVertexShader from '../shaders/test/vertex.glsl'
import testFragmentShader from '../shaders/test/fragment.glsl'

export default class ShaderTest
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Shader')
        }

        this.setGeometry()
    }

    setGeometry()
    {
        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2, 32, 32, 32)
        this.material = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uOffset: {
                    value: 0.1
                },
            }
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.x = -0.75
        this.mesh.position.y = 1
        this.mesh.position.z = 1
        this.mesh.castShadow = true
        this.scene.add(this.mesh)

        this.sinIncrement = 0
    }

    update()
    {
        // update uniforms or something
        this.sinIncrement += 0.05

        this.material.uniforms.uOffset.value += 0.5;

        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        
        this.mesh.position.y += Math.sin(this.sinIncrement) * 0.007;
    }
}