import { defineStore, storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'
import { uploadeCustomNotAchievedToCloud } from '@/utils/achievementCloudSync'

export const useAchievementCustomNotAchievedStore = defineStore('achievementCustomNotAchieved', () => {
    const userInfoStore = useUserInfoStore()
    const { currentUserInfo } = storeToRefs(userInfoStore)

    //用户自定义暂不可获取列表
    let userCustomNotAchieved = {}

    const User_Custom_Not_Achieved_KEY = 'zzz-userCustomNotAchieved'

    //获取缓存
    const getUserCustomNotAchieved = () => {
        const tempUserCustomNotAchieved = localStorage.getItem(User_Custom_Not_Achieved_KEY)

        if (tempUserCustomNotAchieved !== null) {
            userCustomNotAchieved = JSON.parse(tempUserCustomNotAchieved)

            // #region lastUpdateTime 属性缺失补充
            if (userCustomNotAchieved !== null && typeof userCustomNotAchieved === "object" && !Array.isArray(userCustomNotAchieved)) {
                let valid = true
                for(const tokenID in userCustomNotAchieved){
                    if(userCustomNotAchieved[tokenID].lastUpdateTime === undefined || typeof userCustomNotAchieved[tokenID].lastUpdateTime !== "number"){
                        userCustomNotAchieved[tokenID].lastUpdateTime = new Date().getTime()
                        valid = false
                    }
                }
                if (!valid) {
                    // 仅落本地，避免读缓存补齐时误触发上传
                    localStorage.setItem(User_Custom_Not_Achieved_KEY, JSON.stringify(userCustomNotAchieved))
                }
            }
            // #endregion
        } else {
            userCustomNotAchieved = {}
        }
    }

    //保存缓存：本地优先，云同步失败不影响本地功能
    const saveUserCustomNotAchieved = () => {
        localStorage.setItem(User_Custom_Not_Achieved_KEY, JSON.stringify(userCustomNotAchieved))
        try {
            saveUserCustomNotAchievedToCloud()
        } catch (error) {
            console.error('upload customNotAchieved failed, local kept', error)
        }
    }

    const resetUserCustomNotAchieved = (newData) => {
        localStorage.setItem(User_Custom_Not_Achieved_KEY, JSON.stringify(newData));
        getUserCustomNotAchieved();
    }

    const saveUserCustomNotAchievedToCloud = () => {
        const currentTokenId = currentUserInfo?.value.tokenID
        const customNotAchievedList = userCustomNotAchieved[currentTokenId]
        if (!customNotAchievedList) return
        uploadeCustomNotAchievedToCloud(currentTokenId, {
            data: customNotAchievedList.list,
            updateTime: customNotAchievedList.lastUpdateTime
        })
    }

    const findUserCustomNotAchievedList = () => {
        return userCustomNotAchieved[currentUserInfo?.value.tokenID]
    }

    const getUserCustomNotAchievedList = (tokenID) => {
        const customNotAchievedList = userCustomNotAchieved[tokenID]

        if(typeof customNotAchievedList !== 'object' || Array.isArray(customNotAchievedList)) {
            return {}
        }
        return JSON.parse(JSON.stringify(customNotAchievedList))
    }

    const initUserCustomNotAchievedList = () => {
        userCustomNotAchieved[currentUserInfo?.value.tokenID] = {
            tokenID: currentUserInfo.value.tokenID,
            list: {},
            lastUpdateTime: new Date().getTime()
        }

        saveUserCustomNotAchieved()
    }

    const handleUserCustomNotAchievedList = (achievementID, status, save = true) => {
        if(!achievementID) throw new Error('数据不能为空')
        if(typeof status !== 'boolean') throw new Error('参数status不能为非 true 或 false 的值')

        const userCustomNotAchievedList = findUserCustomNotAchievedList()

        if (!userCustomNotAchievedList) {
            userCustomNotAchieved[currentUserInfo.value.tokenID] = {
                tokenID: currentUserInfo.value.tokenID,
                list: {
                    [achievementID]: {
                        id: achievementID,
                        status: status
                    }
                },
                lastUpdateTime: new Date().getTime()
            }
            if(save) saveUserCustomNotAchieved()
            return
        }

        // 状态未变则不抬 lastUpdateTime，避免初始化联动补写误标脏
        const prev = userCustomNotAchievedList.list[achievementID]
        if (prev && prev.status === status) return

        userCustomNotAchievedList.list[achievementID] = {
            id: achievementID,
            status: status
        }
        userCustomNotAchievedList.lastUpdateTime = new Date().getTime()
        if(save) saveUserCustomNotAchieved()
        return
    }

    return {
        getUserCustomNotAchieved,
        saveUserCustomNotAchieved,
        findUserCustomNotAchievedList,
        getUserCustomNotAchievedList,
        initUserCustomNotAchievedList,
        handleUserCustomNotAchievedList,
        resetUserCustomNotAchieved,
    }
})
