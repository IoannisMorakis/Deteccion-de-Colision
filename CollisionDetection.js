let container, scene, camera, renderer;
let keyboard = new THREEx.KeyboardState();
let clock = new THREE.Clock();
let moveDistance;
let helper, helperWall, helperWall2;
let box, boxWall, boxWall2;

let viewBB = false; // Hacer los boundingBox visibles

let MovingCube, wall, wall2;
let collidableMeshList = [];

let arrowList = [];
let directionList = [];

init();
//changeTangible("Wall1"); //
animate();

function init() {

    //SCENE
    scene = new THREE.Scene();


    // CAMERA
    let SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
    let VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.1,
        FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 150, 400);
    camera.lookAt(scene.position);

    //RENDER
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    // LIGHT
    let light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);



    // FLOOR
    let floorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
    let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // SKYBOX/FOG
    let skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    let skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x9999ff, side: THREE.BackSide });
    let skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);

    ////////////
    // CUSTOM //
    ////////////

    //Avatar
    MovingCube = new THREE.Mesh(
        new THREE.SphereBufferGeometry(25, 32, 32),
        new THREE.MeshBasicMaterial()
    );
    MovingCube.position.set(0, 25, 0);
    MovingCube.geometry.computeBoundingBox();
    scene.add(MovingCube);


    box = new THREE.Box3();
    box.copy(MovingCube.geometry.boundingBox).applyMatrix4(MovingCube.matrixWorld);
    helper = new THREE.Box3Helper(box, 0xffff00);
    scene.add(helper);

    helper.visible = viewBB;


    //Wall
    let wallGeometry = new THREE.CubeGeometry(100, 100, 20, 1, 1, 1);
    let wallMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    let wireMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

    wall = new THREE.Mesh(new THREE.SphereBufferGeometry(50, 32, 32), wireMaterial);
    wall.position.set(100, 50, -100);
    scene.add(wall);


    wall = new THREE.Mesh(new THREE.SphereBufferGeometry(50, 32, 32), wallMaterial);
    wall.position.set(100, 50, -100);
    wall.geometry.computeBoundingBox();
    wall.userData.id = "Wall1";
    wall.userData.tangible = 1;
    scene.add(wall);
    collidableMeshList.push(wall);


    boxWall = new THREE.Box3();
    boxWall.copy(wall.geometry.boundingBox).applyMatrix4(wall.matrixWorld);
    helperWall = new THREE.Box3Helper(boxWall, 0xffff00);
    scene.add(helperWall);

    helperWall.visible = viewBB;


    //Wall2
    wall2 = new THREE.Mesh(wallGeometry, wireMaterial);
    wall2.position.set(-150, 50, 0);
    wall2.rotation.y = 3.14159 / 2;
    scene.add(wall2);


    wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.set(-150, 50, 0);
    wall2.rotation.y = 3.14159 / 2;
    wall2.geometry.computeBoundingBox();
    wall2.userData.id = "Wall2";
    wall2.userData.tangible = 1;
    scene.add(wall2);
    collidableMeshList.push(wall2);

    boxWall2 = new THREE.Box3();
    boxWall2.copy(wall2.geometry.boundingBox).applyMatrix4(wall2.matrixWorld);
    helperWall2 = new THREE.Box3Helper(boxWall2, 0xffff00);
    scene.add(helperWall2);

    helperWall2.visible = viewBB;


}


function changeTangible(txt) {

    for (let i = 0; i < collidableMeshList.length; i++) {

        if (collidableMeshList[i].userData.id == txt) {
            collidableMeshList[i].userData.tangible = !collidableMeshList[i].userData.tangible;

        }

    }


}

function detectCollisionCubes(object1, object2) {

    object1.updateMatrixWorld();
    object2.updateMatrixWorld();

    let objBox1 = object1.geometry.boundingBox.clone();
    objBox1.applyMatrix4(object1.matrixWorld);

    let objBox2 = object2.geometry.boundingBox.clone();
    objBox2.applyMatrix4(object2.matrixWorld);

    return objBox1.intersectsBox(objBox2);

}



function collDetec(Cube) { // collision detection

    let originPoint = Cube.position.clone();

    for (let i = 0; i < collidableMeshList.length; i++) {
        if (collidableMeshList[i].userData.tangible && detectCollisionCubes(Cube, collidableMeshList[i])) {
            return 1;
        }
    }
    return 0;

}




function update() {
    let delta = clock.getDelta(); // seconds.
    moveDistance = 200 * delta; // 200 pixels per second
    let rotateAngle = Math.PI / 2 * delta; // pi/2 radians (90 degrees) per second

    let cCube = MovingCube.clone();


    if (keyboard.pressed("A"))
        MovingCube.rotation.y += rotateAngle;
    if (keyboard.pressed("D"))
        MovingCube.rotation.y -= rotateAngle;


    if (keyboard.pressed("left")) {
        cCube.position.x -= moveDistance;
        if (!collDetec(cCube)) { MovingCube.position.x -= moveDistance; }
    }
    if (keyboard.pressed("right")) {
        cCube.position.x += moveDistance;
        if (!collDetec(cCube)) { MovingCube.position.x += moveDistance; }
    }
    if (keyboard.pressed("up")) {
        cCube.position.z -= moveDistance;
        if (!collDetec(cCube)) { MovingCube.position.z -= moveDistance; }
    }
    if (keyboard.pressed("down")) {
        cCube.position.z += moveDistance;
        if (!collDetec(cCube)) { MovingCube.position.z += moveDistance; }
    }
    cCube = MovingCube.clone();

}

function animate() {

    requestAnimationFrame(animate);
    box.copy(MovingCube.geometry.boundingBox).applyMatrix4(MovingCube.matrixWorld);
    boxWall.copy(wall.geometry.boundingBox).applyMatrix4(wall.matrixWorld);
    boxWall2.copy(wall2.geometry.boundingBox).applyMatrix4(wall2.matrixWorld);
    render();
    update();
}


function render() {
    renderer.render(scene, camera);
}
