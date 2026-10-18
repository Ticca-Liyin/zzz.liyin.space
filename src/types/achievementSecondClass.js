/**
 * 二级分类（系列）领域对象。
 * 展示用「当前一级全部」投影：Id 与 FirstClassId 均为当前一级 Id（由 showSeries 生成）。
 */
export class AchievementSecondClass {
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
        const selectedMultipleIDs = [];
        let totalAchievements = 0;

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
        const selectedMultipleIDs = [];
        let total = 0;

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
        this.Achievements.forEach(achievement => {
            if (achievement.Status == 3) count++
        })
        return count
    }

    //系列相关成就已获得菲林总数
    get completedPolychromeTotal(){
        let total = 0
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
    get notAvailableAchievementsLength(){
        const selectedMultipleIDs = [];
        let totalAchievements = 0;

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
        return this._countByReward(1)
    }

    // 系列银级相关成就总数
    get SilverAchievementsLength(){
        return this._countByReward(2)
    }

    // 系列金级相关成就总数
    get GoldAchievementsLength(){
        return this._countByReward(3)
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

    _countByReward(reward) {
        const selectedMultipleIDs = [];
        let totalAchievements = 0;

        for (const achievement of this.Achievements) {
            if (achievement.isNotAvailable) continue
            if (achievement.Reward !== reward) continue

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

    updateAchievements(achievements) {
        this._Achievements = achievements
    }
}
