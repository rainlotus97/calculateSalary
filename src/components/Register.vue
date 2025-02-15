<template>
    <div class="register">
        <h3 style="text-align: center;">房间列表</h3>
        <div class="register_main">
            <van-button class="btn_item" :color="item.roomCleanState.roomColor" v-for="(item, index) in buttonList"
                :key="index" @click="editRoomState(item, index)">
                {{ item.roomNumber }}
            </van-button>
            <div class="btn_item edit_btn" v-if="editMode && showEdit">
                <van-swipe-cell>
                    <van-field class="edit_field" @blur="editBlur" v-model="inputValue" placeholder="请输入" />
                    <template #right>
                        <van-button square type="danger" text="删除" @click="cancelRoomEdit()" />
                    </template>
                </van-swipe-cell>
            </div>
            <van-button v-if="editMode" class="btn_item" plain color="#969799" @click="addNew">
                添加
            </van-button>
        </div>

        <div class="clear-all" v-show="!editMode">
            <van-cell-group inset>
                <van-button style="width: 100%;" type="primary" @click="createImage">生成图片</van-button>
                <van-button style="width: 100%;" type="success" @click="syncData">同步数据</van-button>
            </van-cell-group>
        </div>

        <div class="clear-all">
            <van-cell-group inset>
                <van-button :type="editMode ? 'primary' : 'danger'" style="width: 100%;" @click="changeEditMode">{{
                    editMode ? '退出编辑' : '进入编辑' }}</van-button>
                <van-button style="width: 100%;" type="warning" @click="resetAllState">重置状态</van-button>
                <van-button v-if="editMode" style="width: 100%;" type="danger" @click="clearAllState">清空全部</van-button>
            </van-cell-group>
        </div>

        <van-popup class="detail_popup" v-model:show="showCenter" round>
            <div class="show_state" v-if="!isShowTable">
                <van-button v-for="item, index in roomStateList" :key="index" :color="item.roomColor" size="large"
                    @click="selectState(item)"> {{ item.cleanState }}</van-button>
            </div>
            <div class="show_table" v-else>
                <StatusTable :list="buttonList"></StatusTable>
            </div>
        </van-popup>
    </div>
</template>
    
<script setup lang='ts'>
import { salaryStore } from '@/stores/Salary';
import { onMounted, ref } from 'vue';
import { RoomCleanState, RoomInfo, SalaryItem, getCurrentTime } from '@/common';
import { showToast } from 'vant';
const showEdit = ref(false);
const inputValue = ref('');
const currentSalaryStore = salaryStore();
const salaryList = currentSalaryStore.salaryFuncList;
const showCenter = ref(false);
const isShowTable = ref(false);
const roomStateList: RoomCleanState[] = [{
    roomState: 'NONE',
    cleanState: '默认',
    roomColor: '#969799',
}];
let currentShowRoom: RoomInfo = {
    roomNumber: '',
    roomCleanState: {
        roomState: 'NONE',
        cleanState: '默认',
        roomColor: '#969799',
    },
};
let currentIndex = 0;
salaryList.forEach((item: SalaryItem) => {
    roomStateList.push({
        roomState: item.key,
        cleanState: item.title,
        roomColor: item.color,
    });
});
let buttonList = ref<RoomInfo[]>(currentSalaryStore.roomList);
onMounted(() => {
    let currentDate = getCurrentTime();
    if (currentSalaryStore.date !== currentDate) {
        resetAllState()
    }
    // 列表按照房间号排序
    sortRoomList();
});

const resetAllState = () => {
    buttonList.value.forEach((item: RoomInfo) => {
        item.roomCleanState.roomState = 'NONE';
        item.roomCleanState.cleanState = '默认';
        item.roomCleanState.roomColor = '#969799';
    });
    showToast('重置成功');
};

const sortRoomList = () => {
    buttonList.value.sort((a, b) => {
        let aBaseList = a.roomNumber.split('-');
        let bBaseList = b.roomNumber.split('-');
        let aRoom = Number(aBaseList[1]);
        let bRoom = Number(bBaseList[1]);
        if (aBaseList[0] === bBaseList[0]) {
            return aRoom < bRoom ? -1 : 1;
        } else {
            return aBaseList[0] < bBaseList[0] ? -1 : 1;
        }
    });
};

const editMode = ref(false);

const editBlur = () => {
    if (!inputValue.value) {
        showEdit.value = false;
        return;
    }
    let findTarget = buttonList.value.find((item) => item.roomNumber === inputValue.value.toUpperCase());
    if (findTarget) {
        inputValue.value = '';
        showToast('房间已存在,请重新输入');
        return;
    }
    let roomInfo: RoomInfo = {
        roomNumber: inputValue.value.toUpperCase(),
        roomCleanState: {
            roomState: 'NONE',
            cleanState: '默认',
            roomColor: '#969799',
        },
    };
    buttonList.value.push(roomInfo);
    inputValue.value = '';
    showEdit.value = false;
    console.log('editBlur');
}

const cancelRoomEdit = () => {
    inputValue.value = '';
    showEdit.value = false;
    console.log('delRoomInfo', buttonList);
}
const addNew = () => {
    showEdit.value = true;
    console.log('addNew', roomStateList);
}

const editRoomState = (item: RoomInfo, index: number) => {
    if (editMode.value) {
        // 删除当前房间
        buttonList.value = buttonList.value.filter((room) => room.roomNumber !== item.roomNumber);
        return;
    }
    isShowTable.value = false;
    currentIndex = index;
    currentShowRoom = item;
    showCenter.value = true;
    console.log('editRoomState', item);
}

const changeEditMode = () => {
    editMode.value = !editMode.value;
    if (!editMode.value) {
        currentSalaryStore.setRoomList(buttonList.value);
        sortRoomList();
        return;
    }
    cancelRoomEdit();
}

const selectState = (item: RoomCleanState) => {
    currentShowRoom.roomCleanState = item;
    buttonList.value[currentIndex] = currentShowRoom;
    showCenter.value = false;
    console.log('selectState', item);
}

const createImage = () => {
    const isAllNotSet = buttonList.value.every((item) => item.roomCleanState.roomState === 'NONE');
    if (isAllNotSet) {
        showToast('请先设置房间状态');
        return;
    }
    isShowTable.value = true;
    showCenter.value = true;
    console.log('createImage', buttonList.value);
}

const syncData = () => {
    currentSalaryStore.syncFuncList(buttonList.value);
    showToast('同步成功');
}

const clearAllState = () => {
    buttonList.value=[]
    showToast('清空成功');
}
</script>
    
<style scoped lang="less">
.register {
    height: 100%;
    overflow: hidden;

    padding: 0 16px;
    padding-bottom: 50px;

    .register_main {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;


        .btn_item {
            width: 48%;
            margin: 8px 0;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            color: #fff;
            text-align: center;
        }

        .edit_btn {
            border: 1px solid #969799;
            background-color: #fff;
            color: #969799;
            border-radius: 4px;
            position: relative;

            // 下压效果，带动画效果，背景色灰色
            &:active {
                background-color: #f5f5f5;
            }

            .edit_field {
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }

            :deep(.van-swipe-cell) {
                height: 100%;
            }

            :deep(.van-swipe-cell__wrapper) {
                height: 100%;
            }

            :deep(.van-swipe-cell__right) {
                display: flex;
                height: 100%;
                align-items: center;
            }
        }
    }

    .clear-all {
        margin: 64px 0;

        :deep(.van-cell-group--inset) {
            margin: 0;
            display: flex;
            flex-wrap: wrap;
        }
    }

    .detail_popup {
        width: 90%;
        max-height: calc(100% - 32px);
        padding: 16px;
        overflow: auto;
        background-color: antiquewhite;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>
  