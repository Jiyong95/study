'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { KeyController } from './util/keyController';

const KeyboardControl = () => {
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

    const camera = new THREE.PerspectiveCamera(
      75, //시야각
      window.innerWidth / window.innerHeight, //종횡비
      0.1, // near
      1000 // far
    );
    camera.position.x = 0;
    camera.position.y = 1;
    camera.position.z = 5;

    /*조명 */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); //전체적으로 조명을 적용
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.x = 1;
    directionalLight.position.z = 2;
    scene.add(directionalLight);

    /* Mesh(보여지는 사물)*/
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 'red',
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

    // Controls
    const controls = new PointerLockControls(camera, renderer.domElement);

    controls.domElement.addEventListener('click', () => {
      controls.lock();
    });
    controls.addEventListener('lock', () => {
      console.log('lock!');
    });
    controls.addEventListener('unlock', () => {
      console.log('unlock!');
    });

    // 키보드 컨트롤
    const keyController = new KeyController();

    function walk() {
      if (keyController.keys.has('KeyW') || keyController.keys.has('ArrowUp')) {
        controls.moveForward(0.02);
      }
      if (
        keyController.keys.has('KeyS') ||
        keyController.keys.has('ArrowDown')
      ) {
        controls.moveForward(-0.02);
      }
      if (
        keyController.keys.has('KeyA') ||
        keyController.keys.has('ArrowLeft')
      ) {
        controls.moveRight(-0.02);
      }
      if (
        keyController.keys.has('KeyD') ||
        keyController.keys.has('ArrowRight')
      ) {
        controls.moveRight(0.02);
      }
    }

    /*그리기*/
    const clock = new THREE.Clock();

    const draw = () => {
      const time = clock.getElapsedTime(); //draw를 시작한 후 총 경과 시간(증가하는 값)
      group1.rotation.y = time;
      group2.rotation.y = time;
      group3.rotation.y = time;
      walk();
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

export default KeyboardControl;
