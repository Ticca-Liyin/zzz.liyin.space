import { ref } from 'vue'
import { defineStore } from 'pinia'
import { achievementSecondClassVersion } from '@/utils/version.js'

export const useAchievementSecondClassInfoStore = defineStore('achievementSecondClassInfo', () => {
    const achievementSecondClassInfo = ref({})

    const initialAchievementSecondClassInfo = async () => {
        return fetch(`/src/jsons/AchievementSecondClass.json?v=${achievementSecondClassVersion}`)
        .then(response => response.json())
        .then(data => {
            achievementSecondClassInfo.value = data
            return data
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }

    return {
        achievementSecondClassInfo,
        initialAchievementSecondClassInfo,
    }
})
