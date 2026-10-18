import { ref } from 'vue'
import { defineStore } from 'pinia'
import { achievementFirstClassVersion } from '@/utils/version.js'

export const useAchievementFirstClassInfoStore = defineStore('achievementFirstClassInfo', () => {
    const achievementFirstClassInfo = ref({})

    const initialAchievementFirstClassInfo = async () => {
        return fetch(`/src/jsons/AchievementFirstClass.json?v=${achievementFirstClassVersion}`)
        .then(response => response.json())
        .then(data => {
            achievementFirstClassInfo.value = data
            return data
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }

    return {
        achievementFirstClassInfo,
        initialAchievementFirstClassInfo,
    }
})
