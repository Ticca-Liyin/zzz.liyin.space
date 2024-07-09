<script setup>
import { ArrowRight } from '@element-plus/icons-vue';
import { computed } from 'vue'
import { storeToRefs } from 'pinia';
import { useAchievementStore } from '@/stores/achievement';

const achievementStore = useAchievementStore();
const { achievementFirstClasses, showFirstClassId, showSecondClassId } = storeToRefs(achievementStore)

const props = defineProps({
  hadFold: Boolean
})
</script>

<template>
  <el-popover placement="right-start" popper-style="width: 80px;min-width: 80px; padding: 0;" rigger="click">
    <template #reference>
      <div class="achievement-first-class" :class="{'achievement-first-class-fold': hadFold }">
        <div class="achievement-first-class-name">{{ achievementFirstClasses[showFirstClassId]?.Name ?? '未知' }}</div> 
        <el-icon class="achievement-first-class-right">
          <ArrowRight />
        </el-icon>
      </div>
    </template>
    <RouterLink v-for="firstClass in achievementFirstClasses" :key="firstClass.Id" 
    :to="`/achievement/${firstClass.Id}/${showSecondClassId}`" v-preventDragStart="true">
      <div class="achievement-first-class-select-name" :class="{'selected': showFirstClassId === firstClass.Id}">{{ firstClass.Name }}</div>
    </RouterLink>
  </el-popover>
</template>

<style scoped>
.achievement-first-class {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 70px;
  border: 1px solid var(--liyin-button-border-color);
  border-radius: 7px;
  margin: 0 5px 0 10px;
  cursor: pointer;
  text-align: center;
}
.achievement-first-class-fold {
  height: 50px;
  font-size: 12px;
}
.achievement-first-class:hover {
  border: 1px solid var(--el-color-primary);

}

.achievement-first-class-name{
  /* width: 100%; */
  text-align: center;
  writing-mode: vertical-lr;
  color: var(--el-text-color-regular);
}

.achievement-first-class:hover .achievement-first-class-name {
  color: var(--el-color-primary);
}

.achievement-first-class-select-name {
  /* border-bottom: 1px solid #4C4D4F; */
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.achievement-first-class-select-name.selected {
  color: var(--el-color-primary);
}
.achievement-first-class-select-name:hover {
  background-color: var(--liyin-userinfo-hover-bg-color);
}

.achievement-first-class-right{
  padding-top: 5px;
  font-size: 13px;
}

.achievement-first-class:hover .achievement-first-class-right{
  color: var(--el-color-primary);
}

@media (max-width: 768px){
  .achievement-first-class{
    height: 60px;
  }
  .achievement-first-class-fold{
    height: 40px;
  }
  .achievement-first-class-right{
    padding-top: 3px;
    font-size: 11px;
  }
}
</style>