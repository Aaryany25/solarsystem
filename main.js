import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { distance } from 'three/webgpu';


//Initialize the Scene

const scene = new THREE.Scene();

//Initialise the texture Loader

const textureLoader = new THREE.TextureLoader();
const cubetextureLoader = new THREE.CubeTextureLoader
cubetextureLoader.setPath('textures/cubemap/')


//Adding Textures 

const Suntexture = textureLoader.load('textures/2k_sun.jpg')

const Mercurytexture = textureLoader.load('textures/2k_mercury.jpg')


const VenusTexture = textureLoader.load('textures/2k_venus_surface.jpg')

const EarthTexture = textureLoader.load('textures/2k_earth_daymap.jpg')

const MarsTexture = textureLoader.load('textures/2k_mars.jpg')

const MoonTexture = textureLoader.load('textures/2k_moon.jpg')


const backgroundCubemap = cubetextureLoader
.load( [
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
] );

scene.background = backgroundCubemap

scene.backgroundIntensity=0.2


//Adding Materials




const mercuryMaterial = new THREE.MeshStandardMaterial( { map : Mercurytexture,} )

const venusMaterial = new THREE.MeshStandardMaterial( { map : VenusTexture,} )

const earthMaterial = new THREE.MeshStandardMaterial( { map : EarthTexture,} )

const marsMaterial = new THREE.MeshStandardMaterial( { map : MarsTexture,} )

const moonMaterial = new THREE.MeshStandardMaterial( { map : MoonTexture,} )



//Adding Stuff here 


const SphereGrometry = new THREE.SphereGeometry(3,100,100)

//Sun

const SunMaterial = new THREE.MeshBasicMaterial( { map : Suntexture,} )
const Sun = new THREE.Mesh( SphereGrometry, SunMaterial )
Sun.scale.setScalar(3)
scene.add( Sun )

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 15,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 25,
    speed: 0.015,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance:35,
    speed: 0.035,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.2,
        distance: 6,
        speed: 0.05,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 45,
    speed: 0.015,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.25,
        distance: 5,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 10,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];


const PlanetMeshs = planets.map((planet)=>{
  //create mesh
  const planetMesh = new THREE.Mesh(SphereGrometry,planet.material)
  //Setting the scale 
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x=planet.distance
  //add it to scene 
  scene.add(planetMesh);
  //loop through and create moon
  planet.moons.forEach((moon)=>{
    const moonMesh = new THREE.Mesh(SphereGrometry,moonMaterial)
    moonMesh.scale.setScalar(moon.radius);
    moonMesh.position.x=moon.distance
    planetMesh.add(moonMesh);
  })
  //add moon to planet
return planetMesh;
})
//Adds Light 

// const ambientLight = new THREE.AmbientLight("white",0.5)
// scene.add(ambientLight)
const PointLight= new THREE.PointLight("white",400)
scene.add(PointLight)
// Initailizing Camera 

const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z=30
scene.add(camera)

//Initializing Renderer


const canvas = document.querySelector('canvas')

const renderer = new THREE.WebGLRenderer({canvas:canvas,antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.render(scene,camera)



//For resizing

window.addEventListener('resize',()=>{

  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
})

//Initializing the controls


const controls = new OrbitControls(camera,canvas)




//Loop for rendering 

const renderloop =()=>{
PlanetMeshs.forEach((planet,Planetindex)=>{
  planet.rotation.y+=planets[Planetindex].speed
  planet.position.x=Math.sin(planet.rotation.y)*planets[Planetindex].distance
  planet.position.z=Math.cos(planet.rotation.y)*planets[Planetindex].distance
  planet.children.forEach((moon,moonIndex)=>{
    moon.rotation.y+=planets[Planetindex].moons[moonIndex].speed
    moon.position.x = Math.sin(moon.rotation.y) * planets[Planetindex].moons[moonIndex].distance
      moon.position.z = Math.cos(moon.rotation.y) * planets[Planetindex].moons[moonIndex].distance
  })
})
  controls.update()
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
}
renderloop()