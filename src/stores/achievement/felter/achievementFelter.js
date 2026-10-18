import { computed, watch, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAchievementSelectVersionListStore } from '@/stores/achievement/felter/achievementSelectVersionList'
import { useAchievementShowSeriesStore } from '@/stores/achievement/achievementShowSeries'
import { useAchievementSettingStore } from '@/stores/achievement/setting/achievementSetting'

const ACHIEVEMENT_FILTER_CONFIG_KEY = 'zzz-AchievementFilterConfig'

export const useAchievementFelterStore = defineStore('achievementFelter', () => {
    const achievementSelectVersionListStore = useAchievementSelectVersionListStore()
    const { selectVersionListCache } = storeToRefs(achievementSelectVersionListStore)

    const achievementShowSeriesStore = useAchievementShowSeriesStore()
    const { showSecondClassId } = storeToRefs(achievementShowSeriesStore)

    const settingStore = useAchievementSettingStore()
    const { achievementFilterCacheConfig } = storeToRefs(settingStore)

    //显示版本列表
    const showVersionList = ref([])
    //可选择版本列表
    const selectVersionList = computed(() => {
        return selectVersionListCache.value[showSecondClassId.value]
    })
    //搜索文本
    const searchContent = ref('')
    //隐藏类成就筛选
    const showHiddenType = ref('all')
    const selectHiddenList = [
        { value: 'all', label: '全部' },
        { value: 'hidden', label: '隐藏' },
        { value: 'unhidden', label: '非隐藏' }
    ]
    //奖励类成就筛选
    const showRewardType = ref('all')
    const selectRewardList = [
        { value: 'all', label: '全部' },
        { value: 'gold', label: '金' },
        { value: 'silver', label: '银' },
        { value: 'copper', label: '铜' }
    ]
    //完成程度类成就筛选
    const showCompletedType = ref('all')
    const selectCompletedList = [
        { value: 'all', label: '全部' },
        { value: 'completed', label: '已完成' },
        { value: 'uncompleted', label: '未完成' }
    ]

    //显示分支类成就筛选
    const showBranchType = ref('all')
    const selectBranchList = [
        { value: 'all', label: '全部' },
        { value: 'single', label: '普通' },
        { value: 'multiple', label: '多选一' }
    ]

    //获取状态类成就筛选
    const showAvailableType = ref('all')
    const selectAvailableList = [
        { value: 'all', label: '全部' },
        { value: 'available', label: '可获取' },
        { value: 'not-available', label: '暂不可获取' }
    ]

    // 是否启用筛选功能
    const hadFilter = computed(() => {
        return showHiddenType.value !== 'all' || showRewardType.value !== 'all' || showCompletedType.value !== 'all' || showBranchType.value !== 'all' || showAvailableType.value !== 'all'
    })

    //未完成优先
    const incompletePriority = ref(false)

    //获取成就界面筛选设置缓存
    const getAchievementFilterConfig = () => {
        if(!achievementFilterCacheConfig.value) return

        const tempAchievementFilter = localStorage.getItem(ACHIEVEMENT_FILTER_CONFIG_KEY)

        if (tempAchievementFilter !== null) {
            const data = JSON.parse(tempAchievementFilter)

            showHiddenType.value = data?.showHiddenType ?? 'all'
            showRewardType.value = data?.showRewardType ?? 'all'
            showCompletedType.value = data?.showCompletedType ?? 'all'
            showBranchType.value = data?.showBranchType ?? 'all'
            showAvailableType.value = data?.showAvailableType ?? 'all'
            incompletePriority.value = data?.incompletePriority ?? false
        } else {
            showHiddenType.value = 'all'
            showRewardType.value = 'all'
            showCompletedType.value = 'all'
            showBranchType.value = 'all'
            showAvailableType.value = 'all'
            incompletePriority.value = false
        }
    }

    //保存成就界面筛选设置缓存
    const saveAchievementFilterConfig = () => {
        if(!achievementFilterCacheConfig.value) return

        localStorage.setItem(ACHIEVEMENT_FILTER_CONFIG_KEY, JSON.stringify({
            showHiddenType: showHiddenType.value,
            showRewardType: showRewardType.value,
            showCompletedType: showCompletedType.value,
            showBranchType: showBranchType.value,
            showAvailableType: showAvailableType.value,
            incompletePriority: incompletePriority.value
        }))
    }

    watch([showHiddenType, showRewardType, showCompletedType, showBranchType, showAvailableType, incompletePriority, achievementFilterCacheConfig], saveAchievementFilterConfig)

    getAchievementFilterConfig()

    return {
        showVersionList,
        selectVersionList,
        searchContent,
        showHiddenType,
        selectHiddenList,
        showRewardType,
        selectRewardList,
        showCompletedType,
        selectCompletedList,
        showBranchType,
        selectBranchList,
        showAvailableType,
        selectAvailableList,
        hadFilter,
        incompletePriority,
        getAchievementFilterConfig,
    }
})
