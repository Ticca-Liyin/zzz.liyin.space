import { computed, watch, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAchievementFelterStore } from '@/stores/achievement/felter/achievementFelter'
import { useAchievementShowSeriesStore } from '@/stores/achievement/achievementShowSeries'
import { AchievementSecondClass } from '@/types/achievementSecondClass'

export const useShowAchievementsStore = defineStore('showAchievements', () => {
    const achievementShowSeriesStore = useAchievementShowSeriesStore()
    const { showSeriesAllAchievements } = storeToRefs(achievementShowSeriesStore)

    const achievementFelterStore = useAchievementFelterStore();
    const {
        showHiddenType, showRewardType, showCompletedType, showBranchType,
        showAvailableType, showVersionList, searchContent, incompletePriority,
    } = storeToRefs(achievementFelterStore);

    const showAchievements = computed(() => {
        let tempShowAchievements = showSeriesAllAchievements.value.filter(achievement =>{
            // 隐藏类成就筛选
            if(showHiddenType.value !== 'all') {
                if(showHiddenType.value === 'hidden'){
                    if(!achievement.isHidden)
                        return false
                }
                else if(showHiddenType.value === 'unhidden'){
                    if(achievement.isHidden)
                        return false
                }
            }

            // 奖励类成就筛选
            if(showRewardType.value !== 'all') {
                if(showRewardType.value === 'gold'){
                    if(achievement.Reward != 3)
                        return false
                }
                else if(showRewardType.value === 'silver'){
                    if(achievement.Reward != 2)
                        return false
                }
                else if(showRewardType.value === 'copper'){
                    if(achievement.Reward != 1)
                        return false
                }
            }

            // 完成程度类成就筛选
            if(showCompletedType.value !== 'all') {
                if(showCompletedType.value === 'completed'){
                    if(achievement.Status === 1)
                        return false
                }
                else if(showCompletedType.value === 'uncompleted'){
                    if(achievement.Status !== 1)
                        return false
                }
            }

            // 分支类成就筛选
            if(showBranchType.value !== 'all') {
                if(showBranchType.value === 'single'){
                    if(achievement.MultipleID)
                        return false
                }
                else if(showBranchType.value === 'multiple'){
                    if(!achievement.MultipleID)
                        return false
                }
            }

            // 获取状态类成就筛选
            if(showAvailableType.value !== 'all') {
                if(showAvailableType.value === 'available'){
                    if(achievement.CustomNotAchieved || achievement.isNotAvailable)
                        return false
                }
                else if(showAvailableType.value === 'not-available'){
                    if(!achievement.CustomNotAchieved && !achievement.isNotAvailable)
                        return false
                }
            }

            //版本筛选
            if(showVersionList.value.length > 0)
                if(!showVersionList.value.includes(achievement.Version))
                    return false

            //搜索框筛选
            if(!achievement.Name.includes(searchContent.value) &&
            !achievement.Desc.includes(searchContent.value))
                return false

            return true
        })

        //未完成成就优先
        if(incompletePriority.value)
            tempShowAchievements = [...tempShowAchievements].sort((a, b) => {
                if(a.Status === 1 && b.Status !== 1) return -1
                if(a.Status !== 1 && b.Status === 1) return 1
                return 0
            })
        return tempShowAchievements
    })

    // 当前筛选后的本页列表是否含多选一成就
    const pageHasMultipleChoice = computed(() =>
        showAchievements.value.some(achievement => achievement?.MultipleID)
    )

    const showAchievementSecondClass = ref(
        new AchievementSecondClass({
            Id: 99,
            Name: '本页成就',
            FirstClassId: 0,
            Priority: -1
        }, showAchievements.value)
    )

    watch(showAchievements, () => showAchievementSecondClass.value.updateAchievements(showAchievements.value))

    return {
        showAchievements,
        pageHasMultipleChoice,
        showAchievementSecondClass
    }
})
