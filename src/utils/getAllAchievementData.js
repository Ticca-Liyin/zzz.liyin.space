import { useUserInfoStore } from '@/stores/userInfo'
import { useUserAchievementStore } from '@/stores/achievement/userAchievement'
import { useAchievementCustomNotAchievedStore } from '@/stores/achievement/achievementCustomNotAchieved'
import { useTextjoinStore } from '@/stores/achievement/setting/textjoin'

/**
 * 合并来自不同 store 的所有用户相关数据（用于本地/云端差异比较）
 */
export function getAllUserData() {
    const userInfoStore = useUserInfoStore()
    const userAchievementStore = useUserAchievementStore()
    const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore()
    const textjoinStore = useTextjoinStore()

    const mergedData = {
        currentTokenID: {
            tokenID: userInfoStore.userInfoList.currentTokenID,
            lastUpdateTime: userInfoStore.userInfoList.currentTokenIDLastUpdateTime
        }
    }

    const { list: userList } = userInfoStore.userInfoList

    Object.values(userList).forEach(user => {
        const tokenID = user.tokenID
        const userData = {...user}
        delete userData.lastUpdateTime

        const achievements = userAchievementStore.getUserAchievementList(tokenID)
        const achievementData = achievements?.list || {}
        const achievementLastUpdateTime = achievements?.lastUpdateTime

        const customNotAchieved = achievementCustomNotAchievedStore.getUserCustomNotAchievedList(tokenID)
        const customNotAchievedData = customNotAchieved?.list || {}
        const customNotAchievedLastUpdateTime = customNotAchieved?.lastUpdateTime

        const textjoinSettings = textjoinStore.getUserTextjoinList(tokenID)
        const textjoinLastUpdateTime = textjoinStore.getUserTextjoinLastUpdateTime(tokenID)

        mergedData[tokenID] = {
            user: {
                data: userData,
                lastUpdateTime: user.lastUpdateTime
            },
            achievements: {
                data: achievementData,
                lastUpdateTime: achievementLastUpdateTime
            },
            customNotAchieved: {
                data: customNotAchievedData,
                lastUpdateTime: customNotAchievedLastUpdateTime
            },
            textjoinSettings: {
                data: textjoinSettings,
                lastUpdateTime: textjoinLastUpdateTime
            },
            lastUpdateTime: Math.max(user.lastUpdateTime || 0, achievementLastUpdateTime || 0, customNotAchievedLastUpdateTime || 0, textjoinLastUpdateTime || 0)
        }
    })

    return mergedData
}

/**
 * 组装整包上传 DTO
 */
export function getAllUserDataDTO() {
    const userInfoStore = useUserInfoStore()
    const userAchievementStore = useUserAchievementStore()
    const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore()
    const textjoinStore = useTextjoinStore()

    const mergedData = {
        achievementAccounts: [],
        currentTokenID: {
            tokenId: userInfoStore.userInfoList.currentTokenID,
            lastUpdateTime: userInfoStore.userInfoList.currentTokenIDLastUpdateTime
        }
    }

    const { list: userList } = userInfoStore.userInfoList

    Object.values(userList).forEach(user => {
        const tokenID = user.tokenID
        const userData = {...user}
        delete userData.lastUpdateTime

        const achievements = userAchievementStore.getUserAchievementList(tokenID)
        const achievementData = achievements?.list || {}
        const achievementLastUpdateTime = achievements?.lastUpdateTime

        const customNotAchieved = achievementCustomNotAchievedStore.getUserCustomNotAchievedList(tokenID)
        const customNotAchievedData = customNotAchieved?.list || {}
        const customNotAchievedLastUpdateTime = customNotAchieved?.lastUpdateTime

        const textjoinSettings = textjoinStore.getUserTextjoinList(tokenID)
        const textjoinLastUpdateTime = textjoinStore.getUserTextjoinLastUpdateTime(tokenID)

        const data = {
            user: {
                data: userData,
                lastUpdateTime: user.lastUpdateTime
            },
        }

        if (achievementData && achievementLastUpdateTime) {
            data.achievements = {
                data: achievementData,
                lastUpdateTime: achievementLastUpdateTime
            }
        }

        if (customNotAchievedData && customNotAchievedLastUpdateTime) {
            data.customNotAchieved = {
                data: customNotAchievedData,
                lastUpdateTime: customNotAchievedLastUpdateTime
            }
        }

        if (textjoinSettings && textjoinLastUpdateTime) {
            data.textjoinSettings = {
                data: textjoinSettings,
                lastUpdateTime: textjoinLastUpdateTime
            }
        }

        mergedData.achievementAccounts.push(data)
    })

    return mergedData
}
