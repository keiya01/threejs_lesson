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
}
