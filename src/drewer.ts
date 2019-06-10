import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  DirectionalLight,
  Vector3,
  SphereGeometry,
  TextureLoader,
  TorusKnotGeometry,
  SpotLight,
  PlaneGeometry,
  AmbientLight,
} from "three";

export default class Drewer {
  public mouseX: number;
  constructor() {
    this.mouseX = 0;
  }

  get WIDTH() {
    return 960;
  }

  get HEIGHT() {
    return 540;
  }

  rotate = () => {
    const canvas: HTMLCanvasElement | null = document.querySelector("#three");
    if (!canvas) {
      return;
    }

    const renderer = new WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.WIDTH, this.HEIGHT);

    const scene = new Scene();

    const camera = new PerspectiveCamera(45, this.WIDTH / this.HEIGHT);
    camera.position.set(0, 0, 1000);

    const geometory = new BoxGeometry(400, 400, 400);
    const material = new MeshStandardMaterial({ color: 0xffffff });
    const box = new Mesh(geometory, material);
    scene.add(box);

    const directionLight = new DirectionalLight(0xffff00);
    directionLight.position.set(0, 5, 100);
    scene.add(directionLight);

    const tick = () => {
      box.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }

    tick();
  }

  mouseMove = () => {
    const canvas: HTMLCanvasElement | null = document.querySelector("#three");
    if (!canvas) {
      return;
    }

    const renderer = new WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.WIDTH, this.HEIGHT);

    const scene = new Scene();

    const camera = new PerspectiveCamera(45, this.WIDTH / this.HEIGHT);
    camera.position.set(0, 0, +1000);

    const geometory = new SphereGeometry(300, 30, 30);

    const loader = new TextureLoader();

    const material = new MeshStandardMaterial({ map: loader.load("earth.jpg") });
    const box = new Mesh(geometory, material);
    scene.add(box);

    const light = new DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    let rot = 0;
    const tick = () => {
      const targetRot = (this.mouseX / canvas.width) * 360;
      rot += (targetRot - rot) * 0.01;

      const radian = rot * Math.PI / 180;
      camera.position.x = 1000 * Math.sin(radian);
      camera.position.z = 1000 * Math.cos(radian);

      camera.lookAt(new Vector3(0, 0, 0));

      box.rotation.y += 0.01;

      renderer.render(scene, camera);

      requestAnimationFrame(tick);
    }

    tick();

    canvas.addEventListener("mousemove", (ev: MouseEvent) => {
      this.mouseX = ev.pageX;
    });
  }

  multiShadow = () => {
    const canvas: HTMLCanvasElement | null = document.querySelector("#three");
    if (!canvas) {
      return;
    }
    const renderer = new WebGLRenderer({ canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.WIDTH, this.HEIGHT);

    renderer.shadowMap.enabled = true;

    const scene = new Scene();

    const camera = new PerspectiveCamera(50, this.WIDTH / this.HEIGHT);
    camera.position.set(20, 20, 20);
    camera.lookAt(new Vector3(0, 0, 0));

    const floor = new Mesh(
      new BoxGeometry(2000, 0.1, 2000),
      new MeshStandardMaterial({color: 0x808080, roughness: 0.0})
    );
    floor.receiveShadow = true;
    scene.add(floor);

    const knot = new Mesh(
      new TorusKnotGeometry(3, 1, 100, 16),
      new MeshStandardMaterial({ color: 0xaa0000, roughness: 0.0 })
    );
    knot.castShadow = true;
    scene.add(knot);

    const light = new SpotLight(0xffffff, 2, 500, Math.PI / 4, 0.1);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);

    const tick = () => {
      renderer.render(scene, camera);

      const t = Date.now() / 1000;
      const r = 20.0;
      const lx = r * Math.cos(t);
      const lz = r * Math.sin(t);
      const ly = r + 5.0 * Math.sin(t / 3.0);
      light.position.set(lx, ly, lz);

      requestAnimationFrame(tick);
    }

    tick();
  }

  perspectiveCamera = () => {
    const canvas: HTMLCanvasElement | null = document.querySelector("#three");
    if(!canvas) {
      return;
    }

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.WIDTH, this.HEIGHT);
    renderer.shadowMap.enabled = true;

    const scene = new Scene();

    const camera = new PerspectiveCamera(50, this.WIDTH / this.HEIGHT);

    const ambientLight = new AmbientLight(0xffffff);
    scene.add(ambientLight);

    const spotLight = new SpotLight(0xdddddd, 5, 2000, Math.PI / 5, 0.2, 1.5);
    spotLight.position.set(300, 50, 1000);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);

    const floor = new Mesh(
      new PlaneGeometry(2000, 2000),
      new MeshStandardMaterial({
        roughness: 0.0,
        metalness: 0.2
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const boxMaterial = new MeshStandardMaterial({
      color: 0x22dd22,
      roughness: 0.1,
      metalness: 0.2
    });
    const boxGeometry = new BoxGeometry(45, 45, 45);
    for(let i = 0; i < 60; i++) {
      const box = new Mesh(boxGeometry, boxMaterial);
      box.position.x = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
      box.position.y = 25;
      box.position.z = Math.round((Math.random() - 0.5) * 19) * 50 + 25;

      box.castShadow = true;
      box.receiveShadow = true;
      scene.add(box);
    }

    const tick = () => {
      camera.position.x = 500 * Math.sin(Date.now() / 2000);
      camera.position.y = 250;
      camera.position.z = 500 * Math.cos(Date.now() / 2000);

      camera.lookAt(new Vector3(0, 0, 0));

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }

    tick();
  }
}
