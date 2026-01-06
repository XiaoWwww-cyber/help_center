<script setup lang="ts">
import { shallowRef, ref, onMounted } from "vue";
import * as THREE from "three";

const mainCount = 100;
const mainPositions = shallowRef(new Float32Array(mainCount * 3));
const mainColors = shallowRef(new Float32Array(mainCount * 3));
const mainPointsRef = shallowRef<any>(null);

const ringCount = 60;
const ringPositions = shallowRef(new Float32Array(ringCount * 3));
const ringPointsRef = shallowRef<any>(null);

const pointTexture = shallowRef<THREE.CanvasTexture | null>(null);

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

onMounted(() => {
  const pos = new Float32Array(mainCount * 3);
  const col = new Float32Array(mainCount * 3);

  for (let i = 0; i < mainCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 2;

    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    const t = Math.random();
    col[i * 3] = 0.37 + t * 0.17;
    col[i * 3 + 1] = 0.65 - t * 0.29;
    col[i * 3 + 2] = 0.98;
  }

  mainPositions.value = pos;
  mainColors.value = col;

  const ringPos = new Float32Array(ringCount * 3);
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2;
    const r = 6;
    ringPos[i * 3] = Math.cos(angle) * r;
    ringPos[i * 3 + 1] = Math.sin(angle) * r;
    ringPos[i * 3 + 2] = 0;
  }
  ringPositions.value = ringPos;

  pointTexture.value = createCircleTexture();
});

const time = ref(0);

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta }) => {
  time.value += delta;

  if (mainPointsRef.value) {
    mainPointsRef.value.rotation.y += delta * 0.1;
  }

  if (ringPointsRef.value) {
    ringPointsRef.value.rotation.z += delta * 0.15;
    ringPointsRef.value.rotation.x = Math.PI / 2;
  }
});
</script>

<template>
  <TresGroup>
    <!-- 主粒子 -->
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
        v-if="pointTexture"
        transparent
        vertex-colors
        :size="0.25"
        :size-attenuation="true"
        :depth-write="false"
        :opacity="0.8"
        :map="pointTexture"
        :blending="2"
      />
    </TresPoints>

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
        :size="0.08"
        :size-attenuation="true"
        :depth-write="false"
        :opacity="0.5"
        :map="pointTexture"
      />
    </TresPoints>
  </TresGroup>
</template>
