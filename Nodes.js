// @TODO: We can simplify "export { default as SomeNode, other, exports } from '...'" to just "export * from '...'" if we will use only named exports
// this will also solve issues like "import TempNode from '../core/Node.js'"

// constants
export * from './node_modules/three/examples/jsm/nodes/core/constants.js';

// core
export { default as ArrayUniformNode /* @TODO: arrayUniform */ } from './node_modules/three/examples/jsm/nodes/core/ArrayUniformNode.js';
export { default as AssignNode, assign } from './node_modules/three/examples/jsm/nodes/core/AssignNode.js';
export { default as AttributeNode, attribute } from './node_modules/three/examples/jsm/nodes/core/AttributeNode.js';
export { default as BypassNode, bypass } from './node_modules/three/examples/jsm/nodes/core/BypassNode.js';
export { default as CacheNode, cache } from './node_modules/three/examples/jsm/nodes/core/CacheNode.js';
export { default as ConstNode } from './node_modules/three/examples/jsm/nodes/core/ConstNode.js';
export { default as ContextNode, context, label } from './node_modules/three/examples/jsm/nodes/core/ContextNode.js';
export { default as IndexNode, vertexIndex, instanceIndex } from './node_modules/three/examples/jsm/nodes/core/IndexNode.js';
export { default as LightingModel } from './node_modules/three/examples/jsm/nodes/core/LightingModel.js';
export { default as Node, addNodeClass, createNodeFromType } from './node_modules/three/examples/jsm/nodes/core/Node.js';
export { default as VarNode, temp } from './node_modules/three/examples/jsm/nodes/core/VarNode.js';
export { default as NodeAttribute } from './node_modules/three/examples/jsm/nodes/core/NodeAttribute.js';
export { default as NodeBuilder } from './node_modules/three/examples/jsm/nodes/core/NodeBuilder.js';
export { default as NodeCache } from './node_modules/three/examples/jsm/nodes/core/NodeCache.js';
export { default as NodeCode } from './node_modules/three/examples/jsm/nodes/core/NodeCode.js';
export { default as NodeFrame } from './node_modules/three/examples/jsm/nodes/core/NodeFrame.js';
export { default as NodeFunctionInput } from './node_modules/three/examples/jsm/nodes/core/NodeFunctionInput.js';
export { default as NodeKeywords } from './node_modules/three/examples/jsm/nodes/core/NodeKeywords.js';
export { default as NodeUniform } from './node_modules/three/examples/jsm/nodes/core/NodeUniform.js';
export { default as NodeVar } from './node_modules/three/examples/jsm/nodes/core/NodeVar.js';
export { default as NodeVarying } from './node_modules/three/examples/jsm/nodes/core/NodeVarying.js';
export { default as ParameterNode, parameter } from './node_modules/three/examples/jsm/nodes/core/ParameterNode.js';
export { default as PropertyNode, property, varyingProperty, output, diffuseColor, roughness, metalness, clearcoat, clearcoatRoughness, sheen, sheenRoughness, iridescence, iridescenceIOR, iridescenceThickness, specularColor, shininess, dashSize, gapSize, pointWidth } from './node_modules/three/examples/jsm/nodes/core/PropertyNode.js';
export { default as StackNode, stack } from './node_modules/three/examples/jsm/nodes/core/StackNode.js';
export { default as TempNode } from './node_modules/three/examples/jsm/nodes/core/TempNode.js';
export { default as UniformGroupNode, uniformGroup, objectGroup, renderGroup, frameGroup } from './node_modules/three/examples/jsm/nodes/core/UniformGroupNode.js';
export { default as UniformNode, uniform } from './node_modules/three/examples/jsm/nodes/core/UniformNode.js';
export { default as VaryingNode, varying } from './node_modules/three/examples/jsm/nodes/core/VaryingNode.js';
export { default as OutputStructNode, outputStruct } from './node_modules/three/examples/jsm/nodes/core/OutputStructNode.js';

import * as NodeUtils from './node_modules/three/examples/jsm/nodes/core/NodeUtils.js';
export { NodeUtils };

// math
export { default as MathNode, EPSILON, INFINITY, radians, degrees, exp, exp2, log, log2, sqrt, inverseSqrt, floor, ceil, normalize, fract, sin, cos, tan, asin, acos, atan, abs, sign, length, negate, oneMinus, dFdx, dFdy, round, reciprocal, trunc, fwidth, atan2, min, max, mod, step, reflect, distance, difference, dot, cross, pow, pow2, pow3, pow4, transformDirection, mix, clamp, saturate, refract, smoothstep, faceForward } from './node_modules/three/examples/jsm/nodes/math/MathNode.js';
export { default as OperatorNode, add, sub, mul, div, remainder, equal, lessThan, greaterThan, lessThanEqual, greaterThanEqual, and, or, xor, bitAnd, bitOr, bitXor, shiftLeft, shiftRight } from './node_modules/three/examples/jsm/nodes/math/OperatorNode.js';
export { default as CondNode, cond } from './node_modules/three/examples/jsm/nodes/math/CondNode.js';
export { default as HashNode, hash } from './node_modules/three/examples/jsm/nodes/math/HashNode.js';

// utils
export { default as ArrayElementNode } from './node_modules/three/examples/jsm/nodes/utils/ArrayElementNode.js';
export { default as ConvertNode } from './node_modules/three/examples/jsm/nodes/utils/ConvertNode.js';
export { default as DiscardNode, discard } from './node_modules/three/examples/jsm/nodes/utils/DiscardNode.js';
export { default as EquirectUVNode, equirectUV } from './node_modules/three/examples/jsm/nodes/utils/EquirectUVNode.js';
export { default as JoinNode } from './node_modules/three/examples/jsm/nodes/utils/JoinNode.js';
export { default as LoopNode, loop } from './node_modules/three/examples/jsm/nodes/utils/LoopNode.js';
export { default as MatcapUVNode, matcapUV } from './node_modules/three/examples/jsm/nodes/utils/MatcapUVNode.js';
export { default as MaxMipLevelNode, maxMipLevel } from './node_modules/three/examples/jsm/nodes/utils/MaxMipLevelNode.js';
export { default as OscNode, oscSine, oscSquare, oscTriangle, oscSawtooth } from './node_modules/three/examples/jsm/nodes/utils/OscNode.js';
export { default as PackingNode, directionToColor, colorToDirection } from './node_modules/three/examples/jsm/nodes/utils/PackingNode.js';
export { default as RemapNode, remap, remapClamp } from './node_modules/three/examples/jsm/nodes/utils/RemapNode.js';
export { default as RotateUVNode, rotateUV } from './node_modules/three/examples/jsm/nodes/utils/RotateUVNode.js';
export { default as SetNode } from './node_modules/three/examples/jsm/nodes/utils/SetNode.js';
export { default as SpecularMIPLevelNode, specularMIPLevel } from './node_modules/three/examples/jsm/nodes/utils/SpecularMIPLevelNode.js';
export { default as SplitNode } from './node_modules/three/examples/jsm/nodes/utils/SplitNode.js';
export { default as SpriteSheetUVNode, spritesheetUV } from './node_modules/three/examples/jsm/nodes/utils/SpriteSheetUVNode.js';
export { default as TimerNode, timerLocal, timerGlobal, timerDelta, frameId } from './node_modules/three/examples/jsm/nodes/utils/TimerNode.js';
export { default as TriplanarTexturesNode, triplanarTextures, triplanarTexture } from './node_modules/three/examples/jsm/nodes/utils/TriplanarTexturesNode.js';

// shadernode
export * from './node_modules/three/examples/jsm/nodes/shadernode/ShaderNode.js';

// accessors
export { default as BitangentNode, bitangentGeometry, bitangentLocal, bitangentView, bitangentWorld, transformedBitangentView, transformedBitangentWorld } from './node_modules/three/examples/jsm/nodes/accessors/BitangentNode.js';
export { default as BufferAttributeNode, bufferAttribute, dynamicBufferAttribute, instancedBufferAttribute, instancedDynamicBufferAttribute } from './node_modules/three/examples/jsm/nodes/accessors/BufferAttributeNode.js';
export { default as BufferNode, buffer } from './node_modules/three/examples/jsm/nodes/accessors/BufferNode.js';
export { default as CameraNode, cameraProjectionMatrix, cameraViewMatrix, cameraNormalMatrix, cameraWorldMatrix, cameraPosition, cameraNear, cameraFar, cameraLogDepth } from './node_modules/three/examples/jsm/nodes/accessors/CameraNode.js';
export { default as CubeTextureNode, cubeTexture } from './node_modules/three/examples/jsm/nodes/accessors/CubeTextureNode.js';
export { default as InstanceNode, instance } from './node_modules/three/examples/jsm/nodes/accessors/InstanceNode.js';
export { default as MaterialNode, materialAlphaTest, materialColor, materialShininess, materialEmissive, materialOpacity, materialSpecularColor, materialSpecularStrength, materialReflectivity, materialRoughness, materialMetalness, materialNormal, materialClearcoat, materialClearcoatRoughness, materialClearcoatNormal, materialRotation, materialSheen, materialSheenRoughness, materialIridescence, materialIridescenceIOR, materialIridescenceThickness, materialLineScale, materialLineDashSize, materialLineGapSize, materialLineWidth, materialLineDashOffset, materialPointWidth } from './node_modules/three/examples/jsm/nodes/accessors/MaterialNode.js';
export { default as MaterialReferenceNode, materialReference } from './node_modules/three/examples/jsm/nodes/accessors/MaterialReferenceNode.js';
export { default as MorphNode, morph } from './node_modules/three/examples/jsm/nodes/accessors/MorphNode.js';
export { default as TextureBicubicNode, textureBicubic } from './node_modules/three/examples/jsm/nodes/accessors/TextureBicubicNode.js';
export { default as ModelNode, modelDirection, modelViewMatrix, modelNormalMatrix, modelWorldMatrix, modelPosition, modelViewPosition, modelScale } from './node_modules/three/examples/jsm/nodes/accessors/ModelNode.js';
export { default as ModelViewProjectionNode, modelViewProjection } from './node_modules/three/examples/jsm/nodes/accessors/ModelViewProjectionNode.js';
export { default as NormalNode, normalGeometry, normalLocal, normalView, normalWorld, transformedNormalView, transformedNormalWorld, transformedClearcoatNormalView } from './node_modules/three/examples/jsm/nodes/accessors/NormalNode.js';
export { default as Object3DNode, objectDirection, objectViewMatrix, objectNormalMatrix, objectWorldMatrix, objectPosition, objectScale, objectViewPosition } from './node_modules/three/examples/jsm/nodes/accessors/Object3DNode.js';
export { default as PointUVNode, pointUV } from './node_modules/three/examples/jsm/nodes/accessors/PointUVNode.js';
export { default as PositionNode, positionGeometry, positionLocal, positionWorld, positionWorldDirection, positionView, positionViewDirection } from './node_modules/three/examples/jsm/nodes/accessors/PositionNode.js';
export { default as ReferenceNode, reference, referenceIndex } from './node_modules/three/examples/jsm/nodes/accessors/ReferenceNode.js';
export { default as ReflectVectorNode, reflectVector } from './node_modules/three/examples/jsm/nodes/accessors/ReflectVectorNode.js';
export { default as SkinningNode, skinning } from './node_modules/three/examples/jsm/nodes/accessors/SkinningNode.js';
export { default as SceneNode, backgroundBlurriness, backgroundIntensity } from './node_modules/three/examples/jsm/nodes/accessors/SceneNode.js';
export { default as StorageBufferNode, storage } from './node_modules/three/examples/jsm/nodes/accessors/StorageBufferNode.js';
export { default as TangentNode, tangentGeometry, tangentLocal, tangentView, tangentWorld, transformedTangentView, transformedTangentWorld } from './node_modules/three/examples/jsm/nodes/accessors/TangentNode.js';
export { default as TextureNode, texture, textureLoad, /*textureLevel,*/ sampler } from './node_modules/three/examples/jsm/nodes/accessors/TextureNode.js';
export { default as TextureStoreNode, textureStore } from './node_modules/three/examples/jsm/nodes/accessors/TextureStoreNode.js';
export { default as UVNode, uv } from './node_modules/three/examples/jsm/nodes/accessors/UVNode.js';
export { default as UserDataNode, userData } from './node_modules/three/examples/jsm/nodes/accessors/UserDataNode.js';

// display
export { default as BlendModeNode, burn, dodge, overlay, screen } from './node_modules/three/examples/jsm/nodes/display/BlendModeNode.js';
export { default as BumpMapNode, bumpMap } from './node_modules/three/examples/jsm/nodes/display/BumpMapNode.js';
export { default as ColorAdjustmentNode, saturation, vibrance, hue, lumaCoeffs, luminance } from './node_modules/three/examples/jsm/nodes/display/ColorAdjustmentNode.js';
export { default as ColorSpaceNode, linearToColorSpace, colorSpaceToLinear, linearTosRGB, sRGBToLinear } from './node_modules/three/examples/jsm/nodes/display/ColorSpaceNode.js';
export { default as FrontFacingNode, frontFacing, faceDirection } from './node_modules/three/examples/jsm/nodes/display/FrontFacingNode.js';
export { default as NormalMapNode, normalMap, TBNViewMatrix } from './node_modules/three/examples/jsm/nodes/display/NormalMapNode.js';
export { default as PosterizeNode, posterize } from './node_modules/three/examples/jsm/nodes/display/PosterizeNode.js';
export { default as ToneMappingNode, toneMapping } from './node_modules/three/examples/jsm/nodes/display/ToneMappingNode.js';
export { default as ViewportNode, viewport, viewportCoordinate, viewportResolution, viewportTopLeft, viewportBottomLeft, viewportTopRight, viewportBottomRight } from './node_modules/three/examples/jsm/nodes/display/ViewportNode.js';
export { default as ViewportTextureNode, viewportTexture, viewportMipTexture } from './node_modules/three/examples/jsm/nodes/display/ViewportTextureNode.js';
export { default as ViewportSharedTextureNode, viewportSharedTexture } from './node_modules/three/examples/jsm/nodes/display/ViewportSharedTextureNode.js';
export { default as ViewportDepthTextureNode, viewportDepthTexture } from './node_modules/three/examples/jsm/nodes/display/ViewportDepthTextureNode.js';
export { default as ViewportDepthNode, viewZToOrthographicDepth, orthographicDepthToViewZ, viewZToPerspectiveDepth, perspectiveDepthToViewZ, depth, depthTexture, depthPixel } from './node_modules/three/examples/jsm/nodes/display/ViewportDepthNode.js';

// code
export { default as ExpressionNode, expression } from './node_modules/three/examples/jsm/nodes/code/ExpressionNode.js';
export { default as CodeNode, code, js, wgsl, glsl } from './node_modules/three/examples/jsm/nodes/code/CodeNode.js';
export { default as FunctionCallNode, call } from './node_modules/three/examples/jsm/nodes/code/FunctionCallNode.js';
export { default as FunctionNode, wgslFn, glslFn } from './node_modules/three/examples/jsm/nodes/code/FunctionNode.js';
export { default as ScriptableNode, scriptable, global } from './node_modules/three/examples/jsm/nodes/code/ScriptableNode.js';
export { default as ScriptableValueNode, scriptableValue } from './node_modules/three/examples/jsm/nodes/code/ScriptableValueNode.js';

// fog
export { default as FogNode, fog } from './node_modules/three/examples/jsm/nodes/fog/FogNode.js';
export { default as FogRangeNode, rangeFog } from './node_modules/three/examples/jsm/nodes/fog/FogRangeNode.js';
export { default as FogExp2Node, densityFog } from './node_modules/three/examples/jsm/nodes/fog/FogExp2Node.js';

// geometry
export { default as RangeNode, range } from './node_modules/three/examples/jsm/nodes/geometry/RangeNode.js';

// gpgpu
export { default as ComputeNode, compute } from './node_modules/three/examples/jsm/nodes/gpgpu/ComputeNode.js';

// lighting
export { default as LightNode, lightTargetDirection } from './node_modules/three/examples/jsm/nodes/lighting/LightNode.js';
export { default as PointLightNode } from './node_modules/three/examples/jsm/nodes/lighting/PointLightNode.js';
export { default as DirectionalLightNode } from './node_modules/three/examples/jsm/nodes/lighting/DirectionalLightNode.js';
export { default as SpotLightNode } from './node_modules/three/examples/jsm/nodes/lighting/SpotLightNode.js';
export { default as IESSpotLightNode } from './node_modules/three/examples/jsm/nodes/lighting/IESSpotLightNode.js';
export { default as AmbientLightNode } from './node_modules/three/examples/jsm/nodes/lighting/AmbientLightNode.js';
export { default as LightsNode, lights, lightNodes, addLightNode } from './node_modules/three/examples/jsm/nodes/lighting/LightsNode.js';
export { default as LightingNode /* @TODO: lighting (abstract), light */ } from './node_modules/three/examples/jsm/nodes/lighting/LightingNode.js';
export { default as LightingContextNode, lightingContext } from './node_modules/three/examples/jsm/nodes/lighting/LightingContextNode.js';
export { default as HemisphereLightNode } from './node_modules/three/examples/jsm/nodes/lighting/HemisphereLightNode.js';
export { default as EnvironmentNode } from './node_modules/three/examples/jsm/nodes/lighting/EnvironmentNode.js';
export { default as AONode } from './node_modules/three/examples/jsm/nodes/lighting/AONode.js';
export { default as AnalyticLightNode } from './node_modules/three/examples/jsm/nodes/lighting/AnalyticLightNode.js';

// procedural
export { default as CheckerNode, checker } from './node_modules/three/examples/jsm/nodes/procedural/CheckerNode.js';

// loaders
export { default as NodeLoader } from './node_modules/three/examples/jsm/nodes/loaders/NodeLoader.js';
export { default as NodeObjectLoader } from './node_modules/three/examples/jsm/nodes/loaders/NodeObjectLoader.js';
export { default as NodeMaterialLoader } from './node_modules/three/examples/jsm/nodes/loaders/NodeMaterialLoader.js';

// parsers
export { default as GLSLNodeParser } from './node_modules/three/examples/jsm/nodes/parsers/GLSLNodeParser.js'; // @TODO: Move to jsm/renderers/webgl.

// materials
export * from './node_modules/three/examples/jsm/nodes/materials/Materials.js';

// materialX
export * from './node_modules/three/examples/jsm/nodes/materialx/MaterialXNodes.js';

// functions
export { default as BRDF_GGX } from './node_modules/three/examples/jsm/nodes/functions/BSDF/BRDF_GGX.js';
export { default as BRDF_Lambert } from './node_modules/three/examples/jsm/nodes/functions/BSDF/BRDF_Lambert.js';
export { default as D_GGX } from './node_modules/three/examples/jsm/nodes/functions/BSDF/D_GGX.js';
export { default as DFGApprox } from './node_modules/three/examples/jsm/nodes/functions/BSDF/DFGApprox.js';
export { default as F_Schlick } from './node_modules/three/examples/jsm/nodes/functions/BSDF/F_Schlick.js';
export { default as Schlick_to_F0 } from './node_modules/three/examples/jsm/nodes/functions/BSDF/Schlick_to_F0.js';
export { default as V_GGX_SmithCorrelated } from './node_modules/three/examples/jsm/nodes/functions/BSDF/V_GGX_SmithCorrelated.js';

export { getDistanceAttenuation } from './node_modules/three/examples/jsm/nodes/lighting/LightUtils.js';

export { default as getGeometryRoughness } from './node_modules/three/examples/jsm/nodes/functions/material/getGeometryRoughness.js';
export { default as getRoughness } from './node_modules/three/examples/jsm/nodes/functions/material/getRoughness.js';

export { default as PhongLightingModel } from './node_modules/three/examples/jsm/nodes/functions/PhongLightingModel.js';
export { default as PhysicalLightingModel } from './node_modules/three/examples/jsm/nodes/functions/PhysicalLightingModel.js';
