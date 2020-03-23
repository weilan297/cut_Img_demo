(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/cut2/cut-main2.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '30ea7WWIYNIJLspmVTxL0J5', 'cut-main2', __filename);
// script/cut2/cut-main2.ts

Object.defineProperty(exports, "__esModule", { value: true });
var cut_item2_1 = require("./cut-item2");
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
        var result1 = cc.director.getPhysicsManager().rayCast(point1, point2, cc.RayCastType.All);
        var result2 = cc.director.getPhysicsManager().rayCast(point2, point1, cc.RayCastType.All);
        // 将结果二的方向反过来，方便排序
        result2.forEach(function (r) {
            r.fraction = 1 - r.fraction;
        });
        // 将结果合并
        var results = result1.concat(result2);
        // cc.log(results);
        // 然后我们将结果按碰撞体进行分类
        var pairs = [];
        var _loop_1 = function (i) {
            var find = false;
            var result = results[i];
            for (var j = 0; j < pairs.length; j++) {
                var pair = pairs[j];
                // 以第一个点为参考，如果碰撞盒子是同一个，证明是一个物体
                if (pair[0] && result.collider === pair[0].collider) {
                    find = true;
                    // 移除同碰撞体内部的多余的点，成对位置相等（很近）
                    var r = pair.find(function (r) {
                        // 官方取的判断临界是根号 5，很小的距离来判断点的相等
                        return r.point.sub(result.point).magSqr() <= 5;
                    });
                    // 如果有非常近的点，跳过 push，然后把里面的删去
                    if (r) {
                        pair.splice(pair.indexOf(r), 1);
                    }
                    else {
                        pair.push(result);
                    }
                    break;
                }
            }
            if (!find) {
                pairs.push([result]);
            }
        };
        for (var i = 0; i < results.length; i++) {
            _loop_1(i);
        }
        // cc.log(pairs);
        // 接下来就是把每个碰撞体的点分别处理
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if (pair.length < 2) {
                continue;
            }
            // 根据远近，按顺序排队，这样每两个一组，不重复
            pair = pair.sort(function (a, b) {
                if (a.fraction > b.fraction) {
                    return 1;
                }
                else if (a.fraction < b.fraction) {
                    return -1;
                }
                return 0;
            });
            // cc.log(pair)
            // 将一个碰撞体上的所有点分成几个部分，比如两个交点就是两部分，四个交点就可能需要分成三部分
            var splitResults = [];
            // 每两个点一循环
            for (var j = 0; j < pair.length - 1; j += 2) {
                var r1 = pair[j];
                var r2 = pair[j + 1];
                if (r1 && r2) {
                    // 封装一个方法，将分割后的结果放入 splitResults 中
                    this.split(r1.collider, r1.point, r2.point, splitResults);
                }
            }
            if (splitResults.length <= 0) {
                continue;
            }
            // 根据结果创建碰撞体
            var collider = pair[0].collider;
            var maxPointsResult = void 0;
            for (var j = 0; j < splitResults.length; j++) {
                var splitResult = splitResults[j];
                for (var k = 0; k < splitResult.length; k++) {
                    if (typeof splitResult[k] === 'number') {
                        splitResult[k] = collider.points[splitResult[k]];
                    }
                }
                if (!maxPointsResult || splitResult.length > maxPointsResult.length) {
                    maxPointsResult = splitResult;
                }
            }
            // 分割结果不构成图形
            if (maxPointsResult.length < 3) {
                continue;
            }
            // 设置本体
            collider.points = maxPointsResult;
            collider.apply();
            collider.node.getComponent(cut_item2_1.default).draw();
            // 克隆 N 个
            for (var j = 0; j < splitResults.length; j++) {
                var splitResult = splitResults[j];
                if (splitResult.length < 3)
                    continue;
                if (splitResult == maxPointsResult)
                    continue;
                // 克隆本体作为第 N 个
                var cloneNode = cc.instantiate(collider.node);
                this.gameLayer.addChild(cloneNode);
                var comp = cloneNode.getComponent(cc.PhysicsPolygonCollider);
                comp.points = splitResult;
                comp.apply();
                cloneNode.getComponent(cut_item2_1.default).draw();
            }
        }
    };
    Main.prototype.split = function (collider, point1, point2, splitResults) {
        var body = collider.body;
        var points = collider.points;
        // 转化为本地坐标
        var localPoint1 = cc.Vec2.ZERO;
        var localPoint2 = cc.Vec2.ZERO;
        body.getLocalPoint(point1, localPoint1);
        body.getLocalPoint(point2, localPoint2);
        var newSplitResult1 = [localPoint1, localPoint2];
        var newSplitResult2 = [localPoint2, localPoint1];
        // 同教程第一部分，寻找下标
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
        // cc.log(`点1下标${index1}`);
        // cc.log(`点2下标${index2}`);
        var splitResult = undefined;
        var indiceIndex1 = index1;
        var indiceIndex2 = index2;
        // 检测重叠部分，如果有重叠部分，证明有另外一部分属于新的碰撞体，将其切割出来
        if (splitResults.length > 0) {
            for (var i = 0; i < splitResults.length; i++) {
                var indices = splitResults[i];
                indiceIndex1 = indices.indexOf(index1);
                indiceIndex2 = indices.indexOf(index2);
                if (indiceIndex1 !== -1 && indiceIndex2 !== -1) {
                    splitResult = splitResults.splice(i, 1)[0];
                    break;
                }
            }
        }
        // 如果没有重叠，可以将碰撞体所有点装入
        if (!splitResult) {
            splitResult = points.map(function (p, i) {
                return i;
            });
        }
        // 分割开两部分，不同于教程一的变量控制做法，这次利用循环走一圈，走到点 2，再从点 2 往点 1 走
        for (var i = indiceIndex1 + 1; i !== (indiceIndex2 + 1); i++) {
            if (i >= splitResult.length) {
                i = 0;
            }
            var p = splitResult[i];
            // 如果是下标，读数组
            p = typeof p === 'number' ? points[p] : p;
            if (p.sub(localPoint1).magSqr() < 5 || p.sub(localPoint2).magSqr() < 5) {
                continue;
            }
            newSplitResult2.push(splitResult[i]);
        }
        for (var i = indiceIndex2 + 1; i !== indiceIndex1 + 1; i++) {
            if (i >= splitResult.length) {
                i = 0;
            }
            var p = splitResult[i];
            p = typeof p === 'number' ? points[p] : p;
            if (p.sub(localPoint1).magSqr() < 5 || p.sub(localPoint2).magSqr() < 5) {
                continue;
            }
            newSplitResult1.push(splitResult[i]);
        }
        // 两个方向遍历完毕，装入结果
        splitResults.push(newSplitResult1);
        splitResults.push(newSplitResult2);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=cut-main2.js.map
        