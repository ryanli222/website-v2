"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, ContactShadows, Html, OrbitControls, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Box3, DirectionalLight, Mesh, Object3D, PerspectiveCamera, Vector3 } from "three";

interface ModelViewerProps {
  className?: string;
  modelPath?: string;
}

const INITIAL_MODEL_ROTATION: [number, number, number] = [1.57, 0.04, 0.04];

function Model({
  controlsRef,
  modelPath,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  modelPath: string;
}) {
  const { scene } = useGLTF(modelPath);
  const { camera, invalidate, size } = useThree();
  const modelSize = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const dimensions = box.getSize(new Vector3());

    return Math.max(dimensions.x, dimensions.y, dimensions.z, 1);
  }, [scene]);

  useLayoutEffect(() => {
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        const materials = Array.isArray(object.material)
          ? object.material.map((material) => material.clone())
          : object.material.clone();

        object.material = materials;
        object.castShadow = true;
        object.receiveShadow = true;

        const applyMaterialStyling = (material: (typeof materials extends Array<infer T> ? T : never) | typeof materials) => {
          if ("color" in material && material.color) {
            material.color.set("#686f7d");
          }

          if ("roughness" in material) {
            material.roughness = 0.72;
          }

          if ("metalness" in material) {
            material.metalness = 0.2;
          }

          if ("emissive" in material && material.emissive) {
            material.emissive.set("#0f1015");
            material.emissiveIntensity = 0.045;
          }
        };

        if (Array.isArray(materials)) {
          materials.forEach(applyMaterialStyling);
        } else {
          applyMaterialStyling(materials);
        }
      }
    });
  }, [scene]);

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) {
      return;
    }

    const controls = controlsRef.current as (OrbitControlsImpl & {
      maxTargetRadius?: number;
    }) | null;
    const fitHeightDistance = modelSize / (2 * Math.tan((Math.PI * camera.fov) / 360));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * 0.5;

    camera.position.set(modelSize * 0.02, modelSize * 0.17, distance);

    if (controls) {
      controls.target.set(modelSize * 0.05, modelSize * 0.34, 0);
      controls.minDistance = modelSize * 0.2;
      controls.maxDistance = modelSize * 4;
      controls.maxTargetRadius = modelSize * 0.75;
      controls.update();
    }

    invalidate();
  }, [camera, controlsRef, invalidate, modelSize, size.height, size.width]);

  return (
    <Center>
      <group rotation={INITIAL_MODEL_ROTATION}>
        <primitive object={scene} dispose={null} />
      </group>
    </Center>
  );
}

function CameraLinkedLight() {
  const { camera, scene } = useThree();
  const lightRef = useRef<DirectionalLight | null>(null);
  const targetRef = useRef<Object3D | null>(null);
  const offset = useMemo(() => new Vector3(0.34, 0.48, 0.88), []);

  useLayoutEffect(() => {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    scene.add(target);

    if (lightRef.current) {
      lightRef.current.target = target;
    }

    return () => {
      scene.remove(target);
    };
  }, [scene]);

  useFrame(() => {
    const light = lightRef.current;
    const target = targetRef.current;

    if (!light || !target) {
      return;
    }

    light.position.copy(camera.position).add(offset);
    target.position.set(0, 0, 0);
    target.updateMatrixWorld();
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        color="#fffaf2"
        intensity={1.45}
        position={[0, 0, 0]}
      />
      <object3D ref={targetRef} />
    </>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div
        className="rounded-full bg-white/85 px-3 py-1 text-[12px] text-[#666]"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        loading model...
      </div>
    </Html>
  );
}

export default function ModelViewer({
  className,
  modelPath = "/hand.glb",
}: ModelViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div
      className={`relative overflow-hidden rounded-[8px] bg-[#f9f9f8] ${className ?? ""}`}
      style={{ touchAction: "none" }}
    >
      <p
        className="pointer-events-none absolute left-4 top-4 z-10 text-[12px] text-[#777] md:left-5 md:top-5 md:text-[13px]"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        check out the CAD!
      </p>
      <Canvas
        camera={{ fov: 35, position: [0, 0, 5] }}
        className="h-full w-full"
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        shadows
      >
        <color attach="background" args={["#f9f9f8"]} />
        <ambientLight intensity={0.18} />
        <CameraLinkedLight />
        <directionalLight
          castShadow
          intensity={1.8}
          position={[-5, 4, -4]}
          shadow-bias={-0.0002}
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight
          color="#d5d9e3"
          intensity={1.2}
          position={[4.5, 6.5, -5.5]}
        />
        <spotLight
          angle={0.42}
          castShadow
          intensity={4.4}
          penumbra={1}
          position={[5, 7, 6]}
          shadow-bias={-0.00015}
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight
          angle={0.52}
          castShadow
          color="#cfc9bf"
          intensity={2.1}
          penumbra={1}
          position={[-4, 5, 5]}
          shadow-bias={-0.0002}
          shadow-mapSize={[2048, 2048]}
        />
        <spotLight
          angle={0.32}
          color="#f4f1ea"
          intensity={1.35}
          penumbra={0.9}
          position={[0.6, 3.8, 7.2]}
        />
        <ContactShadows
          blur={1.2}
          far={4.2}
          opacity={0.9}
          position={[0, -1.78, 0]}
          resolution={1024}
          scale={8.8}
        />
        <ContactShadows
          blur={3.6}
          far={7}
          opacity={0.54}
          position={[0, -1.86, 0]}
          resolution={1024}
          scale={13}
        />

        <Suspense fallback={<LoadingFallback />}>
          <Model controlsRef={controlsRef} modelPath={modelPath} />
        </Suspense>

        <OrbitControls
          enableDamping
          enablePan={false}
          makeDefault
          ref={controlsRef}
          panSpeed={0.8}
          target={[0, 0, 0]}
          zoomSpeed={0.9}
          zoomToCursor
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/hand.glb");
