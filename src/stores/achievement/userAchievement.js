import { defineStore, storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'
import { uploadeAchievementsToCloud } from '@/utils/achievementCloudSync'

const USER_ACHIEVEMENT_KEY = 'zzz-userAchievement'

export const useUserAchievementStore = defineStore('userAchievement', () => {
    const userInfoStore = useUserInfoStore()
    const { currentUserInfo } = storeToRefs(userInfoStore)

    //用户成就状态列表
    let userAchievement = {}

    //获取缓存
    const getUserAchievement = () => {
        const tempUserAchievement = localStorage.getItem(USER_ACHIEVEMENT_KEY)

        if (tempUserAchievement !== null) {
            userAchievement = JSON.parse(tempUserAchievement)

            // #region lastUpdateTime 属性缺失补充
            if (userAchievement !== null && typeof userAchievement === "object" && !Array.isArray(userAchievement)) {
                let valid = true
                for(const tokenID in userAchievement){
                    if(userAchievement[tokenID].lastUpdateTime === undefined || typeof userAchievement[tokenID].lastUpdateTime !== "number"){
                        userAchievement[tokenID].lastUpdateTime = new Date().getTime()
                        valid = false
                    }
                }
                if (!valid) {
                    // 仅落本地，避免读缓存补齐时误触发上传
                    localStorage.setItem(USER_ACHIEVEMENT_KEY, JSON.stringify(userAchievement))
                }
            }
            // #endregion
        } else {
            userAchievement = {}
        }
    }

    //保存缓存：本地优先，云同步失败不影响本地功能
    const saveUserAchievement = () => {
        localStorage.setItem(USER_ACHIEVEMENT_KEY, JSON.stringify(userAchievement))
        try {
            saveUserAchievementsToCloud()
        } catch (error) {
            console.error('upload achievements failed, local kept', error)
        }
    }

    const resetUserAchievement = (newUserAchievement) => {
        localStorage.setItem(USER_ACHIEVEMENT_KEY, JSON.stringify(newUserAchievement));
        getUserAchievement();
    }

    const saveUserAchievementsToCloud = () => {
        const currentTokenId = currentUserInfo?.value.tokenID
        const achievementList = userAchievement[currentTokenId]
        if (!achievementList) return
        uploadeAchievementsToCloud(currentTokenId, {
            data: achievementList.list,
            updateTime: achievementList.lastUpdateTime
        })
    }

    const findUserAchievementList = () => {
        return userAchievement[currentUserInfo?.value.tokenID]
    }

    const getUserAchievementList = (tokenID) => {
        const achievementList = userAchievement[tokenID]

        if(typeof achievementList !== 'object' || Array.isArray(achievementList)) {
            return {}
        }
        return JSON.parse(JSON.stringify(achievementList))
    }

    const handleUserAchievementList = (achievementID, status, save = true) => {
        if(!achievementID || !status) throw new Error('数据不能为空')
        if(status !== 1 && status !== 2 && status !== 3) throw new Error('参数status不能为非1、2或3的值')

        const userAchievementList = findUserAchievementList()

        if (!userAchievementList) {
            userAchievement[currentUserInfo.value.tokenID] = {
                tokenID: currentUserInfo.value.tokenID,
                list: {
                    [achievementID]: {
                        id: achievementID,
                        status: status
                    }
                },
                lastUpdateTime: new Date().getTime()
            }
            if(save) saveUserAchievement()
            return
        }

        // 状态未变则不抬 lastUpdateTime，避免初始化补齐多选一等路径误标脏导致云冲突
        const prev = userAchievementList.list[achievementID]
        if (prev && prev.status === status) return

        userAchievementList.list[achievementID] = {
            id: achievementID,
            status: status
        }
        userAchievementList.lastUpdateTime = new Date().getTime()
        if(save) saveUserAchievement()
        return
    }

    getUserAchievement();

    return {
        getUserAchievement,
        saveUserAchievement,
        findUserAchievementList,
        getUserAchievementList,
        handleUserAchievementList,
        resetUserAchievement,
    }
})
