var container, scene, camera, renderer;
			var keyboard = new THREEx.KeyboardState();
			var clock = new THREE.Clock();
			var moveDistance;
			var helper;
			var box;

			var viewBB=1; // Hacer los boundingBox vicibles

			var MovingCube;
			var collidableMeshList = [];

			var arrowList = [];
			var directionList = [];

			init();
			//changeTangible("Wall1");
			animate();

			function init() 
			{

				//SCENE
				scene = new THREE.Scene();
				

				// CAMERA
				var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
				var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
				camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
				scene.add(camera);
				camera.position.set(0,150,400);
				camera.lookAt(scene.position);
				
				//RENDER
				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor(0x000000, 1.0);
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				

				

				// LIGHT
				var light = new THREE.PointLight(0xffffff);
				light.position.set(0,250,0);
				scene.add(light);
				
				

				// FLOOR
				var floorMaterial = new THREE.MeshBasicMaterial( {color:0x444444, side:THREE.DoubleSide} );
				var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
				var floor = new THREE.Mesh(floorGeometry, floorMaterial);
				floor.position.y = -0.5;
				floor.rotation.x = Math.PI / 2;
				scene.add(floor);

				// SKYBOX/FOG
				var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
				var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
				var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
				scene.add(skyBox);

				////////////
				// CUSTOM //
				////////////

				var cubeGeometry = new THREE.CubeGeometry(50,50,50,1,1,1);
				var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
				
				//MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
				MovingCube = new THREE.Mesh(
					new THREE.SphereBufferGeometry(25, 32, 32 ),
					new THREE.MeshBasicMaterial()
				);
				MovingCube.position.set(0, 25, 0);
				MovingCube.geometry.computeBoundingBox();
				scene.add( MovingCube );

				
				if(viewBB){
					box = new THREE.Box3();
					box.copy( MovingCube.geometry.boundingBox ).applyMatrix4( MovingCube.matrixWorld );
					helper = new THREE.Box3Helper( box, 0xffff00 );
					scene.add( helper );

				}
				

				
		
				var wallGeometry = new THREE.CubeGeometry( 100, 100, 20, 1, 1, 1 ); //SphereGeometry( 100, 10, 10 );
				var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
				var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );

				
		
				var wall = new THREE.Mesh(new THREE.SphereBufferGeometry(50, 32, 32 ), wallMaterial);
				wall.position.set(100, 50, -100);
				//wall.geometry.computeBoundingBox();
				wall.userData.id = "Wall1";
				wall.userData.tangible = 1;
				scene.add(wall);
				collidableMeshList.push(wall);

				var wall = new THREE.Mesh(new THREE.SphereBufferGeometry(50, 32, 32 ), wireMaterial);
				wall.position.set(100, 50, -100);
				scene.add(wall);


				if(viewBB){
					var wall = new THREE.Mesh(
						new THREE.CubeGeometry(100, 100, 100, 1, 1, 1 ), 
						new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } )
					);
					wall.position.set(100, 50, -100);
					scene.add(wall);

				}
				


		
				var wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
				wall2.position.set(-150, 50, 0);
				wall2.rotation.y = 3.14159 / 2;
				//wall2.geometry.computeBoundingBox();
				wall2.userData.id = "Wall2";
				wall2.userData.tangible = 1;
				scene.add(wall2);
				collidableMeshList.push(wall2);


				var wall2 = new THREE.Mesh(wallGeometry, wireMaterial);
				wall2.position.set(-150, 50, 0);
				wall2.rotation.y = 3.14159 / 2;
				scene.add(wall2);

				
			}
			

			function changeTangible(txt) {
				
				for(var i=0; i< collidableMeshList.length; i++){
					
					if(collidableMeshList[i].userData.id == txt){
						collidableMeshList[i].userData.tangible = !collidableMeshList[i].userData.tangible;
						
					}

				}


			}

			function detectCollisionCubes(object1, object2) {
				object1.geometry.computeBoundingBox(); //not needed if its already calculated
				object2.geometry.computeBoundingBox();
				object1.updateMatrixWorld();
				object2.updateMatrixWorld();

				var box1 = object1.geometry.boundingBox.clone();
				box1.applyMatrix4(object1.matrixWorld);

				var box2 = object2.geometry.boundingBox.clone();
				box2.applyMatrix4(object2.matrixWorld);

				return box1.intersectsBox(box2);

			}



       	 	function collDetec(Cube) 
			{
				// collision detection:
				//   determines if any of the rays from the cube's origin to each vertex
				//		intersects any face of a mesh in the array of target meshes
				//   for increased collision accuracy, add more vertices to the cube;
				//		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
				//   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur

				var originPoint = Cube.position.clone();

				
				var coll= 0;


				


				////
				
				for(var i=0; i<collidableMeshList.length ; i++){
					if (collidableMeshList[i].userData.tangible && detectCollisionCubes(Cube, collidableMeshList[i]) ) {
						
						coll = 1;

					}

					
				}
				



				if(coll){
					
					return 1;
					
					
				}else{ 
					

					return 0;
				}

				//coll=0;

			}

        	


			function update()
			{
				var delta = clock.getDelta(); // seconds.
				moveDistance = 200 * delta; // 200 pixels per second
				var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
				
				var cCube = MovingCube.clone();
				
				
				
				if ( keyboard.pressed("A") )
					MovingCube.rotation.y += rotateAngle;
				if ( keyboard.pressed("D") )
					MovingCube.rotation.y -= rotateAngle;
						
				

				if ( keyboard.pressed("left")){ 
					
					cCube.position.x -= moveDistance;  //+ 45;
					
					
					if(!collDetec(cCube)){MovingCube.position.x -= moveDistance;}
					

					
				}
				
				if ( keyboard.pressed("right")){ 
					
					cCube.position.x += moveDistance; //+ 45;
					
					
					if(!collDetec(cCube)){MovingCube.position.x += moveDistance;}

					
				}
				if ( keyboard.pressed("up")){ 
					
					cCube.position.z -= moveDistance ; //+ 45;
					
					
					if(!collDetec(cCube)){MovingCube.position.z -= moveDistance;}
					
				}
				if ( keyboard.pressed("down")){ 
					
					cCube.position.z += moveDistance ; //+ 45;
					
					
					if(!collDetec(cCube)){MovingCube.position.z += moveDistance;}
					
				}
				cCube = MovingCube.clone();

				

				//controls.update();
				//stats.update();	
				

			}

			function animate() 
			{
				
				requestAnimationFrame( animate );
				if(viewBB){box.copy( MovingCube.geometry.boundingBox).applyMatrix4( MovingCube.matrixWorld );}
				render();
				update();
			}
			

			function render() 
			{
				renderer.render( scene, camera );
			}
