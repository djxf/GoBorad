<template>
    
    <div class="main">
        <div class="title">玩家列表</div>
        <div class="userList" v-if="playUserList && playUserList.length > 0">
            <div class="user" v-for="(item, index) in playUserList" :key="index">
                <span>
                    玩家: {{ item.userId }}
                </span>
                <span style="margin-left: 5px">
                    在线
                </span>
                <span style="margin-left: 5px">
                    <button id="invite" @click="invite(item.userId)" type="button">邀请</button>
                </span>
            </div>
        </div>
    </div>
</template>


<script>

export default {
    props: {
        playUserList: Array,
        default: []
    },
    methods: {
        //邀请玩家进行对战,下围棋
        invite(userId) {
            this.$emit('invite', userId);
        },
    }
}
</script>

<style scoped>
    .main {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 10px;
    }
    .title {
        font-size: 20px;
        margin-bottom: 10px;
        margin-top: 10px;
    }
    .user {
        margin-top: 8px;
    }
</style>