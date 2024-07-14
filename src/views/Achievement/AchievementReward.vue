<script setup>
import { useAchievementStore } from '@/stores/achievement';

const achievementStore = useAchievementStore()
const { GoldImg, SilverImg, CopperImg } = achievementStore;

defineProps({
    achievementSecondClass: Object
})
</script>

<template>
    <div class="series-reward">
        <div class="reward-box">
            <img :src="GoldImg" alt="金" class="reward-img">
            {{ achievementSecondClass.completedGoldAchievementsLength }}
        </div>
        <div class="reward-box">
            <img :src="SilverImg" alt="银" class="reward-img">
            {{ achievementSecondClass.completedSilverAchievementsLength }}
        </div>
        <div class="reward-box">
            <img :src="CopperImg" alt="铜" class="reward-img">
            {{ achievementSecondClass.completedCopperAchievementsLength }}
        </div>
    </div>
</template>

<style scoped>
.series-reward {
  display: flex;
  margin-top: 2px;
}
.reward-box {
  margin: 0 5px; 
  display: flex; 
  align-items: center;
  font-size: 13px;
}
.reward-img {
  width: 18px;
  height: 18px;
  margin-right: 2px;
  draggable: false;
  -webkit-user-drag: none;
}

@media (max-width: 768px){
    .series-reward {
      margin-top: 0px;
    }
    .reward-box {
      font-size: 11px;
    }
    .reward-img {
      width: 12px;
      height: 12px;
      margin-right: 1px;
    }
}
</style>