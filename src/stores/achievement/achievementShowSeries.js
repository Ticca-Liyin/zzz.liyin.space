import { nextTick, computed, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAchievementStore } from '@/stores/achievement/achievement'

/**
 * 当前展示的一/二级分类导航态（对应 HSR 的 showSeries）
 * 一级 ALL 成就集由 achievement 数据核预建（Id = firstClassId）
 */
export const useAchievementShowSeriesStore = defineStore('achievementShowSeries', () => {
    const achievementStore = useAchievementStore();
    const {
        achievements,
        achievementSecondClasses,
        achievementFirstClasses,
        achievementFirstClassAllSecondClasses,
    } = storeToRefs(achievementStore);

    const urlFirstClassId = ref(0)
    const showFirstClassId = computed(() => {
        return achievementFirstClasses.value[urlFirstClassId.value]?.Id ?? 0
    })

    // 当前一级 ALL（数据核预建）
    const currentAllSecondClass = computed(() =>
        achievementFirstClassAllSecondClasses.value[showFirstClassId.value]
    )

    const showAchievementSecondClasseses = computed(() => {
        const all = currentAllSecondClass.value
        const head = all ? [all] : []
        if (showFirstClassId.value === 0) {
            return [...head, ...achievementSecondClasses.value]
        }
        return [
            ...head,
            ...achievementSecondClasses.value.filter(sc => sc.FirstClassId === showFirstClassId.value),
        ]
    })

    const urlSecondClassId = ref(0)
    const showSecondClassId = computed(() => {
        // 无效二级：回退到当前一级 ALL（Id === firstId）
        if (!showAchievementSecondClasseses.value.some(SecondClass => SecondClass.Id === urlSecondClassId.value)) {
            return showFirstClassId.value
        }
        return urlSecondClassId.value
    })

    const isShowAllSecondClass = computed(() =>
        showSecondClassId.value === showFirstClassId.value
    )

    const changeShowSecondClassID = (firstClassId, secondClassID) => {
        urlFirstClassId.value = parseInt(firstClassId)
        urlSecondClassId.value = parseInt(secondClassID)
    }

    watch(showSecondClassId, () => {
        const achievementMain = document.getElementById('achievement-main-scroller')
        nextTick(() => {
            if (achievementMain) achievementMain.scrollTop = 0
        })
    })

    //当前显示的系列全部成就（未筛选）
    const showSeriesAllAchievements = computed(() => {
        if (isShowAllSecondClass.value) {
            return currentAllSecondClass.value?.Achievements ?? achievements.value
        }
        const tempSecondClass = achievementSecondClasses.value.find(SecondClass => SecondClass.Id === showSecondClassId.value)
        if (!tempSecondClass) return achievements.value
        return tempSecondClass.Achievements
    })

    return {
        urlFirstClassId,
        showFirstClassId,
        currentAllSecondClass,
        isShowAllSecondClass,
        showAchievementSecondClasseses,
        urlSecondClassId,
        showSecondClassId,
        changeShowSecondClassID,
        showSeriesAllAchievements,
    }
})
