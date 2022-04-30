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
        };
    },
    mounted() {           
        this.maxSize = (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
        console.log('rawSignMap: ' + this.rawSignMap);
        this.signMap = this.rawSignMap;
    },
    methods: {
        onVertexClick: function (offset) {
            // offset: 在棋盘上的位置，棋盘抽象为1维数组。0 - 361.
            console.log('onVertexClick offset: ' + offset);
            console.log('signMap: ' + this.signMap);
            let x = Math.floor(offset / BoradSize);
            let y = offset % BoradSize;
            play(this.rawSignMap, x, y);
            this.signMap = JSON.parse(JSON.stringify(rawSignMap));
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
        index2IndexArray(offset) {
            let arr = new Array(2);
            arr[0] = offset / BoradSize;
            arr[1] = offset % BoradSize;
            return arr;
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
    flex-direction: row;
    margin: auto;
}
</style>
