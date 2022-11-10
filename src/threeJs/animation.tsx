'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import classnames from 'classnames/bind';
import styles from './threeJs.module.scss';
const cx = classnames.bind(styles);

/*PerspectiveCamera : 원근감이 있는 카메라*/
const Animation = () => {
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
    renderer.setClearColor(0x00ff00); //배경색 직접 설정
    renderer.setClearAlpha(0.5); //opacity와 비슷한 효과(setClearColor /2 + backgroundColor 합친 색)

    /* Scene(공간)*/
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('blue'); //scene에 적용하면 renderer에 적용된 색상 무시됨.

    /*Camera(시점) https://threejs.org/docs/index.html#api/ko/cameras/PerspectiveCamera*/
    const camera = new THREE.PerspectiveCamera(
      75, //시야각
      window.innerWidth / window.innerHeight, //종횡비
      0.1, // near
      1000 // far
    );

    camera.position.z = 5;

    /*조명 */
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.x = 1;
    light.position.z = 2;
    scene.add(light);

    /* Mesh(보여지는 사물)*/
    //모양
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    //재질
    const material = new THREE.MeshStandardMaterial({
      color: 'red',
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /*그리기*/
    const clock = new THREE.Clock();

    let direction = 1;
    const draw = () => {
      /* 기기 성능에 따라 draw호출 횟수가 달라지기 때문에 성능을 맞춰주기 위해 절대값인 time을 활용해 성능을 보정한다.
        성능이 안좋으면 호출이 더 적게 일어나는데, time값은 동일하니 time값을 활용한 animation 변화값은 동일하다.
        대신 성능이 좋을수록 더 부드럽게 움직이며, 성능이 안좋으면 끊기는 움직임이 더 발생한다.
      */
      //절대값 사용
      const time = clock.getElapsedTime(); //draw를 시작한 후 총 경과 시간(증가하는 값)
      const delta = clock.getDelta(); //draw호출 사이의 간격 시간(일정한 값)

      mesh.rotation.y = time; // === mesh.rotation.y += THREE.MathUtils.degToRad(1); //1도
      if (mesh.position.y > 2) direction *= -1;
      if (mesh.position.y < -2) direction *= -1;
      mesh.position.y += 0.01 * direction;

      renderer.render(scene, camera);

      // window.requestAnimationFrame(draw); //연속적으로 함수를 동작시킴
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

  return (
    <div className={cx('wrapper')}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Animation;
