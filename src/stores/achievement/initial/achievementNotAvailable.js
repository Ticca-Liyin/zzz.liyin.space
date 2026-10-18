import { ref } from 'vue'
import { defineStore } from 'pinia'
import { notAvailableAchievementVersion } from '@/utils/version.js'

export const useAchievementNotAvailableStore = defineStore('achievementNotAvailable', () => {
    const notAvailable = ref({})

    const initialAchievementNotAvailable = async () => {
        return fetch(`/src/jsons/NotAvailableAchievement.json?v=${notAvailableAchievementVersion}`)
        .then(response => response.json())
        .then(data => {
            notAvailable.value = data
            return data
        })
        .catch(error => {
            console.error(error)
            throw error
        })
    }

    return {
        notAvailable,
        initialAchievementNotAvailable
    }
})
