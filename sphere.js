var renderer, scene, camera, composer, planet, skelet, texture;
var canvas = document.getElementById("gol");

window.onload = function() {
  canvas.style = "display:none"
  document.body.style = "background:radial-gradient(#222, #000)"
  init();
  animate();
}

function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  renderer.domElement.style = "pointer-events:none;position: fixed;top: 0;filter: blur(2px) contrast(10)";
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0xA6CDFB, 1, 1000);

  camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1000;
  camera.position.x = 0;
  camera.position.y = -100;
  scene.add(camera);

  planet = new THREE.Object3D();
  scene.add(planet);

  planet.position.y = -180;

  var geom = new THREE.IcosahedronGeometry(12, 5);

  texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.anisotropy = 10;

  const material = new THREE.MeshBasicMaterial({
    map: texture
  });

  var mesh = new THREE.Mesh(geom, material);
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 8;
  mesh.position.z = 0;
  mesh.position.y = 100;
  planet.add(mesh);

  var ambientLight = new THREE.AmbientLight(0xBD9779);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  window.addEventListener('resize', onWindowResize, false);

};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  planet.rotation.z += 0;
  planet.rotation.y += .01;
  planet.rotation.x += 0;
  texture.needsUpdate = true;

  renderer.clear();

  renderer.render( scene, camera );
};
