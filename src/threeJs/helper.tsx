'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

/*PerspectiveCamera : 원근감이 있는 카메라*/
const Helper = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); //고해상도로 표현하기 위함. ex) 2배 크기의 이미지를 가져와 절반의 크기로 표현하는 것과 같음.

    /* Scene(공간)*/
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('lightgrey', 3, 7);

    /*Camera(시점) https://threejs.org/docs/index.html#api/ko/cameras/PerspectiveCamera*/
    const camera = new THREE.PerspectiveCamera(
      75, //시야각
      window.innerWidth / window.innerHeight, //종횡비
      0.1, // near
      1000 // far
    );
    camera.position.x = 1;
    camera.position.y = 3;
    camera.position.z = 5;

    /*조명 */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); //전체적으로 조명을 적용
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    scene.add(directionalLight);

    /*AxesHelper: x,y,z축을 표시해줌*/
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(5);
    scene.add(gridHelper);

    /* Mesh(보여지는 사물)*/
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 'red',
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 2;
    scene.add(mesh);

    camera.lookAt(mesh.position);

    /*그리기*/
    const clock = new THREE.Clock();

    const draw = () => {
      const time = clock.getElapsedTime(); //draw를 시작한 후 총 경과 시간(증가하는 값)
      mesh.rotation.y = time;
      renderer.render(scene, camera);
      renderer.setAnimationLoop(draw); //위와 같은 함수.(WebXR = VR에서는 이 함수를 써야함)
    };
    draw();

    /*window 화면에 따른 camera 위치 조정 */
    const setSize = (camera: THREE.PerspectiveCamera, window: Window) => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', () => setSize(camera, window));

    return () =>
      window.removeEventListener('resize', () => setSize(camera, window));
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Helper;
