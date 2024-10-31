import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BufferGeometry()
const count = 50
const positionsArray = new Float32Array(count * 3 * 3)
for(let i = 0; i < count * 3 * 3; i++)
{
    positionsArray[i] = (Math.random() - 0.5) * 4
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.z = 3
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * ////////////////////////////////////////////////
 * Interaccion de la cámara con el Mouse 
 * ////////////////////////////////////////////////
 */

// var myMouse = {
window.myMouse = {
    x: 0,
    y: 0,

    /* 
        "smooth" me refiero al valor "suavizado" de las coordenadas X y Y usando la integración de verlet, es una operación matemática que nos ayuda a "acercar" poco a poco la posicion de un objeto de un punto a otro en lugar de reescribir la posición instantaneamente.

        "cof" o "coeficiente de fricción" es la velocidad con la cual se va a "acercar" del punto A al punto B.
    */
    cof: 0.1,

    smooth: {
        x: 0,
        y: 0,
    },


    /*
        "tilt" en este caso me refiero a otro sistema de coordenadas similar al espacio 3D, donde el origen (o coordenada 0,0) es el centro, los positivos son hacia la derecha y arriba, mientras los negativos son hacia la izquierda y abajo. Los extremos de la pantalla son 1 y -1 respectivamente.

        "tiltSmooth" tiene la misma functión que "smooth", pero usando el valor "normalizado" en lugar del que obtenemos del evento "mousemove"
    */
    tilt: {
        x: 0,
        y: 0,
    },
    
    tiltSmooth: {
        x: 0,
        y: 0,
    },

    /*
        "delta" comunmente es usado para hacer referencia a la "aceleración" actual del movimiento del mouse, cuando estamos en reposo sin mover el cursor su valor es "0". 
    
        Para calcularlo necesitamos la posición anterior, de ahí que exista el atributo "last".
    */
    last: {
        x: 0,
        y: 0,
    },
    delta: {
        x: 0,
        y: 0,
    },
    deltaSmooth: {
        x: 0,
        y: 0,
    },
}

function updateMouseTilt() {
    myMouse.tilt.x = ((myMouse.x * 2) - window.innerWidth) / window.innerWidth;
    myMouse.tilt.y = ((myMouse.y * 2) - window.innerHeight) / window.innerHeight;
    myMouse.tilt.y *= -1;

    // console.log(myMouse.tilt.x, myMouse.tilt.y);
}

function updateMouseCoords(eventData) {
    myMouse.x = eventData.clientX;
    myMouse.y = eventData.clientY;

    updateMouseTilt();

    // console.log(myMouse.x, myMouse.y);
}

window.addEventListener('mousemove', updateMouseCoords);

function updateMouseExtraData() {
    // Actualizando valores "smooth" del mouse
    myMouse.smooth.x += (myMouse.x - myMouse.smooth.x) * myMouse.cof;
    myMouse.smooth.y += (myMouse.y - myMouse.smooth.y) * myMouse.cof;
    
    // Actualizando valores "tiltSmooth" del mouse
    myMouse.tiltSmooth.x += (myMouse.tilt.x - myMouse.tiltSmooth.x) * myMouse.cof;
    myMouse.tiltSmooth.y += (myMouse.tilt.y - myMouse.tiltSmooth.y) * myMouse.cof;

    // console.log('smooth', myMouse.smooth, myMouse.tiltSmooth);


    // Actualizando valores "delta" del mouse
    myMouse.delta.x = myMouse.x - myMouse.last.x;
    myMouse.delta.y = myMouse.y - myMouse.last.y;

    myMouse.last.x = myMouse.x;
    myMouse.last.y = myMouse.y;

    myMouse.deltaSmooth.x += (myMouse.delta.x - myMouse.deltaSmooth.x) * myMouse.cof;
    myMouse.deltaSmooth.y += (myMouse.delta.y - myMouse.deltaSmooth.y) * myMouse.cof;
}



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Movimiento de cámara usando los datos del mouse
    updateMouseExtraData();
    camera.position.x = -myMouse.tiltSmooth.x * 2;
    camera.position.y = -myMouse.tiltSmooth.y * 0.7;

    camera.lookAt(mesh.position);
    
    camera.rotateZ(myMouse.deltaSmooth.x * 0.005);
    
    // Update controls
    // controls.update()


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()