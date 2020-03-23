"use strict";
cc._RF.push(module, '1510cpoAmJEyIlGd5dUGovI', 'cut-main');
// script/cut/cut-main.ts

Object.defineProperty(exports, "__esModule", { value: true });
var cut_item_1 = require("./cut-item");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw = undefined;
        _this.gameLayer = undefined;
        return _this;
    }
    Main.prototype.onLoad = function () {
        this.registerEvent();
    };
    Main.prototype.registerEvent = function () {
        var _this = this;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            _this.draw.clear();
            var startPoint = e.getStartLocation();
            _this.draw.moveTo(startPoint.x, startPoint.y);
            _this.draw.lineTo(e.getLocationX(), e.getLocationY());
            _this.draw.stroke();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
            _this.draw.clear();
            var p1 = e.getStartLocation();
            var p2 = e.getLocation();
            _this.cut(p1, p2);
        }, this);
    };
    Main.prototype.cut = function (point1, point2) {
        var result1 = cc.director.getPhysicsManager().rayCast(point1, point2, cc.RayCastType.Closest);
        var result2 = cc.director.getPhysicsManager().rayCast(point2, point1, cc.RayCastType.Closest);
        if (result1.length === 0 || result2.length === 0) {
            cc.warn('无碰撞体');
            return;
        }
        if (result1[0].collider !== result2[0].collider) {
            cc.warn('不是单独碰撞体');
            return;
        }
        if (!(result1[0].collider instanceof cc.PhysicsPolygonCollider)) {
            cc.warn('非多边形物理碰撞盒无points属性');
            return;
        }
        // 将单独的碰撞体分割成两块，利用点是否在线上判断
        var collider = result1[0].collider;
        var localPoint1 = cc.Vec2.ZERO;
        var localPoint2 = cc.Vec2.ZERO;
        collider.body.getLocalPoint(result1[0].point, localPoint1);
        collider.body.getLocalPoint(result2[0].point, localPoint2);
        var points = collider.points;
        var index1 = undefined;
        var index2 = undefined;
        for (var i = 0; i < points.length; i++) {
            var p1 = points[i];
            var p2 = i === points.length - 1 ? points[0] : points[i + 1];
            if (this.pointInLine(localPoint1, p1, p2)) {
                index1 = i;
            }
            if (this.pointInLine(localPoint2, p1, p2)) {
                index2 = i;
            }
            if (index1 !== undefined && index2 !== undefined) {
                break;
            }
        }
        cc.log("\u70B91\u4E0B\u6807" + index1);
        cc.log("\u70B92\u4E0B\u6807" + index2);
        // 一次循环，装入两个点数组
        var array1 = [];
        var array2 = [];
        // 碰到 index1 或 index2 标志
        var time = 0;
        for (var i = 0; i < points.length; i++) {
            var temp = points[i].clone();
            if (time === 0) {
                array1.push(temp);
            }
            else {
                array2.push(temp);
            }
            if ((i === index1 || i === index2) && time === 0) {
                array1.push(i === index1 ? localPoint1.clone() : localPoint2.clone());
                array2.push(i === index1 ? localPoint1.clone() : localPoint2.clone());
                time = 1;
            }
            else if ((i === index1 || i === index2) && time === 1) {
                array2.push(i === index1 ? localPoint1.clone() : localPoint2.clone());
                array1.push(i === index1 ? localPoint1.clone() : localPoint2.clone());
                time = 0;
            }
        }
        cc.log(array1, array2);
        // 设置第一个碰撞体
        collider.points = array1;
        collider.apply();
        collider.node.getComponent(cut_item_1.default).draw();
        // 克隆一个本体作为第二个
        var cloneNode = cc.instantiate(collider.node);
        this.gameLayer.addChild(cloneNode);
        var comp = cloneNode.getComponent(cc.PhysicsPolygonCollider);
        comp.points = array2;
        comp.apply();
        cloneNode.getComponent(cut_item_1.default).draw();
    };
    /** 近似判断点在线上 */
    Main.prototype.pointInLine = function (point, start, end) {
        var dis = 1;
        return cc.Intersection.pointLineDistance(point, start, end, true) < dis;
    };
    __decorate([
        property(cc.Graphics)
    ], Main.prototype, "draw", void 0);
    __decorate([
        property(cc.Node)
    ], Main.prototype, "gameLayer", void 0);
    Main = __decorate([
        ccclass
    ], Main);
    return Main;
}(cc.Component));
exports.default = Main;

cc._RF.pop();