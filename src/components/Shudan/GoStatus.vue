
/**
    对战状态View

 */

<template>
    <div class="main">
        <div class="left">
            <div class="headView">
                <img src="http://img.jandan.net/news/2019/01/f71cfb3c5b133b1199de39fcfb41ac8c.jpg" alt="" class="headImg">
            </div>
            
            <div class="textInfo">
                <div class="userInfo">
                    <div class="name">
                        围棋精灵
                    </div>
                    <div class="level">
                            9段
                    </div>
                </div>
                <div class="timeTips">
                    <div class="globalTime">
                    55:59
                    </div>
                    <div class="times">
                    3次
                    </div>
                    <div class="secs">
                        120s
                    </div>
                </div>
            </div>
        </div>

        <div class="center">
            中心
        </div>

        <div class="right">
            右边
        </div>
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            defaultHeadUrl: 'https://i0.hdslb.com/bfs/archive/ed6f9458646b71008fc74d65495fd9782936a5da.jpg@320w_200h_1c.webp'
        }
    },
    mounted: {

    }
}
</script>

<style scoped>
    .main {
        height: 100px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .headView {
        height: 100px;
        width: 100px;
        border: 2.5px solid white;
        border-radius: 2px 2px 2px 2px;
        background: black;
    }
    .headImg {
        height: 100px;
        width: 100px;
    }
    .globalTime {
        height: 25px;
        width: 50px;
        color: #f5ff54;
        border: 4px solid #f5ff54;
        border-radius: 2px 2px 2px 2px;
    }
    .left {
        flex: 4;
        border: 2.5px solid blue;
        border-radius: 2px 2px 2px 2px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .center {
        width: 100px;
        border: 2.5px solid blue;
        border-radius: 2px 2px 2px 2px;
    }
    .right {
        flex: 4;
        border: 2.5px solid blue;
        border-radius: 2px 2px 2px 2px;
    }
    .timeTips {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .userInfo {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-left: 5px;
        margin-right: 5px;
        margin-top: 10px;
    }
    .textInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 10px;
    }
</style>