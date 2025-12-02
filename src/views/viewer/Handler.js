
import * as Cesium from 'cesium'
import turf from '@turf/turf'
export class DrawingTool {
    constructor(viewer) {
        this.viewer = viewer;
        this.handler = null;
        this.positions = [];
        this.entity = null;
        this.tempEntity = null; // 临时预览实体
        this.drawings = []; // 存储所有绘制的图形
        this.currentDrawing = {
            type: null, // 'line' 或 'polygon'
            coordinates: [],
            length: 0,
            area: 0,
            entity: null
        };
    }

    // 开始绘制线
    startDrawingLine() {
        this.reset();
        this.currentDrawing.type = 'line';

        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

        // 左键点击添加点
        this.handler.setInputAction((click) => {
            const cartesian = this.viewer.scene.pickPosition(click.position);
            if (cartesian) {
                this.positions.push(cartesian);
                this.updateLine();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动预览
        this.handler.setInputAction((movement) => {
            const cartesian = this.viewer.scene.pickPosition(movement.endPosition);
            if (cartesian && this.positions.length > 0) {
                this.updatePreviewLine(cartesian);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 右键结束绘制
        this.handler.setInputAction((click) => {
            if (this.positions.length >= 2) {
                this.finishDrawing();
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    // 开始绘制多边形
    startDrawingPolygon() {
        this.reset();
        this.currentDrawing.type = 'polygon';

        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);

        // 左键点击添加点
        this.handler.setInputAction((click) => {
            const cartesian = this.viewer.scene.pickPosition(click.position);
            if (cartesian) {
                this.positions.push(cartesian);
                this.updatePolygon();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 鼠标移动预览
        this.handler.setInputAction((movement) => {
            const cartesian = this.viewer.scene.pickPosition(movement.endPosition);
            if (cartesian && this.positions.length > 0) {
                this.updatePreviewPolygon(cartesian);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // 右键结束绘制
        this.handler.setInputAction((click) => {
            if (this.positions.length >= 3) {
                this.finishDrawing();
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    updateLine() {
        if (this.entity) {
            this.viewer.entities.remove(this.entity);
        }

        this.entity = this.viewer.entities.add({
            polyline: {
                positions: this.positions,
                width: 3,
                material: Cesium.Color.BLUE,
                clampToGround: true
            }
        });
    }

    updatePreviewLine(mousePosition) {
        if (this.tempEntity) {
            this.viewer.entities.remove(this.tempEntity);
        }

        const previewPositions = [...this.positions, mousePosition];
        this.tempEntity = this.viewer.entities.add({
            polyline: {
                positions: previewPositions,
                width: 2,
                material: Cesium.Color.BLUE.withAlpha(0.5),
                clampToGround: true
            }
        });
    }

    updatePolygon() {
        if (this.entity) {
            this.viewer.entities.remove(this.entity);
        }

        if (this.positions.length >= 3) {
            this.entity = this.viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(this.positions),
                    material: Cesium.Color.GREEN.withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    clampToGround: true
                }
            });
        }
    }

    updatePreviewPolygon(mousePosition) {
        if (this.tempEntity) {
            this.viewer.entities.remove(this.tempEntity);
        }

        if (this.positions.length >= 2) {
            const previewPositions = [...this.positions, mousePosition];
            this.tempEntity = this.viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy(previewPositions),
                    material: Cesium.Color.GREEN.withAlpha(0.3),
                    outline: true,
                    outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
                    outlineWidth: 1,
                    clampToGround: true
                }
            });
        }
    }

    finishDrawing() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }

        if (this.tempEntity) {
            this.viewer.entities.remove(this.tempEntity);
            this.tempEntity = null;
        }

        // 保存当前绘制
        const cartographicPositions = this.positions.map(cartesian => {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            return cartographic;
        });

        this.currentDrawing.coordinates = cartographicPositions;

        // 计算长度或面积
        if (this.currentDrawing.type === 'line' && this.positions.length >= 2) {
            const length = this.calculateLineLength();
            this.currentDrawing.length = length;
            console.log(`线长度: ${length.toFixed(2)} 米`);

            // 添加长度标签
            this.addLengthLabel(length);

        } else if (this.currentDrawing.type === 'polygon' && this.positions.length >= 3) {
            const area = this.calculatePolygonArea();
            this.currentDrawing.area = area;
            console.log(`多边形面积: ${area.toFixed(2)} 平方米 (${(area / 1000000).toFixed(4)} 平方公里)`);

            // 添加面积标签
            this.addAreaLabel(area);
        }

        // 保存到历史记录
        this.drawings.push({
            ...this.currentDrawing,
            entity: this.entity
        });

        // 显示计算结果
        this.showMeasurementResult();

        return this.currentDrawing;
    }

    // 使用Turf.js计算线长度
    calculateLineLength() {
        if (this.positions.length < 2) return 0;

        // 将笛卡尔坐标转换为经纬度坐标
        const lineCoords = this.positions.map(cartesian => {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const lon = Cesium.Math.toDegrees(cartographic.longitude);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);
            const height = cartographic.height;
            return [lon, lat, height];
        });

        // 创建Turf线段
        const lineString = turf.lineString(lineCoords.map(coord => [coord[0], coord[1]]));

        // 计算长度（返回米）
        const length = turf.length(lineString, { units: 'meters' });

        return length;
    }

    // 使用Turf.js计算多边形面积
    calculatePolygonArea() {
        if (this.positions.length < 3) return 0;

        // 将笛卡尔坐标转换为经纬度坐标
        const polygonCoords = this.positions.map(cartesian => {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const lon = Cesium.Math.toDegrees(cartographic.longitude);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);
            return [lon, lat];
        });

        // 闭合多边形（首尾点相同）
        polygonCoords.push(polygonCoords[0]);

        // 创建Turf多边形
        const polygon = turf.polygon([polygonCoords]);

        // 计算面积（返回平方米）
        const area = turf.area(polygon);

        return area;
    }

    // 添加长度标签到线的中点
    addLengthLabel(length) {
        if (this.positions.length < 2) return;

        // 计算线的中点
        const midIndex = Math.floor(this.positions.length / 2);
        const position = this.positions[midIndex];

        this.viewer.entities.add({
            position: position,
            label: {
                text: `${length.toFixed(2)} 米`,
                font: '14px Microsoft YaHei',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -20),
                showBackground: true,
                backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        });
    }

    // 添加面积标签到多边形的中心
    addAreaLabel(area) {
        if (this.positions.length < 3) return;

        // 计算多边形的中心点
        const center = this.calculatePolygonCenter(this.positions);

        this.viewer.entities.add({
            position: center,
            label: {
                text: `${(area / 1000000).toFixed(4)} 平方公里\n${area.toFixed(0)} 平方米`,
                font: '14px Microsoft YaHei',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                showBackground: true,
                backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 0.8
            }
        });
    }

    // 计算多边形中心点
    calculatePolygonCenter(positions) {
        const center = new Cesium.Cartesian3(0, 0, 0);

        positions.forEach(position => {
            Cesium.Cartesian3.add(center, position, center);
        });

        Cesium.Cartesian3.divideByScalar(center, positions.length, center);

        return center;
    }

    // 显示测量结果
    showMeasurementResult() {
        let result = '';

        if (this.currentDrawing.type === 'line') {
            result = `线长度: ${this.currentDrawing.length.toFixed(2)} 米`;
        } else if (this.currentDrawing.type === 'polygon') {
            result = `多边形面积: ${this.currentDrawing.area.toFixed(2)} 平方米 (${(this.currentDrawing.area / 1000000).toFixed(4)} 平方公里)`;
        }

        // 可以显示在页面上的某个div中
        const resultDiv = document.getElementById('measurement-result');
        if (resultDiv) {
            resultDiv.innerHTML = result;
            resultDiv.style.display = 'block';
        }

        console.log(result);

        // 或者使用Cesium的InfoBox
        if (this.entity) {
            this.entity.description = result;
        }
    }

    // 批量计算所有图形的统计信息
    calculateAllStatistics() {
        let totalLength = 0;
        let totalArea = 0;
        let lineCount = 0;
        let polygonCount = 0;

        this.drawings.forEach(drawing => {
            if (drawing.type === 'line') {
                totalLength += drawing.length || 0;
                lineCount++;
            } else if (drawing.type === 'polygon') {
                totalArea += drawing.area || 0;
                polygonCount++;
            }
        });

        return {
            totalLength,
            totalArea,
            lineCount,
            polygonCount,
            totalDrawings: this.drawings.length
        };
    }

    // 清除所有绘制
    clearAllDrawings() {
        this.drawings.forEach(drawing => {
            if (drawing.entity) {
                this.viewer.entities.remove(drawing.entity);
            }
        });
        this.drawings = [];
        this.reset();

        console.log('所有绘制已清除');
    }

    reset() {
        if (this.handler) {
            this.handler.destroy();
        }
        if (this.entity) {
            this.viewer.entities.remove(this.entity);
        }
        if (this.tempEntity) {
            this.viewer.entities.remove(this.tempEntity);
        }

        this.positions = [];
        this.entity = null;
        this.tempEntity = null;
        this.currentDrawing = {
            type: null,
            coordinates: [],
            length: 0,
            area: 0,
            entity: null
        };
    }
}