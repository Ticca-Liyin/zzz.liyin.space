import { Achievement } from '@/types/achievement'
import { AchievementSecondClass } from '@/types/achievementSecondClass'
import { ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'
import { useUserAchievementStore } from '@/stores/achievement/userAchievement'
import { useAchievementCustomNotAchievedStore } from '@/stores/achievement/achievementCustomNotAchieved'
import { useAchievementInfoStore } from '@/stores/achievement/initial/achievementInfo'
import { useAchievementFirstClassInfoStore } from '@/stores/achievement/initial/achievementFirstClassInfo'
import { useAchievementSecondClassInfoStore } from '@/stores/achievement/initial/achievementSecondClassInfo'
import { useAchievementMultipleChoiceStore } from '@/stores/achievement/initial/achievementMultipleChoice'
import { useAchievementNotAvailableStore } from '@/stores/achievement/initial/achievementNotAvailable'
import { useAchievementStrategyStore } from '@/stores/achievement/strategy/achievementStrategy'
import { useAchievementSelectVersionListStore } from '@/stores/achievement/felter/achievementSelectVersionList'

const userInfoStore = useUserInfoStore()
const { currentUserInfo } = storeToRefs(userInfoStore)

const userAchievementStore = useUserAchievementStore()
const { findUserAchievementList, handleUserAchievementList } = userAchievementStore

const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore()
const { findUserCustomNotAchievedList, handleUserCustomNotAchievedList } = achievementCustomNotAchievedStore

const achievementInfoStore = useAchievementInfoStore()
const { initialAchievementInfo } = achievementInfoStore

const achievementFirstClassInfoStore = useAchievementFirstClassInfoStore()
const { initialAchievementFirstClassInfo } = achievementFirstClassInfoStore

const achievementSecondClassInfoStore = useAchievementSecondClassInfoStore()
const { initialAchievementSecondClassInfo } = achievementSecondClassInfoStore

const achievementMultipleChoiceStore = useAchievementMultipleChoiceStore()
const { multipleChoice } = storeToRefs(achievementMultipleChoiceStore)
const { initialAchievementMultipleChoice } = achievementMultipleChoiceStore

const achievementNotAvailableStore = useAchievementNotAvailableStore()
const { notAvailable } = storeToRefs(achievementNotAvailableStore)
const { initialAchievementNotAvailable } = achievementNotAvailableStore

const achievementStrategyStore = useAchievementStrategyStore()
const { initialAchievementStrategy, initialStrategyInfo } = achievementStrategyStore

const achievementSelectVersionListStore = useAchievementSelectVersionListStore()
const { handleSelectVersionList } = achievementSelectVersionListStore

export const useAchievementStore = defineStore('achievement', () => {
    const PolychromeImg= 'https://act-upload.mihoyo.com/nap-obc-indep/2024/05/22/284550490/8ff8462918776b83f8d1482dbf8f1a85_6776749559242960495.png'
    const CopperImg = '/src/images/reward/copper.png'
    const SilverImg = '/src/images/reward/silver.png'
    const GoldImg = '/src/images/reward/gold.png'

    const achievements = ref([])
    const achievementFirstClasses = ref([])
    /** 真实二级类（JSON） */
    const achievementSecondClasses = ref([])
    /** 一级 ALL 成就集：key = firstClassId（= ALL.Id） */
    const achievementFirstClassAllSecondClasses = ref({})

    // 账号切换时重算状态（与旧单体行为一致）
    watch(currentUserInfo, () => {
        initialAchievementsStatus()
        initialNotAvailable()
        initialAchievementsCustomNotAchievedStatus()
    })

    //初始化成就状态列表（与 HSR 同构：单遍；写 displaced 前以本地 list 为准，避免误抬 lastUpdateTime）
    const initialAchievementsStatus = () => {
        const userAchievementList = findUserAchievementList()?.list ?? []

        achievements.value.forEach(achievement => {
            const userAch_ = userAchievementList[achievement.Id]
            if (!userAch_) achievement.Status = 1
            else if (userAch_.status === 2 && !achievement?.MultipleID) {
                achievement.Status = 1
                handleUserAchievementList(achievement.Id, achievement.Status)
            }
            else if (userAch_.status === 3 && achievement?.MultipleID) {
                achievement.Status = userAch_.status

                multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                    if (AchievementID === achievement.Id) return
                    const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                    if (!ach_ || ach_.Status === 2) return
                    ach_.Status = 2
                    // 内存默认是 1，不能只靠 Status；list 里已是 2 则不再写入
                    const userach_ = userAchievementList[ach_.Id]
                    if (userach_?.status !== 2) {
                        handleUserAchievementList(ach_.Id, ach_.Status)
                    }
                })
            }
            else achievement.Status = userAch_.status
        })
    }

    //初始化多选一成就列表
    const initialMultipleChoice = () => {
        for(const [multipleID, achievementIDs] of Object.entries(multipleChoice.value)){
            for(const achievementID of achievementIDs) {
                const ach_ = achievements.value.find(ach => ach.Id === achievementID)
                if(!ach_) continue
                ach_.MultipleID = multipleID
            }
        }
    }

    //初始化暂时无法获得成就列表
    const initialNotAvailable = () => {
        for(const notAvailableAchievement of Object.values(notAvailable.value)){
            const ach_ = achievements.value.find(ach => ach.Id === notAvailableAchievement.Id)
            if(!ach_) continue
            ach_.timestamp = notAvailableAchievement.timestamp
            if(!ach_.isNotAvailable) continue

            if(ach_.Status !== 1){
                ach_.Status = 1
                handleUserAchievementList(ach_.Id, ach_.Status)
            }
        }
    }

    //初始化自定义暂不可获取
    const initialAchievementsCustomNotAchievedStatus = () => {
        const userCustomNotAchievedList = findUserCustomNotAchievedList()?.list ?? []

        const isMultipleCustomNotAchievedList = []

        achievements.value.forEach(achievement => {
            const userAch_ = userCustomNotAchievedList[achievement.Id]
            if(isMultipleCustomNotAchievedList.includes(achievement.Id)) return
            else if(!userAch_) achievement.CustomNotAchieved = false
            else if(userAch_.status === false) {
                achievement.CustomNotAchieved = userAch_.status
            }
            else if(userAch_.status === true && achievement?.MultipleID) {
                achievement.CustomNotAchieved = userAch_.status
                isMultipleCustomNotAchievedList.push(achievement.Id)

                if(achievement.Status !== 1){
                    achievement.Status = 1
                    handleUserAchievementList(achievement.Id, achievement.Status)
                }

                multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID === achievement.Id) return

                    const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                    if(!ach_) return

                    ach_.CustomNotAchieved = true

                    if(userCustomNotAchievedList[AchievementID] !== true){
                        handleUserCustomNotAchievedList(ach_.Id, ach_.CustomNotAchieved)
                    }

                    isMultipleCustomNotAchievedList.push(AchievementID)

                    if(ach_.Status !== 1){
                        ach_.Status = 1
                        handleUserAchievementList(ach_.Id, ach_.Status)
                    }
                })
            }
            else {
                achievement.CustomNotAchieved = userAch_.status

                if(achievement.Status !== 1){
                    achievement.Status = 1
                    handleUserAchievementList(achievement.Id, achievement.Status)
                }
            }
        })
    }

    const initialAchievementsInfo = async () => {
        return Promise.all([
            initialAchievementInfo(),
            initialAchievementFirstClassInfo(),
            initialAchievementSecondClassInfo(),
            initialAchievementMultipleChoice(),
            initialAchievementNotAvailable(),
            initialAchievementStrategy(),
            initialStrategyInfo(),
        ])
        .then(([achievementInfo, achievementFirstClass, achievementSecondClass]) => {
            achievements.value = []
            achievementSecondClasses.value = []
            achievementFirstClassAllSecondClasses.value = {}

            // 注入「全部」一级分类
            const firstClassMap = { ...achievementFirstClass }
            firstClassMap[0] = { Id: 0, Name: '全部', Priority: 0 }
            achievementFirstClasses.value = firstClassMap

            Object.values(achievementInfo).forEach(ach => {
                achievements.value.push(new Achievement(ach))
            })

            initialMultipleChoice()
            initialAchievementsStatus()
            initialNotAvailable()
            initialAchievementsCustomNotAchievedStatus()

            achievements.value.sort((a, b) => {
                const achievementSecondClassA = achievementSecondClass[a.SecondClassId]
                const achievementSecondClassB = achievementSecondClass[b.SecondClassId]

                const FirstClassPriorityA = firstClassMap[achievementSecondClassA.FirstClassId].Priority
                const FirstClassPriorityB = firstClassMap[achievementSecondClassB.FirstClassId].Priority

                if (FirstClassPriorityA !== FirstClassPriorityB)
                    return FirstClassPriorityA - FirstClassPriorityB

                const SecondClassPriorityA = achievementSecondClassA.Priority
                const SecondClassPriorityB = achievementSecondClassB.Priority

                if (SecondClassPriorityA !== SecondClassPriorityB)
                    return SecondClassPriorityA - SecondClassPriorityB

                return a.Priority - b.Priority
            })

            // 真实二级类 + 版本筛选项
            Object.values(achievementSecondClass).forEach(value => {
                const achs = achievements.value.filter(achievement => achievement.SecondClassId === value.Id)
                achievementSecondClasses.value.push(new AchievementSecondClass(value, achs))
                handleSelectVersionList(value.Id, achs)
            })

            achievementSecondClasses.value.sort((a, b) => {
                const FirstClassPriorityA = firstClassMap[a.FirstClassId].Priority
                const FirstClassPriorityB = firstClassMap[b.FirstClassId].Priority
                if (FirstClassPriorityA !== FirstClassPriorityB)
                    return FirstClassPriorityA - FirstClassPriorityB

                return a.Priority - b.Priority
            })

            // 一级 ALL 成就集 + 版本筛选项（Id / FirstClassId = firstClassId，不并入真实二级列表）
            const allByFirstId = {}
            Object.values(firstClassMap).forEach(fc => {
                const firstId = fc.Id
                let achs
                if (firstId === 0) {
                    achs = achievements.value
                } else {
                    const secondIds = new Set(
                        achievementSecondClasses.value
                            .filter(sc => sc.FirstClassId === firstId)
                            .map(sc => sc.Id)
                    )
                    achs = achievements.value.filter(a => secondIds.has(a.SecondClassId))
                }
                allByFirstId[firstId] = new AchievementSecondClass({
                    Id: firstId,
                    Name: fc.Name,
                    FirstClassId: firstId,
                    Priority: 0,
                }, achs)
                handleSelectVersionList(firstId, achs)
            })
            achievementFirstClassAllSecondClasses.value = allByFirstId

            return Promise.resolve()
        })
        .catch(error => {
            console.error(error);
            return Promise.reject(error);
        });
    }

    const resetAchievementsInfo = () => {
        initialAchievementsStatus()
        initialNotAvailable()
        initialAchievementsCustomNotAchievedStatus()
    }

    //#region 成就选中相关逻辑
    const handleAchevementStatus = (achievement, save = true) => {
        if(!(achievement instanceof Achievement)){
            throw new Error('传入achievement不是Achievement类型')
        }
        if (achievement.isNotAvailable) return

        if (achievement.Status === 1) {
            achievement.Status = 3
            handleUserAchievementList(achievement.Id, achievement.Status, save)
            if(achievement?.MultipleID){
                multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID !== achievement.Id){
                        const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                        if(ach_){
                            ach_.Status = 2
                            handleUserAchievementList(ach_.Id, ach_.Status, save)
                        }
                    }
                })
            }
            return
        }
        else if (achievement.Status === 3) {
            achievement.Status = 1
            handleUserAchievementList(achievement.Id, achievement.Status, save)
            if(achievement?.MultipleID){
                multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID !== achievement.Id){
                        const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                        if(ach_){
                            ach_.Status = 1
                            handleUserAchievementList(ach_.Id, ach_.Status, save)
                        }
                    }
                })
            }
            return
        }
    }
    //#endregion

    //#region 自定义暂不可获取成就相关逻辑
    const AchievementToCustomNotAchieved = (achievement) => {
        if (achievement.Status !== 1) {
            achievement.Status = 1
            handleUserAchievementList(achievement.Id, achievement.Status)
        }

        achievement.CustomNotAchieved = true
        handleUserCustomNotAchievedList(achievement.Id, achievement.CustomNotAchieved)

        if(achievement?.MultipleID){
            multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                if(AchievementID !== achievement.Id){
                    const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                    if(ach_){
                        if(ach_.Status !== 1){
                            ach_.Status = 1
                            handleUserAchievementList(ach_.Id, ach_.Status)
                        }

                        ach_.CustomNotAchieved = true
                        handleUserCustomNotAchievedList(ach_.Id, ach_.CustomNotAchieved)
                    }
                }
            })
        }
    }

    const AchievementCancelCustomNotAchieved = (achievement) => {
        if (achievement.Status !== 1) {
            achievement.Status = 1
            handleUserAchievementList(achievement.Id, achievement.Status)
        }

        achievement.CustomNotAchieved = false
        handleUserCustomNotAchievedList(achievement.Id, achievement.CustomNotAchieved)

        if(achievement?.MultipleID){
            multipleChoice.value[achievement.MultipleID].forEach(AchievementID => {
                if(AchievementID !== achievement.Id){
                    const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                    if(ach_){
                        if(ach_.Status !== 1){
                            ach_.Status = 1
                            handleUserAchievementList(ach_.Id, ach_.Status)
                        }

                        ach_.CustomNotAchieved = false
                        handleUserCustomNotAchievedList(ach_.Id, ach_.CustomNotAchieved)
                    }
                }
            })
        }
    }
    //#endregion

    const getMultipleIDAchievemnetTitles = (achievement) => {
        if(achievement?.MultipleID){
            return multipleChoice.value[achievement.MultipleID].map(AchievementID => {
                const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                if(ach_){
                    return ach_.Name
                }
            })
        }
        else return [achievement.Name]
    }

    return {
        PolychromeImg,
        CopperImg,
        SilverImg,
        GoldImg,
        achievements,
        achievementFirstClasses,
        achievementSecondClasses,
        achievementFirstClassAllSecondClasses,
        initialAchievementsStatus,
        initialNotAvailable,
        initialAchievementsCustomNotAchievedStatus,
        initialAchievementsInfo,
        resetAchievementsInfo,
        handleAchevementStatus,
        AchievementToCustomNotAchieved,
        AchievementCancelCustomNotAchieved,
        getMultipleIDAchievemnetTitles,
    }
})
