/**
 * Brevos - 3D WebGL Background Scene
 * Built with Three.js & Scroll-driven Camera Motion
 */

class BrevosScene {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) return;

    this.isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetScroll = 0;

    this.init();
    this.createLights();
    this.createSculpture();
    this.createParticleField();
    this.createFloatingShards();
    this.bindEvents();
    this.animate();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x08090c, 0.045);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 7.5);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: !this.isMobile,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const maxPR = this.isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(maxPR);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
  }

  createLights() {
    // Subtle Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambientLight);

    // Primary Warm Amber Light (Brevos Accent)
    this.mainLight = new THREE.PointLight(0xe5c07b, 2.8, 25);
    this.mainLight.position.set(4, 3, 5);
    this.scene.add(this.mainLight);

    // Secondary Cool Slate / Champagne Light
    this.subLight = new THREE.PointLight(0xa6b8c7, 1.8, 20);
    this.subLight.position.set(-5, -2, 4);
    this.scene.add(this.subLight);

    // Soft Rim Light
    this.rimLight = new THREE.DirectionalLight(0xffeedd, 0.8);
    this.rimLight.position.set(0, 6, -3);
    this.scene.add(this.rimLight);
  }

  createSculpture() {
    // Group container for central sculpture
    this.sculptureGroup = new THREE.Group();
    this.scene.add(this.sculptureGroup);

    // A. Outer Wireframe Polyhedron (Luxury Golden Lattice)
    const polyGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xe5c07b,
      wireframe: true,
      emissive: 0x5a4115,
      roughness: 0.25,
      metalness: 0.85
    });
    this.outerPoly = new THREE.Mesh(polyGeo, wireMat);
    this.sculptureGroup.add(this.outerPoly);

    // B. Inner Faceted Core (Diamond / Crystal)
    const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x141820,
      emissive: 0x1b1f28,
      roughness: 0.1,
      metalness: 0.95,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    this.innerCore = new THREE.Mesh(coreGeo, coreMat);
    this.sculptureGroup.add(this.innerCore);

    // C. Gyroscope Rings (Dual Concentric Orbitals)
    const ringGeo1 = new THREE.TorusGeometry(2.7, 0.022, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xe5c07b,
      emissive: 0x3d2b0e,
      roughness: 0.3,
      metalness: 0.9
    });
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = Math.PI / 3;
    this.sculptureGroup.add(this.ring1);

    const ringGeo2 = new THREE.TorusGeometry(3.1, 0.018, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0xd6dce5,
      roughness: 0.2,
      metalness: 0.85
    });
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.y = Math.PI / 4;
    this.sculptureGroup.add(this.ring2);

    // Tiny glowing orbital beads
    const beadGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const beadMat = new THREE.MeshBasicMaterial({ color: 0xffd97d });
    this.bead1 = new THREE.Mesh(beadGeo, beadMat);
    this.ring1.add(this.bead1);
    this.bead1.position.set(2.7, 0, 0);

    this.bead2 = new THREE.Mesh(beadGeo, beadMat);
    this.ring2.add(this.bead2);
    this.bead2.position.set(0, 3.1, 0);
  }

  createParticleField() {
    const particleCount = this.isMobile ? 700 : 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorGold = new THREE.Color(0xe5c07b);
    const colorWhite = new THREE.Color(0xa6b8c7);
    const colorDark = new THREE.Color(0x3a4252);

    for (let i = 0; i < particleCount; i++) {
      // Cylinder distribution along scroll height
      const radius = 3 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 45; // spans full vertical scroll path

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      // Color variation: 65% gold/amber dust, 35% ambient slate
      const pickColor = Math.random() > 0.35 ? colorGold : (Math.random() > 0.5 ? colorWhite : colorDark);
      colors[i * 3] = pickColor.r;
      colors[i * 3 + 1] = pickColor.g;
      colors[i * 3 + 2] = pickColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture generator (smooth circular glow)
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 220, 150, 0.8)');
    grad.addColorStop(0.8, 'rgba(229, 192, 123, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: this.isMobile ? 0.09 : 0.12,
      map: texture,
      transparent: true,
      vertexColors: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createFloatingShards() {
    this.shards = [];
    const shardCount = this.isMobile ? 8 : 16;
    const shardGeo = new THREE.TetrahedronGeometry(0.35, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x1a2130,
      emissive: 0x0e131d,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false
    });

    for (let i = 0; i < shardCount; i++) {
      const mesh = new THREE.Mesh(shardGeo, shardMat);
      const angle = (i / shardCount) * Math.PI * 2;
      const dist = 3.5 + Math.random() * 4;
      mesh.position.set(
        Math.cos(angle) * dist,
        -1 - (i * 2.2), // spread vertically down
        (Math.random() - 0.5) * 5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.scale.setScalar(0.6 + Math.random() * 0.8);
      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatOffset: Math.random() * 10
      };
      this.scene.add(mesh);
      this.shards.push(mesh);
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // Smooth mouse parallax
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Scroll progress tracking
    window.addEventListener('scroll', () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        this.targetScroll = window.scrollY / totalScroll;
      }
    }, { passive: true });
  }

  onResize() {
    this.isMobile = window.innerWidth < 768;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const maxPR = this.isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(maxPR);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Dampen mouse movement
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Dampen scroll progress
    this.scrollProgress += (this.targetScroll - this.scrollProgress) * 0.08;

    const time = performance.now() * 0.001;

    // 1. Continuous Sculpture Rotation
    if (this.sculptureGroup) {
      this.outerPoly.rotation.x = time * 0.25;
      this.outerPoly.rotation.y = time * 0.35;

      this.innerCore.rotation.x = -time * 0.4;
      this.innerCore.rotation.z = time * 0.3;

      this.ring1.rotation.z = time * 0.3;
      this.ring2.rotation.x = time * -0.25;

      // Position shifts and subtle breathing
      const breath = Math.sin(time * 1.5) * 0.08;
      this.sculptureGroup.scale.set(1 + breath, 1 + breath, 1 + breath);
    }

    // 2. Orbital Lights Movement
    if (this.mainLight) {
      this.mainLight.position.x = Math.sin(time * 0.7) * 4.5;
      this.mainLight.position.z = Math.cos(time * 0.7) * 4.5;
      this.mainLight.position.y = 2 + Math.sin(time) * 1.2;
    }

    // 3. Shards floating animation
    if (this.shards) {
      this.shards.forEach((shard) => {
        shard.rotation.x += shard.userData.rotSpeedX;
        shard.rotation.y += shard.userData.rotSpeedY;
        shard.position.y += Math.sin(time + shard.userData.floatOffset) * 0.003;
      });
    }

    // 4. Particles slow wave drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.02 + this.scrollProgress * 0.8;
    }

    // 5. Scroll-Triggered 3D Camera Path Transitions
    // Hero (0) -> Services (0.25) -> Pricing (0.50) -> Portfolio (0.75) -> Contact (1.0)
    const sp = this.scrollProgress;

    let targetCamX = 0;
    let targetCamY = 0;
    let targetCamZ = 7.5;
    let targetLookY = 0;
    let targetSculptX = 0;
    let targetSculptY = 0;

    if (sp <= 0.25) {
      // Transition from Hero to Services
      const t = sp / 0.25;
      targetCamX = THREE.MathUtils.lerp(0, 1.8, t);
      targetCamY = THREE.MathUtils.lerp(0, -3.2, t);
      targetCamZ = THREE.MathUtils.lerp(7.5, 6.8, t);
      targetLookY = THREE.MathUtils.lerp(0, -3.2, t);
      targetSculptX = THREE.MathUtils.lerp(0, -1.2, t);
      targetSculptY = THREE.MathUtils.lerp(0, -3.2, t);
    } else if (sp <= 0.50) {
      // Transition from Services to Pricing
      const t = (sp - 0.25) / 0.25;
      targetCamX = THREE.MathUtils.lerp(1.8, -1.6, t);
      targetCamY = THREE.MathUtils.lerp(-3.2, -7.5, t);
      targetCamZ = THREE.MathUtils.lerp(6.8, 8.5, t);
      targetLookY = THREE.MathUtils.lerp(-3.2, -7.5, t);
      targetSculptX = THREE.MathUtils.lerp(-1.2, 1.2, t);
      targetSculptY = THREE.MathUtils.lerp(-3.2, -7.5, t);
    } else if (sp <= 0.75) {
      // Transition from Pricing to Portfolio
      const t = (sp - 0.50) / 0.25;
      targetCamX = THREE.MathUtils.lerp(-1.6, 2.0, t);
      targetCamY = THREE.MathUtils.lerp(-7.5, -12.0, t);
      targetCamZ = THREE.MathUtils.lerp(8.5, 7.2, t);
      targetLookY = THREE.MathUtils.lerp(-7.5, -12.0, t);
      targetSculptX = THREE.MathUtils.lerp(1.2, -1.5, t);
      targetSculptY = THREE.MathUtils.lerp(-7.5, -12.0, t);
    } else {
      // Transition from Portfolio to Contact
      const t = (sp - 0.75) / 0.25;
      targetCamX = THREE.MathUtils.lerp(2.0, 0, t);
      targetCamY = THREE.MathUtils.lerp(-12.0, -16.5, t);
      targetCamZ = THREE.MathUtils.lerp(7.2, 6.2, t);
      targetLookY = THREE.MathUtils.lerp(-12.0, -16.5, t);
      targetSculptX = THREE.MathUtils.lerp(-1.5, 0, t);
      targetSculptY = THREE.MathUtils.lerp(-12.0, -16.5, t);
    }

    // Apply mouse parallax to camera
    const parallaxFactor = this.isMobile ? 0.3 : 0.8;
    this.camera.position.x += (targetCamX + this.mouse.x * parallaxFactor - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetCamY + this.mouse.y * parallaxFactor - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.06;

    this.cameraTarget.y += (targetLookY - this.cameraTarget.y) * 0.06;
    this.camera.lookAt(this.cameraTarget);

    if (this.sculptureGroup) {
      this.sculptureGroup.position.x += (targetSculptX - this.sculptureGroup.position.x) * 0.06;
      this.sculptureGroup.position.y += (targetSculptY - this.sculptureGroup.position.y) * 0.06;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.brevosScene = new BrevosScene();
  });
} else {
  window.brevosScene = new BrevosScene();
}
