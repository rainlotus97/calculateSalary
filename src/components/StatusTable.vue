<template>
  <div class="container">
    <div ref="tableRef" class="status-table">
      <table>
        <thead>
          <tr>
            <th>房间号</th>
            <th v-for="state in cleanStates" :key="state">{{ state }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.roomNumber">
            <td>{{ item.roomNumber }}</td>
            <td v-for="state in cleanStates" :key="state">
              <template v-if="item.roomCleanState.cleanState === state && state !== '默认'">
                <div class="status-indicator" :style="{ background: item.roomCleanState.roomColor }"></div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <van-button style="width: 100%;" type="primary" @click="exportToImage">导出图片</van-button>
  </div>
</template>
  
<script setup lang="ts">
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'
import { getCurrentTime } from '@/common';

interface RoomCleanState {
  roomState: string
  cleanState: string
  roomColor: string
}

interface RoomInfo {
  roomNumber: string
  roomCleanState: RoomCleanState
}

const props = defineProps<{
  list: RoomInfo[]
}>()

// 获取所有可能的清洁状态（排除默认）
const cleanStates = computed(() => {
  const states = new Set<string>()
  props.list.forEach(item => {
    if (item.roomCleanState.cleanState !== '默认') {
      states.add(item.roomCleanState.cleanState)
    }
  })
  return Array.from(states)
})

const tableRef = ref<HTMLElement>()

// 导出为图片
const exportToImage = async () => {
  if (!tableRef.value) return

  const canvas = await html2canvas(tableRef.value, {
    backgroundColor: '#ffffff'
  })
  const link = document.createElement('a')
  link.download = `房间状态表${getCurrentTime()}.png`
  link.href = canvas.toDataURL()
  link.click()
}
</script>
  
<style scoped>
/* 新增移动端适配样式 */
.container {
  max-width: 100vw;
  padding: 10px;
}

.status-table {
  margin: 10px 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  /* 平滑滚动 */
}

table {
  min-width: 100%;
  table-layout: auto;
}

th,
td {
  min-width: 36px;
  /* 减小最小宽度 */
  padding: 8px;
  /* 减小内边距 */
  font-size: 14px;
  border: 1px solid #c4c5c6;
  text-align: center;
}

.status-indicator {
  width: 100%;
  height: 18px;
}
</style>
  