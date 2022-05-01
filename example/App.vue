<template>
<section
    id="app"
    style="display: grid; grid-template-columns: 15em auto; column-gap: 1em;"
    >
    <form style="display: flex; flex-direction: column;">
        <p style="margin: 0px 0px 0.5em;">
            Size:
            <button
                type="button"
                @click="maxSize = Math.max(maxSize - 20, 200)"
                v-text="'-'"
                />
            <button
                type="button"
                title="Reset"
                @click="maxSize = 480"
                v-text="'•'"
                />
            <button
                type="button"
                @click="maxSize += 20"
                v-text="'+'"
                />
        </p>
        <p style="margin: 0px 0px 0.5em;">
            Stones:
            <button
                type="button"
                title="Reset"
                @click="signMap = JSON.parse(JSON.stringify(rawSignMap))"
                v-text="'•'"
                />
        </p>
        <div>
            <template v-for="(c, i) in checkBoxs">
                <label
                    style="display: flex; align-items: center;"
                    :key="i"
                    >
                    <input
                        type="checkbox"
                        style="marginRight: .5em;"
                        :value="c.stateKey"
                        v-model="checkedNames"
                        >
                    <span
                        style="user-select: none;"
                        v-text="c.text"
                        />
                </label>
            </template>
        </div>
        <h3>玩家列表</h3>
        <p></p>
        <div class="userList" v-if="playUserList && playUserList.length > 0">
            <div class="user" v-for="(item, index) in playUserList" :key="index">
                <span>
                    玩家: {{ item.userId }}
                </span>
                <span>
                    <button id="invite" @click="invite(item.userId)">邀请</button>
                </span>
            </div>
        </div>
    </form>
    
    <Goban
        :max-width="maxSize"
        :max-height="maxSize"
        :animate="true"
        :busy="isBusy"
        :range-x="showCorner ? [8, 18] : undefined"
        :range-y="showCorner ? [12, 18] : undefined"
        :coord-x="alternateCoordinates ? chineseCoordx : undefined"
        :coord-y="alternateCoordinates ? chineseCoordy : undefined"
        :sign-map="signMap"
        :show-coordinates="showCoordinates"
        :fuzzy-stone-placement="fuzzyStonePlacement"
        :animate-stone-placement="animateStonePlacement"
        :paint-map="showPaintMap ? paintMap : undefined"
        :heat-map="showHeatMap ? heatMap : undefined"
        :marker-map="showMarkerMap ? markerMap : undefined"
        :ghost-stone-map="showGhostStones ? ghostStoneMap : undefined"
        :lines="showLines ? [
            {type: 'line', v1: [15, 6], v2: [12, 15]},
            {type: 'arrow', v1: [10, 4], v2: [5, 7]}
        ] : []"
        :dimmed-map="showDimmedStones ? dimmedMap : []"
        :selected-map="showSelection ? selectedMap : []"
        @click="onVertexClick"
        />
    
</section>
</template>

<script>
import Goban from '../src/components/Shudan';
import {initPan, notifyBoard, stone_down, play} from '../src/js/play';

const chineseCoordx = [
    '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九'
];

const chineseCoordy = [...Array(19)].map((_, i) => i);

const rawSignMap = (() => {
    let arr = new Array(19);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(19).fill(0);
    }
    return arr;
})();

const BoradSize = 19;

const paintMap = (() => {
    let arr = new Array(19);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(19).fill(0);
    }
    return arr;
})();

const heatMap = (() => {
    let _ = null;
    let O = (strength, text) => ({ strength, text });

    return [
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, O(7), O(9, '80%\n13.5k'), _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, O(3), _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,                                                                                                                
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, O(2), _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, O(1, '20%\n111'), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, O(5, '67%\n2315'), O(4), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _
    ];
})();

const markerMap = (() => {
    let _ = null;
    let O = { type: 'circle' };
    let X = { type: 'cross' };
    let T = { type: 'triangle' };
    let Q = { type: 'square' };
    let $ = { type: 'point' };
    let S = { type: 'loader' };
    let L = label => ({ type: 'label', label });
    let A = L('a');
    let B = L('b');
    let C = L('c');

    return [
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, O, O, O, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, X, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, X, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, X, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, T, T, T, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, $, $, $, _, _, _, _, _, _, _, _, _, _, _, S, S, S, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, Q, _, _, _, _, _, _, _, _, _, L('Long\nlabel with linebreak'),
        // _, _, _, _, _, _, _, _, Q, _, _, _, _, _, _, _, _, _, C,
        // _, _, _, _, _, _, _, _, Q, _, _, _, _, _, _, _, _, _, B,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, A
    ];
})();

const ghostStoneMap = (() => {
    let _ = null;
    let O = t => ({ sign: -1, type: t });
    let X = t => ({ sign: 1, type: t });
    let o = t => ({ sign: -1, type: t, faint: true });
    let x = t => ({ sign: 1, type: t, faint: true });

    // return [
        // X(), x(), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // O(), o(), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // X('good'), x('good'), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // X('interesting'), x('interesting'), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // X('doubtful'), x('doubtful'), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // X('bad'), x('bad'), _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,
        // _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _
    // ];
    let arr = new Array(19);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(19).fill(null);
    }
    arr[0][0] = X();
    arr[1][0] = O();
    return arr;
})();

const dimmedMap = (() => {
    let arr = new Array(19);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(19).fill(false);
    }
    return arr;
})();
[[2, 14], [2, 13], [5, 13], [6, 13], [9, 3], [9, 5],
 [10, 5], [14, 7], [13, 13], [13, 14], [18, 13]].forEach(([x, y]) => {
    //  const offset = y * 19 + x;
     dimmedMap[y][x] = true;
 });

const selectedMap = (() => {
    let arr = new Array(19);
    for(let i = 0; i < arr.length; i++) {
        arr[i] = new Array(19).fill(false);
    }
    return arr;
})();
[[9, 7], [9, 8], [10, 7], [10, 8]].forEach(([x, y]) => {
    // const offset = y * 19 + x;
    selectedMap[y][x] = true;
});

function uuid() {
    var s = [];
    var hexDigits = "0123456789";
    for (var i = 0; i < 4; i++) {
        s[i] = hexDigits.charAt(Math.floor(Math.random() * 10));
    }
    // s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    // s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    // s[8] = s[13] = s[18] = s[23] = "-";
 
    var uuid2 = s.join("");
    return uuid2;
}
//自己的id
let globalId = uuid();
var toUserId = '';


var socketUrl="ws://192.168.0.8:8081/imserver/"+ globalId;
var socket = new WebSocket(socketUrl);

export default {
    name: 'App',
    components: {
        Goban
    },

    data: function () {
        return {
            signMap: undefined,
            maxSize: 480,
            showCoordinates: false,
            alternateCoordinates: false,
            showCorner: false,
            showDimmedStones: false,
            fuzzyStonePlacement: false,
            animateStonePlacement: false,
            showPaintMap: true,
            showHeatMap: false,
            showMarkerMap: false,
            showGhostStones: false,
            showLines: false,
            showSelection: false,
            isBusy: false,
            rawSignMap,
            chineseCoordx,
            chineseCoordy,
            paintMap,
            heatMap,
            markerMap,
            ghostStoneMap,
            dimmedMap,
            selectedMap,
            checkedNames: [],
            curAction: 1,     //当前行动方，落子方，balck:1 ，white: -1。
            playUserList: [],
        };
    },
    mounted() {           
        this.maxSize = (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
        console.log('rawSignMap: ' + this.rawSignMap);
        this.signMap = this.rawSignMap;
        this.connectWebsocket(this.actionGo2, this.handleMessage);
    },
    methods: {
        onVertexClick: function (offset) {
            // offset: 在棋盘上的位置，棋盘抽象为1维数组。0 - 361.
            console.log('onVertexClick offset: ' + offset);
            this.actionGo(offset);
        },
        actionGo(offset) {
            let x = Math.floor(offset / BoradSize);
            let y = offset % BoradSize;
            play(this.rawSignMap, x, y);
            this.signMap = JSON.parse(JSON.stringify(rawSignMap));
            const msg = {};
            msg.message_type = 'paly_action';
            msg.x = x;
            msg.y = y;
            msg.toUserId = this.toUserId;
            if (this.toUserId) {
                this.sendCommonMessage(msg);
            } else {
                console.warn('当前没有对战玩家！');
            }
        },
        actionGo2(offset) {
            let x = Math.floor(offset / BoradSize);
            let y = offset % BoradSize;
            play(this.rawSignMap, x, y);
            this.signMap = JSON.parse(JSON.stringify(rawSignMap));
        },
        //处理消息
        handleMessage(msg) {
            const msgType = msg.message_type;
            switch(msgType) {
                case 'play_on_line':
                    const ulist = JSON.parse(msg.playUserList);
                    if (msg.playUserList && ulist.length > 0) {
                        this.playUserList = [];
                        this.playUserList = ulist;
                    }
                    break;
                case 'play_receive_invite':
                    console.log('收到对局邀请 开始对局');
                    this.toUserId = msg.fromUserId;
                    break;
                case 'connection_success':
                    console.log('连接服务端成功');
                    break;
                case 'paly_action':
                    let x = msg.x;
                    let y = msg.y;
                    const index = Number.parseInt(x) * BoradSize + Number.parseInt(y);
                    this.actionMove(index);
                    break;
                default:
                    console.warn('unkow_message_type');
                    break;
            }
        },
        createInitBoard() {
            let arr = [];
            for(let i = 0; i < BoradSize; i++) {
                for(let j = 0; j < BoradSize; j++) {
                    arr[i][j] = 0;
                }
            }
            return arr;
        },
        connectWebsocket(actionMove, handleMessage) {
            if(typeof(WebSocket) == "undefined") {
                console.log("您的浏览器不支持WebSocket");
            }else{
                console.log("您的浏览器支持WebSocket");
                
                //打开事件
                socket.onopen = function() {
                    console.log("websocket已打开");
                    //socket.send("这是来自客户端的消息" + location.href + new Date());
                };
                //获得消息事件
                socket.onmessage = function(msg) {
                    console.log('onmessage');
                    console.log(msg);
                    handleMessage(JSON.parse(msg.data));
                };
                //关闭事件
                socket.onclose = function() {
                    console.log("websocket已关闭");
                };
                //发生了错误事件
                socket.onerror = function() {
                    console.log("websocket发生了错误");
                }
            }
        },
        sendMessage(x, y) {
            let index = x + ',' + y;
            if(typeof(WebSocket) == "undefined") {
                console.log("您的浏览器不支持WebSocket");
            }else {
                console.log("您的浏览器支持WebSocket");
                if (this.toUserId) {
                    console.log('{"toUserId":"'+"#toUserId"+'","index":"'+ index + '"}');
                    socket.send('{"toUserId":"' + toUserId + '","index":"'+ index  + '"}');
                } else {
                    console.warn('当前没有对战玩家！');
                }
            }
        },
        //发送通用消息
        sendCommonMessage(message) {
            if(typeof(WebSocket) == "undefined") {
                console.log("您的浏览器不支持WebSocket");
            }else {
                console.log("您的浏览器支持WebSocket");
                if (socket) {
                    socket.send(JSON.stringify(message));
                } else {
                    console.error('socket not init!');
                }
            }
        },
        //邀请玩家进行对战
        invite(userId) {
            const msg = {};
            msg.message_type = 'play_receive_invite';
            msg.toUserId = userId;
            msg.fromUserId = globalId;
            toUserId = userId;
            this.sendCommonMessage(msg);
            //暂时强制对战
        }
    },

    computed: {
        checkBoxs: function () {
            return [
                { stateKey: 'showCoordinates', text: 'Show coordinates' },
                { stateKey: 'alternateCoordinates', text: 'Alternate coordinates' },
                { stateKey: 'showCorner', text: 'Show lower right corner only' },
                { stateKey: 'showDimmedStones', text: 'Dim dead stones' },
                { stateKey: 'fuzzyStonePlacement', text: 'Fuzzy stone placement' },
                { stateKey: 'animateStonePlacement', text: 'Animate stone placement' },
                { stateKey: 'showMarkerMap', text: 'Show markers' },
                { stateKey: 'showGhostStones', text: 'Show ghost stones' },
                { stateKey: 'showPaintMap', text: 'Show paint map' },
                { stateKey: 'showHeatMap', text: 'Show heat map' },
                { stateKey: 'showLines', text: 'Show lines' },
                { stateKey: 'showSelection', text: 'Show selection' },
                { stateKey: 'isBusy', text: 'Busy' }
            ];
        }
    },

    watch: {
        checkedNames: function () {
            let { checkBoxs, checkedNames } = this;
            checkBoxs.map((value) => {
                let { stateKey } = value;
                let newState = checkedNames.indexOf(stateKey) > -1 ? true : false;
                if (this[stateKey] != newState)
                    this[stateKey] = newState;
            });
        }
    }
};
</script>


<style>
body {
    font-family: "Segoe UI", Ubuntu, Helvetica, Arial, sans-serif;
    align-self: center;
}
#app {
    display: flex;
    text-align: center;
    flex-direction: column;
    margin: auto;
}
</style>
