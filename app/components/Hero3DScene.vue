<script setup lang="ts">
import { shallowRef, ref, onMounted, watch } from "vue";
import * as THREE from "three";

// 点击响应 - 八面体缩放效果
const { clickCount } = useHeroClick();
const octaScale = ref(1);

// 监听点击 - 八面体轻微放大后恢复
watch(clickCount, () => {
  octaScale.value = 1.3;
});

// 主粒子系统
const mainCount = 150;
const mainPositions = shallowRef(new Float32Array(mainCount * 3));
const mainColors = shallowRef(new Float32Array(mainCount * 3));
const mainSizes = shallowRef(new Float32Array(mainCount));
const mainPointsRef = shallowRef<any>(null);

// 连线系统
const linePositions = shallowRef(new Float32Array(0));
const lineColors = shallowRef(new Float32Array(0));

// 外层光环粒子
const ringCount = 100;
const ringPositions = shallowRef(new Float32Array(ringCount * 3));
const ringPointsRef = shallowRef<any>(null);

// 脉冲波
const pulseRings = ref<{ scale: number; opacity: number }[]>([]);

const pointTexture = shallowRef<THREE.CanvasTexture | null>(null);
const glowTexture = shallowRef<THREE.CanvasTexture | null>(null);

// 创建圆形纹理
function createCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

// 创建发光纹理
function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(96, 165, 250, 1)");
    gradient.addColorStop(0.2, "rgba(96, 165, 250, 0.5)");
    gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.2)");
    gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

// 存储节点位置用于连线
const nodePositions: THREE.Vector3[] = [];

onMounted(() => {
  // 初始化主粒子
  const pos = new Float32Array(mainCount * 3);
  const col = new Float32Array(mainCount * 3);
  const sizes = new Float32Array(mainCount);
  
  for (let i = 0; i < mainCount; i++) {
    // 球形分布
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 2;
    
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    
    nodePositions.push(new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
    
    // 渐变颜色 (蓝色到紫色)
    const t = Math.random();
    col[i * 3] = 0.37 + t * 0.17;     // R
    col[i * 3 + 1] = 0.65 - t * 0.29; // G
    col[i * 3 + 2] = 0.98;            // B
    
    sizes[i] = 0.08 + Math.random() * 0.12;
  }
  
  mainPositions.value = pos;
  mainColors.value = col;
  mainSizes.value = sizes;
  
  // 创建连线
  createConnections();
  
  // 初始化光环粒子
  const ringPos = new Float32Array(ringCount * 3);
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2;
    const r = 6 + Math.sin(angle * 3) * 0.5;
    ringPos[i * 3] = Math.cos(angle) * r;
    ringPos[i * 3 + 1] = Math.sin(angle) * r;
    ringPos[i * 3 + 2] = 0;
  }
  ringPositions.value = ringPos;
  
  pointTexture.value = createCircleTexture();
  glowTexture.value = createGlowTexture();
  
  // 初始化脉冲波
  pulseRings.value = [
    { scale: 1, opacity: 0.5 },
    { scale: 1.5, opacity: 0.3 },
    { scale: 2, opacity: 0.1 },
  ];
});

// 创建节点间的连线
function createConnections() {
  const lines: number[] = [];
  const colors: number[] = [];
  const maxDist = 2.5;
  
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      const dist = nodePositions[i].distanceTo(nodePositions[j]);
      if (dist < maxDist) {
        lines.push(
          nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
          nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
        );
        // 根据距离设置透明度
        const alpha = 1 - dist / maxDist;
        colors.push(0.37, 0.65, 0.98, 0.37, 0.65, 0.98);
      }
    }
  }
  
  linePositions.value = new Float32Array(lines);
  lineColors.value = new Float32Array(colors);
}

const time = ref(0);
const scanAngle = ref(0);

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta }) => {
  time.value += delta;
  
  // 扫描线旋转
  scanAngle.value += delta * 1.5;
  
  // 主粒子旋转
  if (mainPointsRef.value) {
    mainPointsRef.value.rotation.y += delta * 0.1;
    mainPointsRef.value.rotation.x = Math.sin(time.value * 0.3) * 0.1;
  }
  
  // 光环旋转
  if (ringPointsRef.value) {
    ringPointsRef.value.rotation.z += delta * 0.2;
    ringPointsRef.value.rotation.x = Math.PI / 2 + Math.sin(time.value * 0.5) * 0.1;
  }
  
  // 更新八面体点击效果 - 缓慢恢复
  if (octaScale.value > 1) {
    octaScale.value -= delta * 1.5;
    if (octaScale.value < 1) octaScale.value = 1;
  }
  
  // 更新脉冲波
  pulseRings.value = pulseRings.value.map((ring) => {
    let newScale = ring.scale + delta * 0.5;
    let newOpacity = ring.opacity - delta * 0.15;
    
    if (newOpacity <= 0) {
      newScale = 1;
      newOpacity = 0.5;
    }
    
    return { scale: newScale, opacity: Math.max(0, newOpacity) };
  });
});
</script>

<template>
  <TresGroup>
    <!-- 主粒子系统 -->
    <TresPoints ref="mainPointsRef">
      <TresBufferGeometry>
        <TresBufferAttribute
          attach="attributes-position"
          :count="mainCount"
          :array="mainPositions"
          :item-size="3"
        />
        <TresBufferAttribute
          attach="attributes-color"
          :count="mainCount"
          :array="mainColors"
          :item-size="3"
        />
      </TresBufferGeometry>
      <TresPointsMaterial
        v-if="glowTexture"
        transparent
        vertex-colors
        :size="0.3"
        :size-attenuation="true"
        :depth-write="false"
        :opacity="0.9"
        :map="glowTexture"
        :blending="2"
      />
    </TresPoints>
    
    <!-- 连线网络 -->
    <TresLineSegments v-if="linePositions.length > 0">
      <TresBufferGeometry>
        <TresBufferAttribute
          attach="attributes-position"
          :count="linePositions.length / 3"
          :array="linePositions"
          :item-size="3"
        />
      </TresBufferGeometry>
      <TresLineBasicMaterial
        transparent
        color="#60a5fa"
        :opacity="0.15"
        :depth-write="false"
      />
    </TresLineSegments>
    
    <!-- 外层光环 -->
    <TresPoints ref="ringPointsRef">
      <TresBufferGeometry>
        <TresBufferAttribute
          attach="attributes-position"
          :count="ringCount"
          :array="ringPositions"
          :item-size="3"
        />
      </TresBufferGeometry>
      <TresPointsMaterial
        v-if="pointTexture"
        transparent
        color="#a78bfa"
        :size="0.1"
        :size-attenuation="true"
        :depth-write="false"
        :opacity="0.6"
        :map="pointTexture"
      />
    </TresPoints>
    
    <!-- 脉冲波环 -->
    <TresMesh
      v-for="(ring, idx) in pulseRings"
      :key="idx"
      :rotation="[Math.PI / 2, 0, 0]"
      :scale="[ring.scale * 3, ring.scale * 3, 1]"
    >
      <TresRingGeometry :args="[0.95, 1, 64]" />
      <TresMeshBasicMaterial
        transparent
        color="#60a5fa"
        :opacity="ring.opacity"
        :side="2"
      />
    </TresMesh>
    
    <!-- 扫描线效果 -->
    <TresMesh :rotation="[Math.PI / 2, 0, scanAngle]">
      <TresPlaneGeometry :args="[0.1, 8]" />
      <TresMeshBasicMaterial
        transparent
        color="#22d3ee"
        :opacity="0.6"
        :side="2"
      />
    </TresMesh>
    <!-- 扫描扇形区域 -->
    <TresMesh :rotation="[Math.PI / 2, 0, scanAngle]">
      <TresCircleGeometry :args="[4, 32, 0, 0.3]" />
      <TresMeshBasicMaterial
        transparent
        color="#22d3ee"
        :opacity="0.15"
        :side="2"
      />
    </TresMesh>
    
    <!-- 右上角旋转八面体 - 点击时轻微放大 -->
    <!-- <TresGroup :position="[5, 2, 0]">
      <TresMesh 
        :rotation="[time * 0.5, time * 0.3, 0]" 
        :scale="[0.5 * octaScale, 0.5 * octaScale, 0.5 * octaScale]"
      >
        <TresOctahedronGeometry :args="[1, 0]" />
        <TresMeshBasicMaterial
          transparent
          color="#60a5fa"
          :opacity="0.6"
          wireframe
        />
      </TresMesh>
      <TresMesh 
        :rotation="[time * -0.3, time * 0.5, 0]" 
        :scale="[0.3 * octaScale, 0.3 * octaScale, 0.3 * octaScale]"
      >
        <TresOctahedronGeometry :args="[1, 0]" />
        <TresMeshBasicMaterial color="#a78bfa" />
      </TresMesh>
    </TresGroup> -->
  </TresGroup>
</template>
