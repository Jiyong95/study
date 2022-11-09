'use client'; //React 서버 Components가 아닌 Client Components 경우
/*사용되는 경우
1. react hook사용할 경우 : useState, useEffect 등 react hook
2. browser Api사용할 경우
3. eventListener
*/
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*OrthographicCamera : 원근감이 없는 카메라*/
const OrthographicCamera = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      /* Scene(공간)*/
      const scene = new THREE.Scene();

      /*Camera(시점) https://threejs.org/docs/index.html#api/ko/cameras/OrthographicCamera*/
      const camera = new THREE.OrthographicCamera(
        -(window.innerWidth / window.innerHeight), //종횡비
        window.innerWidth / window.innerHeight,
        1, //top
        -1, //bottom
        0.1,
        1000
      );

      camera.position.x = 1;
      camera.position.y = 2;
      camera.position.z = 5; //perspectiveCamera와 동작이 다르다.
      camera.lookAt(0, 0, 0); //카메라가 원점을 바라보게 함.(원점 = mesh)
      camera.zoom = 0.5; //perspectiveCamera z축이동과 비슷한 효과
      camera.updateProjectionMatrix(); //zoom사용 후 camera update를 실행시켜야 반영된다.

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
    }
  }, []);

  return <canvas ref={canvasRef} />;
};

export default OrthographicCamera;
