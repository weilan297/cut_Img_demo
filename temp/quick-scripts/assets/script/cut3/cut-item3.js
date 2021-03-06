(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/cut3/cut-item3.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0d1fdM7zAlC7brr06Fpq3Oi', 'cut-item3', __filename);
// script/cut3/cut-item3.ts

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
        var mask = this.getComponent(cc.Mask);
        // @ts-ignore
        var ctx = mask._graphics;
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
        //# sourceMappingURL=cut-item3.js.map
        