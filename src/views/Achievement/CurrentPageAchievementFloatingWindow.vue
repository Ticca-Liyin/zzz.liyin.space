<script setup>
import FloatingWindow from '@/components/FloatingWindow.vue';
import AchievementReward from './AchievementReward.vue';
import { useAchievementStore } from '@/stores/achievement';
import { useSettingStore } from '@/stores/achievementSetting'
import { useIsMobileStore } from '@/stores/isMobile'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia';

const achievementStore = useAchievementStore()
const { showAchievementSecondClass } = storeToRefs(achievementStore);

const settingStore = useSettingStore()
const { currentPageAchievementWindowDisplay } = storeToRefs(settingStore)

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
</script>

<template>
  <FloatingWindow v-show="currentPageAchievementWindowDisplay" :displayPosition="isMobile ? 'left' : 'right'">
    <div class="series-container">
      <div class="series">
        <div class="series-title">
          {{showAchievementSecondClass.Name}}
        </div>
        <div class="series-count">
          {{showAchievementSecondClass.completedAchievementsLength}} / {{showAchievementSecondClass.AchievementsLength}}
          <span v-if="showAchievementSecondClass.notAvailableAchievementsLengeh" class="series-count-not-available">+{{ showAchievementSecondClass.notAvailableAchievementsLengeh }}</span>
          ({{showAchievementSecondClass.completedPercentage}})
        </div>
        <div class="series-Polychrome">
          {{showAchievementSecondClass.completedPolychromeTotal}} / {{showAchievementSecondClass.PolychromeTotal}}
          <img :src="achievementStore.PolychromeImg" alt="星琼">
        </div>
        <AchievementReward :achievementSecondClass="showAchievementSecondClass" />
      </div>
      <!-- <div class="series-bg-image">
        <img :src="isDark ? showAchievementSecondClass.imageDarkPath : showAchievementSecondClass.imagePath" :alt="showAchievementSecondClass.Name">
      </div> -->
  </div>
  </FloatingWindow>
</template>

<style scoped>
.series-container{
    height: 100px;
    user-select: none;
    position: relative;
    padding: 0 10px;
    background-color: var(--liyin-ach-current-page-bg-color);
    color: var(--liyin-ach-current-page-text-color);
}
.series{
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 100px;
    height: 100px;
    line-height: 23px;
    text-align: center;
    position: relative;
    z-index: 2;
}
.series-title{
    font-size: 18px;
    font-weight: 800;
    white-space: nowrap;
}
.series-count{
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
}
.series-count-not-available{
    color: var(--liyin-ach-series-count-not-available-color); 
    font-weight: 400;
}
.series-Polychrome{
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 20px;
    font-size: 13px;
    white-space: nowrap;
}
.series-Polychrome img{
    width: 20px;
    height: 20px;
    margin: 0 5px;
    draggable: false;
    -webkit-user-drag: none;
}
.series-bg-image{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
.series-bg-image img{
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.6;
    draggable: false;
    -webkit-user-drag: none;
}

@media (max-width: 768px){
    .series-container{
      height: 75px;
    }
    .series{
        min-width: 80px;
        height: 75px;
        line-height: 18px;
    }
    .series-title{
        font-size: 15px;
        font-weight: 700;
    }
    .series-count{
        font-size: 13px;
        font-weight: 600;
    }
    .series-Polychrome{
        line-height: 14px;
        font-size: 11px;
    }
    .series-Polychrome img{
        width: 15px;
        height: 15px;
        margin: 0 5px;
    }
}
</style>