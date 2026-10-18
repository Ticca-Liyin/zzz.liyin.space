import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAchievementSelectVersionListStore = defineStore('achievementSelectVersionList', () => {
    //可选择版本列表缓存（按 SecondClassId）
    const selectVersionListCache = ref({})

    const handleSelectVersionList = (SecondClassId, achs) => {
        const VersionSet = new Set()
        achs.forEach(achievement => {
            VersionSet.add(achievement.Version)
        })

        const result = Array.from(VersionSet).map(value => ({ value, label: value }))
        result.sort((a, b) => b.value - a.value)

        selectVersionListCache.value[SecondClassId] = result
    }

    return {
        selectVersionListCache,
        handleSelectVersionList,
    }
})
