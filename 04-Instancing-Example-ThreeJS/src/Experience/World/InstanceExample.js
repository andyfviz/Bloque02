import * as THREE from 'three'
import Experience from '../Experience.js'
import testVertexShader from '../shaders/test/vertex.glsl'
import testFragmentShader from '../shaders/test/fragment.glsl'

export default class InstanceExample
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

        this.initMesh()
        this.initInstances()
    }

    initMesh()
    {
        // this.geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3, 32, 32, 32)
        this.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1, 1, 1, 1)
        this.material = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            side: THREE.DoubleSide
        })

        this.material = new THREE.MeshStandardMaterial({ color: 0xff6600 });

        // this.mesh = new THREE.Mesh(this.geometry, this.material)
        // this.scene.add(this.mesh)
    }

    initInstances() {
        this.instancesTotal = 80000;
        this.instancedMesh = new THREE.InstancedMesh(this.geometry, this.material, this.instancesTotal);
        this.instancedMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
        this.instancedMesh.castShadow = true
        this.scene.add(this.instancedMesh);
        this.instancesTransformations = [];

        for (let i = 0; i < this.instancesTotal; i++) {
            const dummy = new THREE.Object3D();

            // Set random position for each instance
            dummy.position.set(
                Math.random() * 100 - 50,
                Math.random() * 4 + 0,
                Math.random() * 200 - 100
            );
            
            // Optionally set random rotation and scale
            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            dummy.scale.set(
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5
            );

            dummy.speed = Math.random() * 0.04

            // Update the matrix for this instance
            dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, dummy.matrix);

            // Save dummy object so it can be animated or transformed later
            this.instancesTransformations.push(dummy);
        }

        // Make sure the matrix updates are reflected in the GPU
        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMesh.computeBoundingSphere();
        
    }

    update()
    {
        // update uniforms or something
        for (let i = 0; i < this.instancesTransformations.length; i++) {
            const dummy = this.instancesTransformations[i];
            dummy.position.z -= dummy.speed;
            dummy.rotation.y += 0.015;
            if (dummy.position.z <= -100) dummy.position.z = 100;
            dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMesh.computeBoundingSphere();
    }
}