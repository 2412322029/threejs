import './mian.css'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
//状态显示
const stats = Stats()
document.body.appendChild(stats.dom)
//调节gui
export const gui = new GUI()

//初始化场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("main").appendChild(renderer.domElement);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const control = new OrbitControls(camera, renderer.domElement);

//环境光
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

//平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);
var ctrler = { follow: false }
gui.add(ctrler, "follow").name("光跟随视角")
gui.add(directionalLight, "intensity", 0, 1)
function loop() {
    if (ctrler.follow) {
        scene.remove(directionalLight)
        directionalLight.position.set(...camera.position);
        scene.add(directionalLight);
    } else {
        scene.remove(directionalLight)
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);
    }
}

function loadImage(url, size = 20, callback) {
    
    new THREE.TextureLoader().load(url, (texture) => {
        const SIZE = size;
        const img = texture.image;
        let height = (img && img.height) || SIZE;
        let width = (img && img.width) || SIZE;
        height = (SIZE / width) * height;
        width = SIZE;
        const mat = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
        const geom = new THREE.PlaneGeometry(width, height);
        const mesh = new THREE.Mesh(geom, mat);
        callback(mesh)
    });
}
function init(scene, camera, renderer) {
    loadImage(new URL("./texture/cc.jpg", import.meta.url).href,
        10, (mesh) => {
            mesh.position.set(20, 10, 10)
            scene.add(mesh)
        })
    //
    loadImage(new URL("./texture/16.jpg", import.meta.url).href,
        100, (mesh) => {
            mesh.position.set(0, 50, 0)
            scene.add(mesh)
        })
    //
    const torus = new THREE.Mesh(
        new THREE.TorusGeometry(10, 3, 16, 50),
        new THREE.MeshPhongMaterial({ color: 0xffff00 })
    );
    const torusFolder = gui.addFolder('圆环')

    var toruscolor = { color: "#fff000" }
    torusFolder.addColor(toruscolor, "color").onChange((col) => {
        torus.material.color.setHex(toruscolor.color.replace("#", "0x"))
    });
    torusFolder.add(torus.rotation, "x", 0, Math.PI * 2, 0.01)
    torusFolder.add(torus.rotation, "y", 0, Math.PI * 2, 0.01)
    torusFolder.add(torus.position, "x", -50, 50, 1)
    torusFolder.add(torus.position, "y", -50, 50, 1)
    torusFolder.add(torus.position, "z", -50, 50, 1)
    // torusFolder.add(torus)
    scene.add(torus);
    //
    const torus2 = new THREE.Mesh(
        new THREE.TorusGeometry(10, 1, 16, 50),
        new THREE.MeshToonMaterial({ color: 0xffff00 })
    );
    torus2.position.set(10, 10, 10)
    scene.add(torus2);
    //
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshPhongMaterial({ color: 0x049ef4 }));
    const cubeFolder = gui.addFolder('cube')
    var cubecolor = { color: "#fff000" }
    cubeFolder.addColor(cubecolor, "color").onChange((col) => {
        cube.material.color.setHex(cubecolor.color.replace("#", "0x"))
    });
    cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01)
    cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01)
    cubeFolder.add(cube.position, "x", -50, 50, 1)
    cubeFolder.add(cube.position, "y", -50, 50, 1)
    cubeFolder.add(cube.position, "z", -50, 50, 1)
    scene.add(cube)
    //
    const rrow = new THREE.ArrowHelper(
        new THREE.Vector3(10, 20, 0),
        new THREE.Vector3(0, 0, 0),
        4, 0xffff00);
    scene.add(rrow)
    //
    const box = new THREE.BoxHelper(
        new THREE.Mesh(
            new THREE.SphereGeometry(),
            new THREE.MeshBasicMaterial()
        ), 0xffff00);
    scene.add(box)

    const gridHelper = new THREE.GridHelper(100, 10, "red");
    scene.add(gridHelper);


}

camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);
const cameraFolder = gui.addFolder('相机')
cameraFolder.add(camera.position, "x", -50, 50, 1)
cameraFolder.add(camera.position, "y", -50, 50, 1)
cameraFolder.add(camera.position, "z", -50, 50, 1)

init(scene, camera, renderer)
function animate() {
    requestAnimationFrame(animate);
    loop()
    stats.update()
    renderer.render(scene, camera);
};
animate();