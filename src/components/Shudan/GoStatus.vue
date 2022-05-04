
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
                        <div style="color: #ef9456">55:59</div>
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
            <div class="headView">
                <img src="http://img.jandan.net/news/2019/01/f71cfb3c5b133b1199de39fcfb41ac8c.jpg" alt="" class="headImg">
            </div>
            
            <div class="textInfo">
                <div class="userInfoRight">
                    <div class="name">
                        围棋精灵
                    </div>
                    <div class="level">
                            9段
                    </div>
                </div>
                <div class="timeTipsRight">
                    <div class="globalTime">
                        <div style="color: #ef9456">55:59</div>
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
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            defaultHeadUrl: 'https://i0.hdslb.com/bfs/archive/ed6f9458646b71008fc74d65495fd9782936a5da.jpg@320w_200h_1c.webp'
        }
    }
}
</script>

<style scoped>
    .main {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .headView {
        height: 35px;
        width: 35px;
        border: 2.5px solid white;
        border-radius: 2px 2px 2px 2px;
        background: black;
    }
    .headImg {
        height: 35px;
        width: 35px;
    }
    .globalTime {
        height: 15px;
        width: 40px;
        color: #f5ff54;
        border: 2px solid #f5ff54;
        border-radius: 5px 5px 5px 5px;
        text-align: center;
        line-height: 15px;
    }
    .left {
        border: 1px solid blue;
        border-radius: 2px 2px 2px 2px;
        flex-basis: 40%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        flex-grow: 1;
        align-items: flex-start;
    }
    .center {
        width: 100px;
        flex-basis: 10%;
        margin: 0px 5px 0px 5px;
        border: 1px solid blue;
        border-radius: 2px 2px 2px 2px;
    }
    .right {
        display: flex;
        flex-direction: row-reverse;
        border: 1px solid blue;
        border-radius: 2px 2px 2px 2px;
        flex-basis: 40%;
        flex-grow: 1;
    }
    .timeTips {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        font-size: 13px;
        text-align: center;
        align-items: flex-end;
        margin-top: 5px;
    }
    .timeTipsRight {
        display: flex;
        flex-direction: row-reverse;
        flex-wrap: nowrap;
        font-size: 13px;
        text-align: center;
        align-items: flex-end;
        margin-top: 5px;
    }
    .userInfo {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-right: 5px;
        margin-top: 2px;
    }
    .userInfoRight {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        margin-right: 5px;
        margin-top: 2px;
    }
    .textInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 5px;
        font-size: 15px;
    }
    .times {
        margin: 0px 3px 0px 3px;
    }
</style>