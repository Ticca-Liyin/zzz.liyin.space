import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'
import { uploadeTextjoinsToCloud } from '@/utils/achievementCloudSync'

export const useTextjoinStore = defineStore('textjoin', () => {
    let userTextjoin = ref({})

    const TEXTJOIN_KEY = 'zzz-userTextjoin'

    //获取缓存
    const getUserTextjoin = () => {
        let tempUserTextjoin = localStorage.getItem(TEXTJOIN_KEY)

        if (tempUserTextjoin !== null) {
            tempUserTextjoin = JSON.parse(tempUserTextjoin)

            if(typeof tempUserTextjoin !== 'object' || Array.isArray(tempUserTextjoin)) {
                userTextjoin.value = {}
            }
            else {
                // 兼容旧结构 { tokenID: { 性别: '男' } } → { tokenID: { data, lastUpdateTime } }
                let valid = true
                for(const tokenID in tempUserTextjoin){
                    if(typeof tempUserTextjoin[tokenID] !== 'object' || Array.isArray(tempUserTextjoin[tokenID])) {
                        tempUserTextjoin[tokenID] = {
                            data: {},
                            lastUpdateTime: new Date().getTime()
                        }
                        valid = false
                        continue
                    }
                    const keys = Object.keys(tempUserTextjoin[tokenID]);
                    const data = tempUserTextjoin[tokenID]
                    if (!keys.includes('data') && !keys.includes('lastUpdateTime')) {
                        tempUserTextjoin[tokenID] = {
                            data: data,
                            lastUpdateTime: new Date().getTime()
                        }
                        valid = false
                    }
                    else if (keys.includes('data') && !keys.includes('lastUpdateTime')) {
                        tempUserTextjoin[tokenID].lastUpdateTime = new Date().getTime()
                        valid = false
                    }
                    else if (!keys.includes('data') && keys.includes('lastUpdateTime')) {
                        delete data.lastUpdateTime
                        tempUserTextjoin[tokenID].data = data
                        valid = false
                    }
                }

                userTextjoin.value = tempUserTextjoin

                if (!valid) {
                    // 结构/时间补齐只写本地，避免启动读缓存时误上传
                    localStorage.setItem(TEXTJOIN_KEY, JSON.stringify(userTextjoin.value))
                }
            }
        } else {
            userTextjoin.value = {}
        }
    }

    //保存缓存
    const saveUserTextjoin = () => {
        localStorage.setItem(TEXTJOIN_KEY, JSON.stringify(userTextjoin.value))
        saveUserTextjoinsToCloud()
    }

    const resetUserTextjoin = (newUserTextjoin) => {
        localStorage.setItem(TEXTJOIN_KEY, JSON.stringify(newUserTextjoin));
        getUserTextjoin();
    }

    const saveUserTextjoinsToCloud = () => {
        const currentTokenId = userInfoList.value?.currentTokenID
        const textjoinList = userTextjoin.value[currentTokenId]
        if (!textjoinList) return
        uploadeTextjoinsToCloud(currentTokenId, {
            data: textjoinList.data,
            updateTime: textjoinList.lastUpdateTime
        })
    }

    const getUserTextjoinList = (tokenID) => {
        const textjoinList = userTextjoin.value[tokenID]?.data

        if(typeof textjoinList !== 'object' || Array.isArray(textjoinList)) {
            return {}
        }
        return JSON.parse(JSON.stringify(textjoinList))
    }

    const getUserTextjoinLastUpdateTime = (tokenID) => {
        return userTextjoin.value[tokenID]?.lastUpdateTime
    }

    const textjoinSelectList = {
        '性别': ['男', '女'],
    }

    const textjoinIDs = Object.keys(textjoinSelectList)

    const userInfoStore = useUserInfoStore()
    const { userInfoList } = storeToRefs(userInfoStore)

    const getUserTextjoinValue = (tokenID, textjoinId) => {
        const userTokenIDs = Object.keys(userInfoList.value.list)

        if(!userTokenIDs.includes(tokenID)) {
            return undefined
        }

        if(!textjoinIDs.includes(textjoinId)) {
            return undefined
        }

        if(typeof userTextjoin.value[tokenID] !== 'object' || Array.isArray(userTextjoin.value[tokenID])) {
            return textjoinSelectList[textjoinId][0]
        }

        if(userTextjoin.value[tokenID]?.data === null || typeof userTextjoin.value[tokenID]?.data !== 'object' || Array.isArray(userTextjoin.value[tokenID]?.data)) {
            return textjoinSelectList[textjoinId][0]
        }

        return userTextjoin.value[tokenID]?.data[textjoinId] ?? textjoinSelectList[textjoinId][0]
    }

    const updateUserTextjoinValue = (tokenID, textjoinId, value) => {
        const userTokenIDs = Object.keys(userInfoList.value.list)

        if(!userTokenIDs.includes(tokenID)) {
            ElMessage({
                showClose: true,
                message: '更新 TEXTJOIN 失败，账号不存在',
                type: 'error',
            })
            return
        }

        if(!textjoinIDs.includes(textjoinId)) {
            ElMessage({
                showClose: true,
                message: '更新 TEXTJOIN 失败，TEXTJOIN ID 不存在',
                type: 'error',
            })
            return
        }

        if(!textjoinSelectList[textjoinId].includes(value)) {
            ElMessage({
                showClose: true,
                message: `更新 TEXTJOIN 失败，${value} 不在可选参数中`,
                type: 'error',
            })
            return
        }

        if(typeof userTextjoin.value[tokenID] !== 'object' || Array.isArray(userTextjoin.value[tokenID])) {
            userTextjoin.value[tokenID] = {}
        }

        if(userTextjoin.value[tokenID]?.data === null || typeof userTextjoin.value[tokenID]?.data !== 'object' || Array.isArray(userTextjoin.value[tokenID]?.data)) {
            userTextjoin.value[tokenID].data = {}
        }

        userTextjoin.value[tokenID].data[textjoinId] = value
        userTextjoin.value[tokenID].lastUpdateTime = new Date().getTime()

        saveUserTextjoin()
    }

    getUserTextjoin()

    return {
        textjoinSelectList,
        getUserTextjoin,
        getUserTextjoinList,
        getUserTextjoinValue,
        getUserTextjoinLastUpdateTime,
        updateUserTextjoinValue,
        resetUserTextjoin,
    }
})
