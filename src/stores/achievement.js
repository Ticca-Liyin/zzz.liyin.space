import { nextTick, watch, computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useAuthorStore } from '@/stores/author'
import { useUserInfoStore } from '@/stores/userInfo'
import { useSettingStore } from '@/stores/setting'
import { achievementInfoVersion, achievementFirstClassVersion, achievementSecondClassVersion, multipleChoiceVersion,
     notAvailableAchievementVersion, achievementStrategyVersion, strategyInfoVersion } 
     from '@/utils/version.js'

const authorStore = useAuthorStore()
const { authors } = storeToRefs(authorStore)

const userInfoStore = useUserInfoStore()
const { currentUserInfo } = storeToRefs(userInfoStore)

const settingStore = useSettingStore()
const { achievementFilterCacheConfig } = storeToRefs(settingStore)

export const useAchievementStore = defineStore('achievement', () => {
    class Achievement {
        constructor(achievement) {
            this.Id = achievement.Id
            this.SecondClassId = achievement.SecondClassId
            this.Name = achievement.Name
            this.Desc = achievement.Desc
            // this.Priority = achievement.Priority
            this.Reward = achievement.Reward
            this.Hidden = achievement.Hidden
            this.Version = achievement.Version
            this.Status = 1
        }
        
        get isHidden(){
            return this.Hidden !== 0
        }

        get PolychromeNum(){
            if (this.Reward === 3) return 20
            if (this.Reward === 2) return 10
            if (this.Reward === 1) return 5
            return 0
        }

        get isNotAvailable(){
            if(!this?.timestamp) return false

            const currentTimestamp = Date.now();

            return this.timestamp > currentTimestamp;
        }

        get StatusDesc(){
            if(this.isNotAvailable) return "暂不可获得"
            if(this.Status === 1) return "未完成"
            if(this.Status === 2) return "已选其他"
            if(this.Status === 3) return "已完成"
            return "未知状态"
        }
    }

    class AchievementSecondClass {
        constructor(achievementSecondClass, achievements) {
            this.Id = achievementSecondClass.Id
            this._Name = achievementSecondClass.Name
            this.FirstClassId = achievementSecondClass.FirstClassId
            this.Priority = achievementSecondClass.Priority
            this._Achievements = achievements
        }

        get Name(){
            return this._Name
        }

        get Achievements(){
            return this._Achievements
        }
        //系列相关成就数
        get AchievementsLength(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let totalAchievements = 0; // 记录总共可获得的成就数

            for (const achievement of this.Achievements) {
                if (achievement.isNotAvailable) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    totalAchievements++
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                totalAchievements++
                selectedMultipleIDs.push(MultipleID)
            }
            return totalAchievements
        }
        //系列相关成就可获得菲林总数
        get PolychromeTotal(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let total = 0; // 记录总共可获得的成就数

            for (const achievement of this.Achievements) {
                if (achievement.isNotAvailable) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    total+= achievement.PolychromeNum
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                total+= achievement.PolychromeNum
                selectedMultipleIDs.push(MultipleID)
            }
            return total
        }
        //系列相关成就已完成数
        get completedAchievementsLength(){
            let count = 0
            // console.log(this.Achievements)
            this.Achievements.forEach(achievement => {
                if (achievement.Status == 3) count++
            })
            return count
        }
        //系列相关成就已获得菲林总数
        get completedPolychromeTotal(){
            let total = 0
            // console.log(this.Achievements)
            this.Achievements.forEach(achievement => {
                if (achievement.Status == 3) total += achievement.PolychromeNum
            })
            return total
        }
        //系列成就完成进度
        get completedPercentage(){
            if (this.AchievementsLength === 0) return 0 + '%'
            
            return Math.min(Math.round(this.completedAchievementsLength / this.AchievementsLength * 100), 100) + '%'
        }

        get completedPolychromePercentage(){
            if (this.PolychromeTotal === 0) return 0
            
            return Math.min(Math.round(this.completedPolychromeTotal / this.PolychromeTotal * 100), 100)
        }

        get completedPolychromePercentageString(){
            return this.completedPolychromePercentage.toFixed(2) + "%"
        }
        //系列相关暂不可完成成就数
        get notAvailableAchievementsLengeh(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let totalAchievements = 0; // 记录总共可获得的成就数

            for (const achievement of this.Achievements) {
                if (!achievement.isNotAvailable) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    totalAchievements++
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                totalAchievements++
                selectedMultipleIDs.push(MultipleID)
            }
            return totalAchievements
        }

        // 系列铜级相关成就总数
        get CopperAchievementsLength(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let totalAchievements = 0; // 记录总共可获得的铜级成就数

            for (const achievement of this.Achievements) {
                if (achievement.isNotAvailable) continue

                if (achievement.Reward !== 1) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    totalAchievements++
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                totalAchievements++
                selectedMultipleIDs.push(MultipleID)
            }
            return totalAchievements
        }

        // 系列银级相关成就总数
        get SilverAchievementsLength(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let totalAchievements = 0; // 记录总共可获得的银级成就数

            for (const achievement of this.Achievements) {
                if (achievement.isNotAvailable) continue

                if (achievement.Reward !== 2) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    totalAchievements++
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                totalAchievements++
                selectedMultipleIDs.push(MultipleID)
            }
            return totalAchievements
        }

        // 系列金级相关成就总数
        get GoldAchievementsLength(){
            const selectedMultipleIDs = []; // 记录已选择的多选一成就类型
            let totalAchievements = 0; // 记录总共可获得的金级成就数

            for (const achievement of this.Achievements) {
                if (achievement.isNotAvailable) continue

                if (achievement.Reward !== 3) continue

                const MultipleID = achievement?.MultipleID
                if(!MultipleID){
                    totalAchievements++
                    continue
                } 
                if (selectedMultipleIDs.includes(MultipleID)){
                    continue
                }
                totalAchievements++
                selectedMultipleIDs.push(MultipleID)
            }
            return totalAchievements
        }

        //系列铜级相关成就已完成数
        get completedCopperAchievementsLength(){
            let count = 0

            this.Achievements.forEach(achievement => {
                if (achievement.Status == 3 && achievement.Reward == 1) count++
            })
            return count
        }

        //系列银级相关成就已完成数
        get completedSilverAchievementsLength(){
            let count = 0

            this.Achievements.forEach(achievement => {
                if (achievement.Status == 3 && achievement.Reward == 2) count++
            })
            return count
        }

        //系列金级相关成就已完成数
        get completedGoldAchievementsLength(){
            let count = 0

            this.Achievements.forEach(achievement => {
                if (achievement.Status == 3 && achievement.Reward == 3) count++
            })
            return count
        }

        updateAchievements(achievements) {
            this._Achievements = achievements
        }
    }

    class AchievementAllSecondClass extends AchievementSecondClass{
        constructor(achievementSecondClass, achievements) {
            super(achievementSecondClass, achievements)
        }

        get Achievements(){
            let secondClassesId = []
            
            if(showFirstClassId.value !== 0 ) {
                secondClassesId = achievementSecondClasses.value.filter(secondClass => showFirstClassId.value === secondClass.FirstClassId).map(object => object.Id)
            } else {
                secondClassesId = achievementSecondClasses.value.filter(secondClass => secondClass.Id !== 0).map(object => object.Id)
            }

            return this._Achievements.filter(achievement => {
                return secondClassesId.includes(achievement.SecondClassId)
            })
        }

        get Name(){
            return achievementFirstClasses.value[showFirstClassId.value]?.Name ?? '未知'
        }

        updateAchievements(achievements) {
            this._Achievements = achievements
        }
    }

    const PolychromeImg= "https://act-upload.mihoyo.com/nap-obc-indep/2024/05/22/284550490/8ff8462918776b83f8d1482dbf8f1a85_6776749559242960495.png"
    const CopperImg = "/src/images/reward/copper.png"
    const SilverImg = "/src/images/reward/silver.png"
    const GoldImg = "/src/images/reward/gold.png"

    const USER_ACHIEVEMENT_KEY = "zzz-userAchievement"
    const ACHIEVEMENT_FILTER_CONFIG_KEY = "zzz-AchievementFilterConfig"

    watch(currentUserInfo, () => {
        initialAchievementsStatus()
        // 对 暂时无法获得但因特殊情况状态时已获得的进行修正 由于会重复赋值 已赋值的 timestamp 若出现性能问题可进行优化
        initialNotAvailable()
        // console.log("userInfoStore", newValue)
    })

    //用户成就状态列表
    let userAchievement = {}
    //获取缓存
    const getUserAchievement = () => {
        // 从缓存中读取名为 USER_ACHIEVEMENT_KEY 的数据
        const tempUserAchievement = localStorage.getItem(USER_ACHIEVEMENT_KEY)

        // 检查是否存在名为 USER_ACHIEVEMENT_KEY 的数据
        if (tempUserAchievement !== null) {
            // 数据存在，将其从字符串转换为对象
            userAchievement = JSON.parse(tempUserAchievement)
        } else {
            // 数据不存在，执行相应的操作
            userAchievement = {}
        }
    }
    //保存缓存
    const saveUserAchievement = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem(USER_ACHIEVEMENT_KEY, JSON.stringify(userAchievement))
    }
    const findUserAchievementList = () => {
        // 查找用户成就列表
        return userAchievement[currentUserInfo?.value.tokenID]
    }  
    const handleUserAchievementList = (achievementID, status, save = true) => {
        if(!achievementID || !status) throw new Error("数据不能为空")
        if(status !== 1 && status !== 2 && status !== 3) throw new Error("参数status不能为非1、2或3的值")
        // 修改用户成就列表
        const userAchievementList = findUserAchievementList()

        if (!userAchievementList) {
            // 用户成就列表不存在，创建新的用户成就列表
            userAchievement[currentUserInfo.value.tokenID] = {
                tokenID: currentUserInfo.value.tokenID,
                list: {
                    [achievementID]: {
                        id: achievementID,
                        status: status
                    }
                }
            }
            if(save) saveUserAchievement()
            return 
        }
        // 用户成就列表存在，修改成就状态
        userAchievementList.list[achievementID] = {
            id: achievementID,
            status: status
        }
        if(save) saveUserAchievement()
        return 
    }   
    const initialAchievementsStatus = () => {
        const userAchievementList = findUserAchievementList()?.list ?? []

        achievements.value.forEach(achievement => {
            const userAch_ = userAchievementList[achievement.Id]
            // console.log(userAch_)
            if(!userAch_) achievement.Status = 1
            else if(userAch_.status === 2 && !achievement?.MultipleID){
                achievement.Status = 1
                handleUserAchievementList(achievement.Id, achievement.Status)
            }
            else if(userAch_.status === 3 && achievement?.MultipleID) {
                achievement.Status = userAch_.status
                multipleChoice[achievement.MultipleID].forEach(AchievementID => {
                    if(AchievementID !== achievement.Id){
                        const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                        if(ach_ && ach_.Status !== 2){
                            ach_.Status = 2
                            handleUserAchievementList(ach_.Id, ach_.Status)
                        } 
                    }
                })
            }
            else achievement.Status = userAch_.status
        })
    }

    //多选一成就列表
    let multipleChoice = {}
    const initialMultipleChoice = () => {
        for(const [multipleID, achievementIDs] of Object.entries(multipleChoice))
            for(const achievementID of achievementIDs) {
                const ach_ = achievements.value.find(ach => ach.Id === achievementID)
                if(!ach_) continue
                ach_.MultipleID = multipleID
                // console.log(ach_)
            }       
    }

    //暂时无法获得成就列表
    let notAvailable = {} 
    const initialNotAvailable = () => {
        for(const notAvailableAchievement of Object.values(notAvailable)){
            const ach_ = achievements.value.find(ach => ach.Id === notAvailableAchievement.Id)
            if(!ach_) continue
            // 添加暂不可获得时间戳
            ach_.timestamp = notAvailableAchievement.timestamp
            // console.log(ach_)
            if(!ach_.isNotAvailable) continue

            // 如果暂不可获得，判断当前状态，若状态为非未完成状态则进行修正
            if(ach_.Status !== 1){
                ach_.Status = 1
                handleUserAchievementList(ach_.Id, ach_.Status)
            }
        }
    }

    const dialogVisible = ref(false)
    const dialogAchievement = ref(null)
    const dialogMultipleChoiceList = computed(() =>{
        const achievement = dialogAchievement.value
        const tempMultipleChoiceList = []
        if(achievement?.MultipleID){
            multipleChoice[achievement.MultipleID].forEach(AchievementID => {
                if(AchievementID !== achievement.Id){
                    const ach_ = achievements.value.find(ach => ach.Id === AchievementID)
                    if(!ach_) return
                    tempMultipleChoiceList.push(ach_)
                }
            })
        }
        return tempMultipleChoiceList
    })
    const showStrategyDialog = (achievement) =>{
        dialogVisible.value = true
        dialogAchievement.value = achievement
    } 
    
    //成就攻略 url 数据
    let achievementStrategy = {}
    let strategyInfo = {}
    const showStrategyList = computed(() => {
        const strategies = achievementStrategy[dialogAchievement?.value.Id] ?? []
        const showStrategyList = []
        for(const index in strategies){
            const strategy = strategyInfo[strategies[index]]

            if(!Object.keys(authors.value).includes(String(strategy.author))) continue

            showStrategyList.push(strategy)     
        }
        return showStrategyList 
    })

    const achievements = ref([])
    const achievementFirstClasses = ref([])
    const achievementSecondClasses = ref([])

    const initialAchievementsInfo = () => {
        Promise.all([
            fetch(`/src/jsons/AchievementInfo.json?v=${achievementInfoVersion}`).then(response => response.json()),
            fetch(`/src/jsons/AchievementFirstClass.json?v=${achievementFirstClassVersion}`).then(response => response.json()),
            fetch(`/src/jsons/AchievementSecondClass.json?v=${achievementSecondClassVersion}`).then(response => response.json()),
            fetch(`/src/jsons/MultipleChoice.json?v=${multipleChoiceVersion}`).then(response => response.json()),
            fetch(`/src/jsons/NotAvailableAchievement.json?v=${notAvailableAchievementVersion}`).then(response => response.json()),
            fetch(`/src/jsons/AchievementStrategy.json?v=${achievementStrategyVersion}`).then(response => response.json()),
            fetch(`/src/jsons/StrategyInfo.json?v=${strategyInfoVersion}`).then(response => response.json()),
        ])
        .then(([achievementInfo, achievementFirstClass, achievementSecondClass, multiplechoice, notavailable, achievementsteategy, strategyinfo]) => {
            achievements.value = []

            achievementFirstClass[0] = { Id: 0, Name: '全部' }
            achievementFirstClasses.value = achievementFirstClass

            achievementSecondClasses.value = []
            multipleChoice = multiplechoice
            notAvailable = notavailable
            achievementStrategy = achievementsteategy
            strategyInfo = strategyinfo

            Object.values(achievementInfo).forEach(ach => {
                achievements.value.push(new Achievement(ach))
            })

            getUserAchievement()            
            initialMultipleChoice()
            initialAchievementsStatus()
            initialNotAvailable()

            // achievements.value.sort((a, b) => {
            //     const achievementSecondClassA = achievementSecondClass[a.SecondClassId]
            //     const achievementSecondClassB = achievementSecondClass[b.SecondClassId]

            //     const FirstClassPriorityA = achievementSecondClassA.FirstClassId
            //     const FirstClassPriorityB = achievementSecondClassB.FirstClassId

            //     if (FirstClassPriorityA !== FirstClassPriorityB) 
            //         return FirstClassPriorityA - FirstClassPriorityB 

            //     const SecondClassPriorityA = achievementSecondClassA.Priority
            //     const SecondClassPriorityB = achievementSecondClassB.Priority

            //     if (SecondClassPriorityA !== SecondClassPriorityB) 
            //         return SecondClassPriorityA - SecondClassPriorityB 

            //     return a.Priority - b.Priority 
            // })

            achievementSecondClasses.value.push(new AchievementAllSecondClass({
                Id: 0,
                Name: "ALL",
                FirstClassId: 0,
                Priority: 0
            }, achievements.value))
            handleSelectVersionList(0, achievements.value)

            Object.values(achievementSecondClass).forEach(value => {
                const achs = achievements.value.filter(achievement => achievement.SecondClassId === value.Id)
                achievementSecondClasses.value.push(new AchievementSecondClass(value, achs))
                handleSelectVersionList(value.Id, achs)
            })

            achievementSecondClasses.value.sort((a, b) => {
                const FirstClassPriorityA = a.FirstClassId
                const FirstClassPriorityB = b.FirstClassId
                if (FirstClassPriorityA !== FirstClassPriorityB) 
                    return FirstClassPriorityA - FirstClassPriorityB

                return a.Priority - b.Priority 
            })
        })
        .catch(error => {
            // 处理加载或转换错误
            console.error(error);
        });
    }

    const urlFirstClassId = ref(0)
    const showFirstClassId = computed(() => {
        return achievementFirstClasses.value[urlFirstClassId.value]?.Id ?? 0
    })
    const showAchievementSecondClasseses = computed(() => {
        if(showFirstClassId.value === 0) return achievementSecondClasses.value
        
        return achievementSecondClasses.value.filter(secondClass => showFirstClassId.value === secondClass.FirstClassId || secondClass.Id === 0 )
    })

    const urlSecondClassId = ref(0)
    const showSecondClassId = computed(() => {
        if(!showAchievementSecondClasseses.value.some(SecondClass => SecondClass.Id === urlSecondClassId.value)){
            return 0
        }

        return urlSecondClassId.value
    })
    const changeShowSecondClassID = (firstClassId, secondClassID) =>{
        urlFirstClassId.value = parseInt(firstClassId)
        urlSecondClassId.value = parseInt(secondClassID)
    }
    watch(showSecondClassId, () => {
        const achievementMain = document.getElementById('achievement-main-scroller')
        // console.log(achievementMain)
        nextTick(() => {
            achievementMain.scrollTop = 0
        })
    })

    //显示版本列表
    const showVersionList = ref([])
    //可选择列表缓存
    const selectVersionListCache = ref({})
    const handleSelectVersionList = (SecondClassId, achs) => {   
        const VersionSet = new Set()
        achs.forEach(achievement => {
            VersionSet.add(achievement.Version)
        })

        const format = { value: '', label: '' };
        const result = Array.from(VersionSet).map(value => ({ ...format, value, label: value }))
        result.sort((a, b) => b.value - a.value)

        //添加对应系列版本信息缓存
        selectVersionListCache.value[SecondClassId] = result
    }
    //可选择列表
    const selectVersionList = computed(() => {
        return selectVersionListCache.value[showSecondClassId.value]
    })
    //搜索文本
    const searchContent = ref("")
    //隐藏类成就筛选
    const showHiddenType = ref('all')
    const selectHiddenList = [
        {
            value: 'all',
            label: '全部'
        },
        {
            value: 'hidden',
            label: '隐藏'
        },
        {
            value: 'unhidden',
            label: '非隐藏'
        }
    ]
    //奖励类成就筛选
    const showRewardType = ref('all')
    const selectRewardList = [
        {
            value: 'all',
            label: '全部'
        },
        {
            value: 'gold',
            label: '金'
        },
        {
            value: 'silver',
            label: '银'
        },
        {
            value: 'copper',
            label: '铜'
        }
    ]
    //完成程度类成就筛选
    const showCompletedType = ref('all')
    const selectCompletedList = [
        {
            value: 'all',
            label: '全部'
        },
        {
            value: 'completed',
            label: '已完成'
        },
        {
            value: 'uncompleted',
            label: '未完成'
        }
    ]
    //获取状态类成就筛选
    const showAvailableType = ref('all')
    const selectAvailableList = [
        {
            value: 'all',
            label: '全部'
        },
        {
            value: 'available',
            label: '可获取'
        },
        {
            value: 'not-available',
            label: '暂不可获取'
        }
    ]

    //未完成优先
    const incompletePriority = ref(false)

    const showAchievements = computed(() => {
        const tempSecondClass = achievementSecondClasses.value.find(SecondClass => SecondClass.Id === showSecondClassId.value)
        //找不到对应系列返回全部
        let tempShowAchievements = []
        if(!tempSecondClass) tempShowAchievements = achievements.value
        else tempShowAchievements = tempSecondClass.Achievements

        tempShowAchievements = tempShowAchievements.filter(achievement =>{
            // 隐藏类成就筛选
            if(showHiddenType.value !== 'all') {
                if(showHiddenType.value === 'hidden'){
                    if(!achievement.isHidden)
                        return false
                }
                else if(showHiddenType.value === 'unhidden'){
                    if(achievement.isHidden)
                        return false                    
                }
            }

            // 奖励类成就筛选
            if(showRewardType.value !== 'all') {
                if(showRewardType.value === 'gold'){
                    if(achievement.Reward != 3)
                        return false
                }
                else if(showRewardType.value === 'silver'){
                    if(achievement.Reward != 2)
                        return false                    
                }
                else if(showRewardType.value === 'copper'){
                    if(achievement.Reward != 1)
                        return false                    
                }
            }

            // 完成程度类成就筛选
            if(showCompletedType.value !== 'all') {
                if(showCompletedType.value === 'completed'){
                    if(achievement.Status === 1)
                        return false
                }
                else if(showCompletedType.value === 'uncompleted'){
                    if(achievement.Status !== 1)
                        return false
                }
            }

            // 获取状态类成就筛选
            if(showAvailableType.value !== 'all') {
                if(showAvailableType.value === 'available'){
                    if(achievement.isNotAvailable)
                        return false
                }
                else if(showAvailableType.value === 'not-available'){
                    if(!achievement.isNotAvailable)
                        return false
                }
            }

            //版本筛选
            if(showVersionList.value.length > 0)
                if(!showVersionList.value.includes(achievement.Version))
                    return false
                
            //搜索框筛选
            if(!achievement.Name.includes(searchContent.value) && 
            !achievement.Desc.includes(searchContent.value))
                return false

            return true
        })

        //未完成成就优先
        if(incompletePriority.value)
            tempShowAchievements.sort((a, b) => {
                if(a.Status === 1 && b.Status !== 1) return -1
                if(a.Status !== 1 && b.Status === 1) return 1
                return 0
            })
        return tempShowAchievements
    })

    const showAchievementSecondClass = ref(
        new AchievementSecondClass({
            Id: 99,
            Name: "本页成就",
            FirstClassId: 0,
            Priority: -1
        }, showAchievements.value)
    )

    watch(showAchievements, () => showAchievementSecondClass.value.updateAchievements(showAchievements.value))

    //获取成就界面筛选设置缓存
    const getAchievementFilterConfig = () => {
        if(!achievementFilterCacheConfig.value) return

        // 从缓存中读取名为 ACHIEVEMENT_FILTER_CONFIG_KEY 的数据
        const tempAchievementFilter = localStorage.getItem(ACHIEVEMENT_FILTER_CONFIG_KEY)

        // 检查是否存在名为 ACHIEVEMENT_FILTER_CONFIG_KEY 的数据
        if (tempAchievementFilter !== null) {
            // 数据存在，将其从字符串转换为对象
            const data = JSON.parse(tempAchievementFilter)

            showHiddenType.value = data?.showHiddenType ?? "all"
            showRewardType.value = data?.showRewardType ?? "all"
            showCompletedType.value = data?.showCompletedType ?? "all"
            showAvailableType.value = data?.showAvailableType ?? "all"
            incompletePriority.value = data?.incompletePriority ?? false
        } else {
            // 数据不存在，执行相应的操作
            showHiddenType.value = "all"
            showRewardType.value = "all"
            showCompletedType.value = "all"
            showAvailableType.value = "all"
            incompletePriority.value = false
        }
    }
    //保存成就界面筛选设置缓存
    const saveAchievementFilterConfig = () => {
        if(!achievementFilterCacheConfig.value) return

        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem(ACHIEVEMENT_FILTER_CONFIG_KEY, JSON.stringify({
            showHiddenType: showHiddenType.value,
            showRewardType: showRewardType.value,
            showCompletedType: showCompletedType.value,
            showAvailableType: showAvailableType.value,
            incompletePriority: incompletePriority.value
        }))
    }

    watch([showHiddenType, showRewardType, showCompletedType, showAvailableType, incompletePriority, achievementFilterCacheConfig], saveAchievementFilterConfig)

    //全选本页
    const selectAll = computed(() => {
        // return true
         return showAchievements.value.every(achievement => {
            if (achievement?.MultipleID) return true
            if (achievement.isNotAvailable) return true
            return achievement.Status !== 1
        })
    })
    const handleSelectAll = () => {
        if (selectAll.value) {
            showAchievements.value.forEach(achievement => {
                if (achievement?.MultipleID) return
                if (achievement.isNotAvailable) return
                if (achievement.Status === 1) return

                achievement.Status = 1
                handleUserAchievementList(achievement.Id, achievement.Status, false)
            })
        }
        else{
            showAchievements.value.forEach(achievement => {
                if (achievement?.MultipleID) return
                if (achievement.isNotAvailable) return
                if (achievement.Status === 3) return

                achievement.Status = 3
                handleUserAchievementList(achievement.Id, achievement.Status, false)
            })
        }

        saveUserAchievement()
    }

    const handleAchevementStatus = (achievement, save = true) => {
        if(!(achievement instanceof Achievement)){
            throw new Error("传入achievement不是Achievement类型")
        }
        if (achievement.isNotAvailable) return

        if (achievement.Status === 1) {
            // 修改成就状态为已完成
            achievement.Status = 3
            handleUserAchievementList(achievement.Id, achievement.Status, save)
            if(achievement?.MultipleID){
                // 修改成就状态为无法完成
                multipleChoice[achievement.MultipleID].forEach(AchievementID => {
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
            // 修改成就状态为未完成
            achievement.Status = 1
            handleUserAchievementList(achievement.Id, achievement.Status, save)
            if(achievement?.MultipleID){
                // 修改成就状态为未完成
                multipleChoice[achievement.MultipleID].forEach(AchievementID => {
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

    return {  
        PolychromeImg, 
        CopperImg,
        SilverImg,
        GoldImg,
        achievements,
        achievementFirstClasses,
        achievementSecondClasses,
        showStrategyList,
        dialogVisible,
        dialogAchievement,
        dialogMultipleChoiceList,
        showFirstClassId,
        showAchievementSecondClasseses,
        showSecondClassId, 
        showAchievements,
        showAchievementSecondClass, 
        showVersionList,
        selectVersionList,
        searchContent,
        showHiddenType,
        selectHiddenList,
        showRewardType,
        selectRewardList,
        showCompletedType,
        selectCompletedList,
        showAvailableType,
        selectAvailableList,
        incompletePriority,
        selectAll,
        saveUserAchievement,
        changeShowSecondClassID,
        showStrategyDialog,
        // isShowAchievement,
        initialAchievementsInfo,
        handleAchevementStatus,
        handleSelectAll,
        findUserAchievementList,
        handleUserAchievementList,
        getAchievementFilterConfig
    }
})
