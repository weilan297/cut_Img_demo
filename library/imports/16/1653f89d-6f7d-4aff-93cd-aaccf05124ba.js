"use strict";
cc._RF.push(module, '1653fidb31K/5PNqszwUSS6', 'physic-setting');
// script/physic-setting.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        isOpen: {
            default: true,
            displayName: '开启物理系统'
        },
        isDraw: {
            default: true,
            displayName: '开启物理绘制'
        }
    },

    onLoad: function onLoad() {
        if (this.isOpen) {
            cc.director.getPhysicsManager().enabled = true;
        }
        if (this.isDraw) {
            cc.director.getPhysicsManager().debugDrawFlags =
            // cc.PhysicsManager.DrawBits.e_aabbBit |
            // cc.PhysicsManager.DrawBits.e_pairBit |
            // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
            cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;
        }
    }
});

cc._RF.pop();