'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*PerspectiveCamera : 원근감이 있는 카메라*/
const Fog = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true, //배경색(true = scss의 색 적용)
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); //고해상도로 표현하기 위함. ex) 2배 크기의 이미지를 가져와 절반의 크기로 표현하는 것과 같음.

    /* Scene(공간)*/
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('lightgrey', 1, 7);

    /*Camera(시점) https://threejs.org/docs/index.html#api/ko/cameras/PerspectiveCamera*/
    const camera = new THREE.PerspectiveCamera(
      75, //시야각
      window.innerWidth / window.innerHeight, //종횡비
      0.1, // near
      1000 // far
    );
    camera.position.y = 1;
    camera.position.z = 5;

    /*조명 */
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.x = 1;
    light.position.y = 3;
    light.position.z = 10;
    scene.add(light);

    /* Mesh(보여지는 사물)*/
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 'red',
    });

    const meshes: THREE.Mesh[] = [];
    let mesh: THREE.Mesh;
    for (let i = 0; i < 10; i++) {
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.random() * 5 - 2.5;
      mesh.position.z = Math.random() * 5 - 2.5;
      scene.add(mesh);
      meshes.push(mesh);
    }

    /*그리기*/
    const clock = new THREE.Clock();

    const draw = () => {
      const time = clock.getElapsedTime(); //draw를 시작한 후 총 경과 시간(증가하는 값)
      meshes.forEach((mesh) => (mesh.rotation.y = time));
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

export default Fog;
