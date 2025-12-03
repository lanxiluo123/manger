import {
  BoundingSphere,
  CallbackProperty,
  Cartesian2,
  CesiumTerrainProvider,
  Color,
  FeatureDetection,
  HeadingPitchRange,
  Ion,
  sampleTerrainMostDetailed,
  ScreenSpaceEventType,
  Terrain,
  VerticalOrigin,
  Viewer,
  Math as CesiumMath,
  UrlTemplateImageryProvider,
  WebMercatorTilingScheme,
  Cartesian3,
  PolylineDashMaterialProperty,
  Cartographic,
  BillboardCollection,
  LabelCollection,
  HorizontalOrigin,
  PolylineCollection,
  Material,
  LabelStyle,
  SampledPositionProperty,
  JulianDate,
  TimeIntervalCollection,
  TimeInterval,
  ClockRange,
  BlendOption,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import * as Cesium from 'cesium'
// import { CESIUM_TOKEN, TD_URL, TD_TOKEN, TD_SUBDOMAINS } from '@config';
// import { ellipsoidToEgm96 } from 'egm96-universal';

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNGNlYzc3NC0wNjA0LTRjNGQtOGQxNC1lYTljMGFkNjVhNDQiLCJpZCI6MjMwMTEwLCJpYXQiOjE3MjE3MTQ0Njh9.YanfBrz7ppwPa3LFXP4_wnpYWDirNjK_PzN5ejfTJjo';

export async function getTerrainUrl(terrainUrl) {
  if (terrainUrl) return terrainUrl;
  try {
    const { data: [{ url = '' } = {}] = [] } = await manageMapResourceListApi({
      type: 'TERRAIN',
    });

    if (url) return url;
  } catch (error) { }
  return;
}
export async function getBaseImageUrl() {
  const params = {
    imgs: null,
    cias: null,
  };
  try {
    const [{ data: imgData = [] }, { data: ciaData = [] }] = await Promise.all([
      manageMapResourceListApi({
        type: 'IMG_W',
      }),
      manageMapResourceListApi({
        type: 'CIA_W',
      }),
    ]);

    params.imgs = Array.isArray(imgData) && imgData.length !== 0 ? imgData : null;
    params.cias = Array.isArray(ciaData) && ciaData.length !== 0 ? ciaData : null;
  } catch (error) { }

  return params;
}
async function _drawBaseImage(viewer, { url, subdomains, maximumLevel = 18 } = {}) {
  if (!url) return;
  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      url,
      subdomains,
      maximumLevel,
      tilingScheme: new WebMercatorTilingScheme(),
    }),
  );
}
async function _addBaseImage(viewer, baseImages) {
  if (
    Array.isArray(baseImages) &&
    baseImages.length === 0 &&
    baseImages.every((item) => item?.url)
  ) {
    baseImages.forEach((item) => _drawBaseImage(viewer, item));
    return;
  }
  const { imgs, cias } = await getBaseImageUrl();

  // 基础影像
  if (Array.isArray(imgs) && imgs.length !== 0 && imgs.every((item) => item?.url)) {
    imgs.forEach((item) => _drawBaseImage(viewer, item));
  } else {
    _drawBaseImage(viewer, {
      url: `${TD_URL}/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${TD_TOKEN}`,
      subdomains: TD_SUBDOMAINS,
    });
  }
  // 注解影像
  if (Array.isArray(cias) && cias.length !== 0 && cias.every((item) => item?.url)) {
    cias.forEach((item) => _drawBaseImage(viewer, item));
  } else {
    _drawBaseImage(viewer, {
      url: `${TD_URL}/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${TD_TOKEN}`,
      subdomains: TD_SUBDOMAINS,
    });
    _drawBaseImage(viewer, {
      url: `${TD_URL}/DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=${TD_TOKEN}`,
      subdomains: TD_SUBDOMAINS,
    });
  }
}
function _waiting(viewer) {
  return new Promise((resolve) => {
    viewer.scene.globe.tileLoadProgressEvent.addEventListener((tilesLoading) => {
      if (tilesLoading === 0) resolve(viewer);
    });
  });
}
export async function createViewer(
  el = null,
  { terrainUrl = '', baseImages, isAddBaseImages = true, ...options } = {},
) {
  if (!el) return;
  // const url = await getTerrainUrl(terrainUrl);
  const viewer = new Viewer(el, {
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    homeButton: false,
    fullscreenButton: false,
    vrButton: false,
    infoBox: false,
    selectionIndicator: false,
    skyBox: false,
    skyAtmosphere: false,
    terrain: Cesium.Terrain.fromWorldTerrain(),
    scene3DOnly: true,
    // imageryProvider: new Cesium.TileMapServiceImageryProvider({
    //   url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
    // }),
    ...options,
  });

  viewer._cesiumWidget._creditContainer.style.display = 'none';
  viewer.scene.globe.depthTestAgainstTerrain = false;
  FeatureDetection.supportsImageRenderingPixelated() &&
    (viewer.resolutionScale = window.devicePixelRatio);
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  );
  // if (isAddBaseImages) await _drawBaseImage(viewer, baseImages);
  // await _waiting(viewer);
  positionFromPoints(viewer, [Cartesian3.fromDegrees(104.117262, 30.598726, 18000)], {
    duration: 3,
  });
  return viewer;
}
export function disposeViewer(viewer) {
  viewer?.entities?.removeAll?.();
  viewer?.dataSources?.removeAll?.();
  viewer?.imageryLayers?.removeAll?.();
  viewer?.destroy?.();
  viewer = null;
}
let tempBoundingSphere;
export function positionFromBoundingSphere(viewer, boundingSphere, duration = 0.3) {
  return new Promise((resolve) => {
    if (!viewer || !boundingSphere) {
      resolve(false);
      return;
    }

    tempBoundingSphere = boundingSphere;
    viewer.camera.flyToBoundingSphere(boundingSphere, {
      duration,
      offset: new HeadingPitchRange(0, CesiumMath.toRadians(-90.0), 0),
      complete: () => {
        resolve(true);
      },
      cancel: () => {
        resolve(false);
      },
    });
  });
}
export function positionFromEntity(viewer, entitie) {
  if (!viewer || !entitie) return;

  const boundingSphere = new BoundingSphere();

  if (!boundingSphere) return;
  viewer.dataSourceDisplay.getBoundingSphere(entitie, false, boundingSphere);
  positionFromBoundingSphere(
    viewer,
    new BoundingSphere(boundingSphere.center, Math.max(boundingSphere.radius, 10)),
  );
}
export function positionFromPoints(
  viewer,
  positions,
  { minRadius = 300, offsetRadius = 0, duration = 0.3 } = {},
) {
  if (!viewer || !Array.isArray(positions) || positions.length === 0) return;

  const boundingSphere = BoundingSphere.fromPoints(positions);
  if (!boundingSphere) return;
  return positionFromBoundingSphere(
    viewer,
    new BoundingSphere(
      boundingSphere.center,
      Math.max(boundingSphere.radius + offsetRadius, minRadius),
    ),
    duration,
  );
}
export async function getHeights(terrainProvider, positions) {
  if (!terrainProvider || !Array.isArray(positions) || positions.length === 0) {
    return;
  }
  return await sampleTerrainMostDetailed(terrainProvider, positions);
}
export function drawPipeLine(viewer, positions = [], { options = {}, polylineOptions = {} } = {}) {
  if (!viewer || !Array.isArray(positions) || positions.length === 0) return;
  const entitie = viewer.entities.getById(options?.id);

  if (entitie) viewer.entities.remove(entitie);
  return viewer.entities.add({
    drawType: 'pipeline',
    ...options,
    polyline: {
      positions: new CallbackProperty(() => positions, true),
      width: 3,
      material: Color.fromCssColorString('#00FF00'),
      clampToGround: true,
      ...polylineOptions,
    },
  });
}
export function drawCornerPile(
  viewer,
  position,
  { label, options = {}, billboardOptions = {}, labelOptions = {} } = {},
) {
  if (!viewer || !position) return;

  const entitie = viewer.entities.getById(options?.id);

  if (entitie) viewer.entities.remove(entitie);
  return viewer.entities.add({
    position: new CallbackProperty(() => position, true),
    drawType: 'cornerPile',
    ...options,
    billboard: {
      image: require('@assets/images/corner-piles.png'),
      verticalOrigin: VerticalOrigin.BOTTOM,
      ...billboardOptions,
    },
    label:
      typeof label === 'string'
        ? {
          text: label,
          font: '10px',
          fillColor: Color.fromCssColorString('#434343'),
          style: LabelStyle.FILL_AND_OUTLINE,
          outlineColor: Color.WHITE,
          outlineWidth: 3.0,
          horizontalOrigin: HorizontalOrigin.CENTER,
          pixelOffset: new Cartesian2(0, -32 - 10),
          eyeOffset: new Cartesian3(0, 0, -10),
          ...labelOptions,
        }
        : undefined,
  });
}
export function drawWayline(viewer, id, positions = []) {
  if (!viewer || !id || !Array.isArray(positions) || positions.length === 0) return;
  const entitie = viewer.entities.getById(id);

  if (entitie) viewer.entities.remove(entitie);
  return viewer.entities.add({
    id,
    drawType: 'wayline',
    polyline: {
      positions: new CallbackProperty(() => positions, true),
      width: 3,
      // material: new PolylineDashMaterialProperty({
      //   color: Color.fromCssColorString("#216ff6")
      // }),
      material: Color.fromCssColorString('#216ff6'),
    },
  });
}
export function drawWalinePoint(viewer, id, position, groundPosition, label) {
  if (!viewer || !id || !position || !label) return;

  const entitie = viewer.entities.getById(id);

  if (entitie) viewer.entities.remove(entitie);
  return viewer.entities.add({
    id,
    position: new CallbackProperty(() => position, true),
    drawType: 'wayline-point',
    billboard: {
      image: require('@assets/images/wayline/wayline-point.png'),
      verticalOrigin: VerticalOrigin.BOTTOM,
    },
    label: {
      text: new CallbackProperty(() => label, true),
      font: '12px',
      fillColor: Color.WHITE,
      pixelOffset: new Cartesian2(0, -29),
      outlineColor: Color.WHITE,
      eyeOffset: new Cartesian3(0, 0, -1),
    },
    polyline: {
      positions: new CallbackProperty(() => [position, groundPosition], true),
      width: 1,
      material: new PolylineDashMaterialProperty({
        color: Color.WHITE,
      }),
    },
  });
}
export function drawWaylineFromPoints(viewer, points) {
  if (!viewer || !points) return;

  const positions = [];

  points.forEach(({ id, longitude, latitude, height } = {}, index) => {
    const position = Cartesian3.fromDegrees(longitude, latitude, height);

    positions.push(position);
    drawWalinePoint(viewer, position, index + 1, { options: { id } });
  });
  drawWayline(viewer, positions, { options: { id: 'xxxx' } });

  return positions;
}
export async function drawWaylineFromUrl(viewer, url, id) {
  if (!viewer || !url) {
    ElMessage.error('地图视图出错或航线链接有误');
    return;
  }

  const {
    templateType,
    waylineCoordinateSysParam: { heightMode } = {},
    Placemark,
    takeOffRefPoint: {
      longitude: takeOffRefPointLongitude,
      latitude: takeOffRefPointLatitude,
      ellipsoidHeight: takeOffRefPointEllipsoidHeight,
    } = {},
  } = await analysisKmzToUrl(url);
  const placemarkLength = Array.isArray(Placemark) ? Placemark.length : 0;

  if (templateType !== 'waypoint') {
    ElMessage.error('只支持航点航线预览');
    return;
  }
  if (placemarkLength < 2) {
    ElMessage.error('航线有误');
    return;
  }
  if (
    !Placemark.every(
      ({ longitude, latitude, ellipsoidHeight, height } = {}) =>
        validateLongitude(longitude) &&
        validateLatitude(latitude) &&
        validateNumber(ellipsoidHeight) &&
        validateNumber(height),
    )
  ) {
    ElMessage.error('航点有误');
    return;
  }
  if (!heightMode) {
    ElMessage.error('航线高度模式有误');
    return;
  }
  if (
    heightMode === 'relativeToStartPoint' &&
    (!validateLongitude(takeOffRefPointLongitude) ||
      !validateLatitude(takeOffRefPointLatitude) ||
      !validateNumber(takeOffRefPointEllipsoidHeight))
  ) {
    ElMessage.error('起飞点有误');
    return;
  }
  const positions = [];
  const cartographics = Placemark.map(({ longitude, latitude } = {}) =>
    Cartographic.fromDegrees(Number(longitude), Number(latitude)),
  );
  const heights = await getHeights(viewer.terrainProvider, cartographics);
  // console.log("heights", heights);
  Placemark.forEach(({ id: pointId, longitude, latitude, ellipsoidHeight, height } = {}, index) => {
    let egm96Alt = ellipsoidToEgm96(latitude, longitude, ellipsoidHeight);
    let position;

    if (heightMode === 'relativeToStartPoint') {
      egm96Alt = ellipsoidToEgm96(
        takeOffRefPointLatitude,
        takeOffRefPointLongitude,
        takeOffRefPointEllipsoidHeight + height,
      );
    }
    position = Cartesian3.fromDegrees(longitude, latitude, egm96Alt);
    positions.push(position);
    drawWalinePoint(
      viewer,
      pointId,
      position,
      Cartesian3.fromDegrees(longitude, latitude, heights[index].height),
      `${index + 1}`,
    );
  });
  drawWayline(viewer, id, positions);
  viewer.scene.requestRender();
  return [positions];
}
export function resetNorth(viewer, duration = 0.1) {
  const camera = viewer.camera;
  const currentPosition = camera.positionCartographic;
  const currentPitch = camera.pitch;

  camera.flyTo({
    destination: Cartesian3.fromRadians(
      currentPosition.longitude,
      currentPosition.latitude,
      Math.max(currentPosition.height, 5000),
    ),
    orientation: {
      heading: 0,
      pitch: CesiumMath.toRadians(-90),
      roll: 0,
    },
    duration,
  });
  // viewer.camera.setView({
  //   orientation: {
  //     heading: 0,
  //     pitch: CesiumMath.toRadians(-90),
  //     roll: 0
  //   },
  //   duration: duration,
  // });
}
export function toCenter(viewer) {
  if (!tempBoundingSphere) return ElMessage.error('回到中心有误');
  positionFromBoundingSphere(viewer, tempBoundingSphere, 0.1);
}
export function moveForward(viewer) {
  const { height = 0 } = viewer.scene.camera.positionCartographic;
  const minZoom = 1000;

  if (height > minZoom) {
    viewer.scene.camera.zoomIn(height * 0.1);
  }
}
export function moveBackward(viewer) {
  const { height = 0 } = viewer.scene.camera.positionCartographic;
  const maxZoom = 9000000;

  if (height < maxZoom) {
    viewer.scene.camera.zoomOut(height * 0.1);
  }
}
export async function addCornerPile(
  viewer,
  items = [],
  { visible = true, isGetHeight = true } = {},
) {
  if (!Array.isArray(items) || items.length === 0) return;
  if (
    !items.every(
      ({ longitude, latitude } = {}) => validateLongitude(longitude) && validateLatitude(latitude),
    )
  ) {
    return;
  }

  const billboardCollection = new BillboardCollection({
    show: visible,
    blendOption: BlendOption.TRANSLUCENT,
  });
  const labelCollection = new LabelCollection({
    show: visible,
    blendOption: BlendOption.TRANSLUCENT,
  });
  const cartographics = items.map(({ longitude, latitude } = {}) =>
    Cartographic.fromDegrees(Number(longitude), Number(latitude)),
  );
  const heights = await getHeights(viewer.terrainProvider, cartographics);
  const result = {};

  items.forEach((item = {}, index) => {
    const { id, longitude, latitude, altitude, pointName } = item;
    const key = `pipe-corner-${id}`;
    const labelKey = `pipe-corner-label-${id}`;
    let elevation = heights[index].height;

    if (!isGetHeight && validateNumber(altitude)) {
      elevation = Number(altitude);
    }
    const position = Cartesian3.fromDegrees(Number(longitude), Number(latitude), elevation);

    result[key] = {
      ...item,
      key,
      labelKey,
      elevation,
    };
    billboardCollection.add({
      id: key,
      position,
      image: require('@assets/images/corner-piles.png'),
      verticalOrigin: VerticalOrigin.BOTTOM,
      eyeOffset: new Cartesian3(0, 0, -10),
    });
    pointName &&
      labelCollection.add({
        id: labelKey,
        position,
        text: pointName,
        font: '10px',
        fillColor: Color.fromCssColorString('#434343'),
        style: LabelStyle.FILL_AND_OUTLINE,
        outlineColor: Color.WHITE,
        outlineWidth: 3.0,
        horizontalOrigin: HorizontalOrigin.CENTER,
        pixelOffset: new Cartesian2(0, -32 - 5),
        eyeOffset: new Cartesian3(0, 0, -10),
      });
  });
  viewer.scene.primitives.add(billboardCollection);
  viewer.scene.primitives.add(labelCollection);
  viewer.scene.requestRender();

  return {
    billboardCollection,
    labelCollection,
    result,
  };
}
export async function addLinePile(viewer, id, items, { visible = true, options = {} } = {}) {
  if (!Array.isArray(items) || items.length === 0) return;

  const polylineCollection = new GroundPolylineCollection({
    show: visible,
  });
  const result = {};
  const allPositions = [];

  for (const { coordinates } of items) {
    if (
      !Array.isArray(coordinates) ||
      coordinates.length === 0 ||
      !coordinates.every(
        ({ longitude, latitude } = {}) =>
          validateLongitude(longitude) && validateLatitude(latitude),
      )
    ) {
      continue;
    }

    const cartographics = coordinates.map(({ longitude, latitude } = {}) =>
      Cartographic.fromDegrees(Number(longitude), Number(latitude)),
    );
    const heights = await getHeights(viewer.terrainProvider, cartographics);
    const positions = coordinates.map(({ longitude, latitude } = {}, index) =>
      Cartesian3.fromDegrees(Number(longitude), Number(latitude), heights[index].height),
    );
    const key = `pipe-${id}`;

    result[key] = {
      id,
      ...(options || {}),
    };
    polylineCollection.add({
      id: key,
      positions,
      width: 2,
      material: new Material({
        fabric: {
          type: 'Color',
          uniforms: {
            color: Color.fromCssColorString('#00FF00'),
          },
        },
      }),
    });

    allPositions.push(...positions);
  }

  // viewer.scene.primitives.add(polylineCollection);
  polylineCollection.addToScene(viewer.scene);
  viewer.scene.requestRender();
  return { polylineCollection, result, positions: allPositions };
}
export async function addWaylineFormUrl(viewer, url, id, { solidLine = true } = {}) {
  if (!viewer || !url || !id) return;

  const {
    templateType,
    waylineCoordinateSysParam: { heightMode } = {},
    Placemark,
    takeOffSecurityHeight,
    flyToWaylineMode,
    takeOffRefPoint: {
      longitude: takeOffRefPointLongitude,
      latitude: takeOffRefPointLatitude,
      ellipsoidHeight: takeOffRefPointEllipsoidHeight,
    } = {},
  } = await analysisKmzToUrl(url);
  const placemarkLength = Array.isArray(Placemark) ? Placemark.length : 0;

  if (templateType !== 'waypoint') {
    ElMessage.error('只支持航点航线');
    return;
  }
  if (placemarkLength < 2) {
    ElMessage.error('航线有误');
    return;
  }
  if (
    !Placemark.every(
      ({ longitude, latitude, ellipsoidHeight, height } = {}) =>
        validateLongitude(longitude) &&
        validateLatitude(latitude) &&
        validateNumber(ellipsoidHeight) &&
        validateNumber(height),
    )
  ) {
    ElMessage.error('航点有误');
    return;
  }
  if (!heightMode) {
    ElMessage.error('航线高度模式有误');
    return;
  }
  if (
    heightMode === 'relativeToStartPoint' &&
    (!validateLongitude(takeOffRefPointLongitude) ||
      !validateLatitude(takeOffRefPointLatitude) ||
      !validateNumber(takeOffRefPointEllipsoidHeight))
  ) {
    ElMessage.error('起飞点有误');
    return;
  }
  if (!validateNumber(takeOffSecurityHeight)) {
    ElMessage.error('安全起飞高度有误');
    return;
  }

  const cartographics = Placemark.map(({ longitude, latitude } = {}) =>
    Cartographic.fromDegrees(Number(longitude), Number(latitude)),
  );
  console.log(cartographics, 'cartographicscartographics')
  const heights = await getHeights(viewer.terrainProvider, cartographics);
  const billboardCollection = new BillboardCollection({
    blendOption: BlendOption.TRANSLUCENT,
  });
  const labelCollection = new LabelCollection({
    blendOption: BlendOption.TRANSLUCENT,
  });
  const polylineCollection = new PolylineCollection();
  const positions = [];
  const takeOffRefPointPositions = [];

  if (
    validateLongitude(takeOffRefPointLongitude) &&
    validateLatitude(takeOffRefPointLatitude) &&
    validateNumber(takeOffRefPointEllipsoidHeight)
  ) {
    const takeOffRefPointHeight = ellipsoidToEgm96(
      takeOffRefPointLatitude,
      takeOffRefPointLongitude,
      takeOffRefPointEllipsoidHeight,
    );
    const {
      longitude: pointLongitude,
      latitude: pointLatitude,
      height: pointHeight,
    } = Placemark[0];
    console.log(Placemark, 'Placemark')
    const heights = await getHeights(viewer.terrainProvider, [
      Cartographic.fromDegrees(Number(pointLongitude), Number(pointLatitude)),
    ]);
    let pointElevation = pointHeight;
    const takeOffSalfHeight = takeOffRefPointHeight + takeOffSecurityHeight;

    if (heightMode === 'aboveGroundLevel') {
      pointElevation = heights[0]?.height + pointHeight;
    }
    if (heightMode === 'relativeToStartPoint') {
      pointElevation = takeOffRefPointHeight + pointHeight;
    }
    // 安全模式
    // 取安全起飞高度航点第一条的大值
    let height =
      flyToWaylineMode === 'safely'
        ? Math.max(takeOffSalfHeight, pointElevation)
        : takeOffSalfHeight;
    const takeOffRefPointPosition = Cartesian3.fromDegrees(
      takeOffRefPointLongitude,
      takeOffRefPointLatitude,
      takeOffRefPointHeight,
    );

    billboardCollection.add({
      position: takeOffRefPointPosition,
      image: require('@assets/images/wayline/takeOffRef-point.svg'),
      verticalOrigin: VerticalOrigin.BOTTOM,
    });
    takeOffRefPointPositions.push(takeOffRefPointPosition);
    takeOffRefPointPositions.push(
      Cartesian3.fromDegrees(takeOffRefPointLongitude, takeOffRefPointLatitude, height),
    );
    if (
      flyToWaylineMode === 'safely' ||
      (flyToWaylineMode !== 'safely' && takeOffSalfHeight > pointElevation)
    ) {
      takeOffRefPointPositions.push(Cartesian3.fromDegrees(pointLongitude, pointLatitude, height));
    }
    takeOffRefPointPositions.push(
      Cartesian3.fromDegrees(pointLongitude, pointLatitude, pointElevation),
    );
    polylineCollection.add({
      id: `takeoff-${id}`,
      positions: takeOffRefPointPositions,
      width: 3,
      material: new Material({
        fabric: {
          type: 'PolylineDash',
          uniforms: {
            color: Color.fromCssColorString('#216ff6'),
            gapColor: Color.TRANSPARENT,
            dashLength: 16.0,
            dashPattern: 255.0,
          },
        },
      }),
    });
  }

  Placemark.forEach(({ longitude, latitude, ellipsoidHeight, height } = {}, index) => {
    let elevation = ellipsoidToEgm96(latitude, longitude, ellipsoidHeight);

    if (heightMode === 'relativeToStartPoint') {
      elevation = ellipsoidToEgm96(
        takeOffRefPointLatitude,
        takeOffRefPointLongitude,
        takeOffRefPointEllipsoidHeight + height,
      );
    }
    const position = Cartesian3.fromDegrees(longitude, latitude, elevation);
    const groundPosition = Cartesian3.fromDegrees(longitude, latitude, heights[index].height);

    positions.push(position);
    billboardCollection.add({
      position,
      image: require('@assets/images/wayline/wayline-point.png'),
      verticalOrigin: VerticalOrigin.BOTTOM,
    });
    labelCollection.add({
      position,
      horizontalOrigin: HorizontalOrigin.CENTER,
      text: `${index + 1}`,
      font: '12px',
      fillColor: Color.WHITE,
      pixelOffset: new Cartesian2(0, -23),
      outlineColor: Color.WHITE,
      eyeOffset: new Cartesian3(0, 0, -1),
    });
    polylineCollection.add({
      positions: [position, groundPosition],
      width: 1,
      material: new Material({
        fabric: {
          type: 'PolylineDash',
          uniforms: {
            color: Color.WHITE,
            gapColor: Color.TRANSPARENT,
            dashLength: 16.0,
            dashPattern: 255.0,
          },
        },
      }),
    });
  });

  polylineCollection.add({
    id,
    positions,
    width: 3,
    material: solidLine
      ? new Material({
        fabric: {
          type: 'Color',
          uniforms: {
            color: Color.fromCssColorString('#216ff6'),
          },
        },
      })
      : new Material({
        fabric: {
          type: 'PolylineDash',
          uniforms: {
            color: Color.fromCssColorString('#216ff6'),
            gapColor: Color.TRANSPARENT,
            dashLength: 16.0,
            dashPattern: 255.0,
          },
        },
      }),
  });
  viewer.scene.primitives.add(billboardCollection);
  viewer.scene.primitives.add(labelCollection);
  viewer.scene.primitives.add(polylineCollection);
  viewer.scene.requestRender();

  return {
    positions,
    collection: {
      billboardCollection,
      labelCollection,
      polylineCollection,
    },
  };
}
export async function addDock(viewer, longitude, latitude, id, { visible = true, name = '' } = {}) {
  if (!viewer) return;
  if (!validateLongitude(longitude) || !validateLatitude(latitude)) return;

  const billboardCollection = new BillboardCollection({
    show: visible,
    blendOption: BlendOption.TRANSLUCENT,
  });
  const labelCollection = new LabelCollection({
    show: visible,
    blendOption: BlendOption.TRANSLUCENT,
  });
  const heights = await getHeights(viewer.terrainProvider, [
    Cartographic.fromDegrees(Number(longitude), Number(latitude)),
  ]);
  const key = `dock-${id}`;
  const labelKey = `dock-label-${id}`;
  const position = Cartesian3.fromDegrees(
    Number(longitude),
    Number(latitude),
    heights?.[0]?.height,
  );

  billboardCollection.add({
    id: key,
    position,
    image: require('@assets/images/dock.png'),
    verticalOrigin: VerticalOrigin.BOTTOM,
    eyeOffset: new Cartesian3(0, 0, -6),
  });
  name &&
    labelCollection.add({
      id: labelKey,
      position,
      text: name,
      font: '10px',
      fillColor: Color.fromCssColorString('#434343'),
      style: LabelStyle.FILL_AND_OUTLINE,
      outlineColor: Color.WHITE,
      outlineWidth: 3.0,
      horizontalOrigin: HorizontalOrigin.CENTER,
      pixelOffset: new Cartesian2(0, -48 - 5),
      eyeOffset: new Cartesian3(0, 0, -6),
    });

  viewer.scene.primitives.add(billboardCollection);
  viewer.scene.primitives.add(labelCollection);
  viewer.scene.requestRender();

  return {
    billboardCollection,
    labelCollection,
    position,
  };
}
export async function addPipeMark(viewer, items = [], { visible = true } = {}) {
  if (!Array.isArray(items) || items.length === 0) return;
  if (
    !items.every(
      ({ longitude, latitude } = {}) => validateLongitude(longitude) && validateLatitude(latitude),
    )
  ) {
    return;
  }

  const billboardCollectionMap = new Map();
  const labelCollectionMap = new Map();
  const cartographics = items.map(({ longitude, latitude } = {}) =>
    Cartographic.fromDegrees(Number(longitude), Number(latitude)),
  );
  const heights = await getHeights(viewer.terrainProvider, cartographics);
  const result = {};

  items.forEach((item = {}, index) => {
    const { id, longitude, latitude, sectionId, markCategory, markName } = item;
    const key = `pipe-mark-${id}`;
    const labelKey = `pipe-mark-label-${id}`;
    const position = Cartesian3.fromDegrees(
      Number(longitude),
      Number(latitude),
      heights[index].height,
    );
    let billboardCollection = billboardCollectionMap.get(sectionId);
    let labelCollection = labelCollectionMap.get(sectionId);

    result[key] = {
      ...item,
      key,
      labelKey,
    };
    if (!billboardCollectionMap.has(sectionId)) {
      billboardCollection = new BillboardCollection({
        show: visible,
        blendOption: BlendOption.TRANSLUCENT,
      });
      billboardCollectionMap.set(sectionId, billboardCollection);
      viewer.scene.primitives.add(billboardCollection);
    }
    if (!labelCollectionMap.has(sectionId)) {
      labelCollection = new LabelCollection({
        show: visible,
        blendOption: BlendOption.TRANSLUCENT,
      });
      labelCollectionMap.set(sectionId, labelCollection);
      viewer.scene.primitives.add(labelCollection);
    }
    billboardCollection.add({
      id: key,
      position,
      image: pipeMarkAssetsMap?.[markCategory]?.image || pipeMarkAssetsMap[399].image,
      verticalOrigin: VerticalOrigin.BOTTOM,
      eyeOffset: new Cartesian3(0, 0, -10),
    });
    markName &&
      labelCollection.add({
        id: labelKey,
        position,
        text: markName,
        font: '10px',
        fillColor: Color.fromCssColorString('#434343'),
        style: LabelStyle.FILL_AND_OUTLINE,
        outlineColor: Color.WHITE,
        outlineWidth: 3.0,
        horizontalOrigin: HorizontalOrigin.CENTER,
        pixelOffset: new Cartesian2(0, -53 - 5),
        eyeOffset: new Cartesian3(0, 0, -10),
      });
  });
  viewer.scene.requestRender();

  return {
    result,
    billboardCollectionMap,
    labelCollectionMap,
  };
}
export function createAirDrone(viewer) {
  if (!viewer) return;
  let sampledPosition;
  let timeIntervalCollection;
  let startTimeJulian;
  let droneLable;
  let droneEntitite;
  let droneInnerEntitite;

  function clearAll() {
    sampledPosition = null;
    timeIntervalCollection = null;
    startTimeJulian = null;
    droneLable = null;
    clearDrone();
  }
  function clearDrone() {
    if (droneEntitite) {
      viewer.entities.remove(droneEntitite);
      droneEntitite = null;
    }
    if (droneInnerEntitite) {
      viewer.entities.remove(droneInnerEntitite);
      droneInnerEntitite = null;
    }
  }
  function addDrone(position, availability) {
    if (!droneEntitite) {
      let billboardScale = 1;
      let isPositive = true;

      droneEntitite = viewer.entities.add({
        position,
        id: 'AirDroneId',
        availability,
        path: {
          leadTime: 0,
          resolution: 1,
          material: Color.fromCssColorString('#01FFF1'),
          width: 2,
        },
        billboard: {
          image: require('@assets/images/drone-bg.png'),
          verticalOrigin: VerticalOrigin.CENTER,
          horizontalOrigin: HorizontalOrigin.CENTER,
          eyeOffset: new Cartesian3(0, 0, -65),
          width: 60,
          height: 60,
          scale: new CallbackProperty(() => {
            const value = isPositive ? 0.005 : -0.005;

            if (isPositive && billboardScale >= 1.3) isPositive = false;
            if (!isPositive && billboardScale <= 1) isPositive = true;
            return (billboardScale += value);
          }, false),
        },
        label: {
          text: new CallbackProperty(() => droneLable, false),
          font: '12pt',
          fillColor: Color.fromCssColorString('#01FFF1'),
          pixelOffset: new Cartesian2(0, -36),
          eyeOffset: new Cartesian3(0, 0, -66),
          outlineColor: Color.WHITE,
          outlineWidth: 2,
        },
      });
    }
    if (!droneInnerEntitite) {
      droneInnerEntitite = viewer.entities.add({
        id: 'AirDroneIdInner',
        position,
        billboard: {
          image: require('@assets/images/drone.png'),
          verticalOrigin: VerticalOrigin.CENTER,
          horizontalOrigin: HorizontalOrigin.CENTER,
          eyeOffset: new Cartesian3(0, 0, -66),
          width: 35,
          height: 35,
        },
      });
    }
  }
  function setDroneLable(label = '飞行器') {
    droneLable = label;
  }
  function startAnimate() {
    if (!viewer.clock.shouldAnimate) {
      viewer.clock.shouldAnimate = true;
    }
  }
  function stopAnimate() {
    if (viewer.clock.shouldAnimate) {
      viewer.clock.shouldAnimate = false;
    }
  }
  function setCurrentTime(timeJulian) {
    viewer.clock.currentTime = timeJulian;
  }
  function addSample(time, position, { label, isStart = true } = {}) {
    const currentTimeJulian = JulianDate.fromDate(new Date(time));

    if (!sampledPosition) sampledPosition = new SampledPositionProperty();
    if (!timeIntervalCollection) timeIntervalCollection = new TimeIntervalCollection();
    if (!startTimeJulian) {
      startTimeJulian = currentTimeJulian;
      viewer.clock.startTime = currentTimeJulian;
      viewer.clock.clockRange = ClockRange.CLAMPED;
      setCurrentTime(JulianDate.fromDate(new Date(time - 2000)));
    }
    viewer.clock.stopTime = currentTimeJulian;
    sampledPosition.addSample(currentTimeJulian, position);
    timeIntervalCollection.addInterval(
      new TimeInterval({
        start: startTimeJulian,
        stop: currentTimeJulian,
      }),
    );
    setDroneLable(label);
    addDrone(sampledPosition, timeIntervalCollection);
    isStart && startAnimate();
  }

  return {
    clearAll,
    clearDrone,
    addSample,
    setDroneLable,
    startAnimate,
    stopAnimate,
    setCurrentTime,
    addSample,
  };
}
