'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*PerspectiveCamera : 원근감이 있는 카메라*/
const PerspectiveCamera = () => {
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

    /*Camera(시점) https://threejs.org/docs/index.html#api/ko/cameras/PerspectiveCamera*/
    const camera = new THREE.PerspectiveCamera(
      75, //시야각
      window.innerWidth / window.innerHeight, //종횡비
      0.1, // near
      1000 // far
    );

    camera.position.x = -1;
    camera.position.y = 1;
    camera.position.z = 5;

    /* Mesh(보여지는 사물)*/
    //모양
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    //재질
    const material = new THREE.MeshBasicMaterial({
      color: 'red',
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /*그리기*/
    renderer.render(scene, camera);

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

export default PerspectiveCamera;
