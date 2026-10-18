import { storeToRefs } from 'pinia'
import { useUserInfoStore } from '@/stores/userInfo'
import { useTextjoinStore } from '@/stores/achievement/setting/textjoin'

const textjoinStore = useTextjoinStore()
const { getUserTextjoinValue } = textjoinStore

const userInfoStore = useUserInfoStore()
const { currentUserInfo } = storeToRefs(userInfoStore)

const malePattern = /\{M#([^\}]+)\}/g
const femalePattern = /\{F#([^\}]+)\}/g

export class Achievement {
    constructor(achievement) {
        this.Id = achievement.Id
        this.SecondClassId = achievement.SecondClassId
        this.SrcName = achievement.Name
        this.SrcDesc = achievement.Desc
        this.Priority = achievement.Priority
        this.Reward = achievement.Reward
        this.Hidden = achievement.Hidden
        this.Version = achievement.Version
        this.Status = 1
    }

    get Name() {
        let result = this.SrcName

        result = result.replace(malePattern, (match, title) => {
            return getUserTextjoinValue(currentUserInfo.value.tokenID.toString(), '性别') === '男' ? result.replace(match, title) : '';
        })

        result = result.replace(femalePattern, (match, title) => {
            return getUserTextjoinValue(currentUserInfo.value.tokenID.toString(), '性别') === '女' ? result.replace(match, title) : '';
        })

        return result
    }

    get Desc(){
        let result = this.SrcDesc

        result = result.replace(malePattern, (match, title) => {
            return getUserTextjoinValue(currentUserInfo.value.tokenID.toString(), '性别') === '男' ? result.replace(match, title) : '';
        })

        result = result.replace(femalePattern, (match, title) => {
            return getUserTextjoinValue(currentUserInfo.value.tokenID.toString(), '性别') === '女' ? result.replace(match, title) : '';
        })

        return result
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
        if(this.CustomNotAchieved) return "自定义暂不可获得"
        if(this.isNotAvailable) return "暂不可获得"
        if(this.Status === 1) return "未完成"
        if(this.Status === 2) return "已选其他"
        if(this.Status === 3) return "已完成"
        return "未知状态"
    }
}
