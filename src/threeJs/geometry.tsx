'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import dat from 'dat.gui';
import { OrbitControls } from '@src/threeJs/utils/orbitControls';
import { DragControls } from '@src/threeJs/utils/dragControls';

const Geometry = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); //고해상도로 표현하기 위함. ex) 2배 크기의 이미지를 가져와 절반의 크기로 표현하는 것과 같음.

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.y = 1.5;
    camera.position.z = 4;
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('white', 1);
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    scene.add(directionalLight);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 'seagreen',
    });

    const group1 = new THREE.Group();
    const box1 = new THREE.Mesh(geometry, material);

    const group2 = new THREE.Group();
    const box2 = box1.clone();
    box2.scale.set(0.3, 0.3, 0.3);
    group2.position.x = 2;

    const group3 = new THREE.Group();
    const box3 = box2.clone();
    box3.position.x = 0.5;
    box3.scale.set(0.15, 0.15, 0.15);

    group3.add(box3);
    group2.add(box2, group3);
    group1.add(box1, group2);
    scene.add(group1);

    /*
    //orbitControl
    const orbitCon = new OrbitControls(camera, renderer.domElement);
    orbitCon.enableDamping = true; //컨트롤 부드럽게 적용(east-in-out느낌)
*/
    const dragCon = new DragControls(
      [box1, box2, box3],
      camera,
      renderer.domElement
    );

    // Dat GUI
    const gui = new dat.GUI();
    gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
    gui.add(camera.position, 'y', -5, 5, 0.1).name('카메라 Y');
    gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

    /*그리기*/
    const clock = new THREE.Clock();

    const draw = () => {
      const time = clock.getElapsedTime(); //draw를 시작한 후 총 경과 시간(증가하는 값)
      group1.rotation.y = time;
      group2.rotation.y = time;
      group3.rotation.y = time;
      // orbitCon.update();
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

export default Geometry;
