"use strict";
cc._RF.push(module, 'a0655ZkMrdLto1xwbrPDqfA', 'cut-item');
// script/cut/cut-item.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Item.prototype.onLoad = function () {
        this.draw();
    };
    Item.prototype.draw = function () {
        var points = this.getComponent(cc.PhysicsPolygonCollider).points;
        var ctx = this.getComponent(cc.Graphics);
        ctx.clear();
        var len = points.length;
        ctx.moveTo(points[len - 1].x, points[len - 1].y);
        for (var i = 0; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.fill();
    };
    Item = __decorate([
        ccclass
    ], Item);
    return Item;
}(cc.Component));
exports.default = Item;

cc._RF.pop();