import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCharacterStore } from '@/stores/character';
import { useIsMobileStore } from '@/stores/isMobile'
import { storeToRefs } from 'pinia';

const characterStore = useCharacterStore()
const { characters } = storeToRefs(characterStore)

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

export const useCharacterSettingStore = defineStore('characterSetting', () => {
    //角色区域点击跳转事件相关
    const MiYoShe = '米游社'
    const HoYoWiki = 'HoYoWiki'
    const YuChengBei = '玉衡杯数据库'
    const BiliWiki = 'biliWiki'

    const toMiYoShe = (charId) => {
        const id = characters.value[charId]?.MiYoSheId

        if (id) {
            window.open(`https://baike.mihoyo.com/zzz/wiki/content/${id}/detail`, '_blank')
        }
        else{
            ElMessage({
                showClose: true,
                message: `米游社暂无 ${characters.value[charId].name} 相关信息或本网站未及时更新`,
                type: 'error',
            })
        }
    }

    const toHoYoWiki = (charId) => {
        const id = characters.value[charId]?.HoYoWikiId

        if (id) {
            window.open(`https://wiki.hoyolab.com/pc/zzz/entry/${id}?lang=zh-cn`, '_blank')
        }
        else{
            ElMessage({
                showClose: true,
                message: `HoYoWiKi 暂无 ${characters.value[charId].name} 相关信息或本网站未及时更新`,
                type: 'error',
            })
        }
    }

    const toYuChengBei = (charId) => {
        const id = characters.value[charId]?.YuChengBeiId

        window.open('https://homdgcat.wiki/zzz/char?lang=CH#_' + id, '_blank');
    }

    const toBiliWiki = (charId) => {
        let name = characters.value[charId].name

        window.open('https://wiki.biligame.com/zzz/' + name, '_blank');
    }

    const WebsiteNameList = {
        [MiYoShe]: {
           value: MiYoShe,
           label: MiYoShe,
           jump: toMiYoShe
        },
        [HoYoWiki]: {
            value: HoYoWiki,
            label: HoYoWiki,
            jump: toHoYoWiki
        },
        // [YuChengBei]: {
        //     value: YuChengBei,
        //     label: YuChengBei,
        //     jump: toYuChengBei
        // },
        // [BiliWiki]: {
        //     value: BiliWiki,
        //     label: BiliWiki,
        //     jump: toBiliWiki
        // },
    }
    const toWebsiteName = ref(Object.values(WebsiteNameList)[0].value)

    const handleToWebsite = (charId) => {
        const jump = WebsiteNameList[toWebsiteName.value]?.jump

        if (typeof jump === 'function' && jump instanceof Function) 
            jump(charId)

        else
            console.error(`网站名称为 ${toWebsiteName.value} 的跳转对象无跳转事件`)
    }

    // 缩放相关设置
    const scale = ref(1);
    const useWheelEvent = ref(false)
    const scaleBaseIncrement = 0.05 // 缩放基础增量
    const scaleMax = 1 // 缩放最大值
    const scaleMin = 0.2 // 缩放最小值

    const CHAR_VIEW_SETTING_KEY = "zzz-CharacterViewSettingConfig"

    //获取角色界面设置缓存
    const getCharacterSettingConfig = () => {
        // 从缓存中读取名为 CHAR_VIEW_SETTING_KEY 的数据
        const tempCharacterViewSetting = localStorage.getItem(CHAR_VIEW_SETTING_KEY)
        const defaultScale = isMobile.value ? 0.4 : 1

        // 检查是否存在名为 CHAR_VIEW_SETTING_KEY 的数据
        if (tempCharacterViewSetting !== null) {
            // 数据存在，将其从字符串转换为对象
            const data = JSON.parse(tempCharacterViewSetting)
            
            toWebsiteName.value = data?.toWebsiteName ?? Object.values(WebsiteNameList)[0].value
            scale.value = data?.scale ?? defaultScale
            useWheelEvent.value = data?.useWheelEvent ?? false
        } else {
            // 数据不存在，执行相应的操作
            toWebsiteName.value = Object.values(WebsiteNameList)[0].value
            scale.value = defaultScale
            useWheelEvent.value = false
        }
    }
    //保存角色界面设置缓存
    const saveCharacterSettingConfig = () => {
        // 将对象转换为字符串，并将其存储在缓存中
        localStorage.setItem(CHAR_VIEW_SETTING_KEY, JSON.stringify({
            toWebsiteName: toWebsiteName.value,
            scale: scale.value,
            useWheelEvent: useWheelEvent.value,
        }))
    }

    watch([toWebsiteName, scale, useWheelEvent], saveCharacterSettingConfig)

    // 显示的 角色 相关设置
    const showAttackTypeList = ref([])
    const selectAttackTypeList = [
        {
            value: '斩击',
            label: '斩击'
        },
        {
            value: '穿透',
            label: '穿透'
        },
        {
            value: '打击',
            label: '打击'
        }
    ]

    const showRankList = ref([])
    const selectRankList = [
        {
            value: 'A',
            label: 'A'
        },
        {
            value: 'S',
            label: 'S'
        }
    ]

    const showWarpList = ref([])
    const selectWarpList = [
        {
            value: 'limited',
            label: '限定'
        },
        {
            value: 'not-limited',
            label: '非限定'
        }
    ]

    //显示版本列表
    const showVersionList = ref([])
    //可选择列表
    const selectVersionList = computed(() => {
        const VersionSet = new Set()

        Object.values(characters.value).forEach(char => {
            VersionSet.add(char.version)
        })

        const format = { value: '', label: '' };
        const result = Array.from(VersionSet).map(value => ({ ...format, value, label: value.toFixed(1) }))
        result.sort((a, b) => b.value - a.value)

        return result
    })

    //显示阵营列表
    const showFactionList = ref([])
    const factionSortList = [
        "狡兔屋", "维多利亚家政", "白祇重工", "奥波勒斯小队", "对空洞特别行动部第六课", "新艾利都治安局"
    ]
    //可选择列表
    const selectFactionList = computed(() => {
        const FactionSet = new Set()

        Object.values(characters.value).forEach(char => {
            if(Array.isArray(char.faction)){
                char.faction.forEach(faction => {
                    if(faction){
                        FactionSet.add(faction)
                    }
                })                
            }
        })

        const format = { value: '', label: '' };
        const result = Array.from(FactionSet).map(value => ({ ...format, value, label: value }))
        result.sort((a, b) => {
            const indexA = factionSortList.indexOf(a.value);
            const indexB = factionSortList.indexOf(b.value);
            
            return (indexA !== -1 ? indexA : factionSortList.length) - (indexB !== -1 ? indexB : factionSortList.length);
        })
        
        return result
    })

    const showCharacters = computed(() => {
        return Object.values(characters.value).filter(character =>{
            // 显示角色的星数
            if(showRankList.value.length > 0)
                if(!showRankList.value.includes(character.rank))
                    return false

            // 显示角色的限定程度
            if(showWarpList.value.length > 0)
                if(!showWarpList.value.includes(character.warp))
                    return false

            // 显示角色的版本
            if(showVersionList.value.length > 0)
                if(!showVersionList.value.includes(character.version))
                    return false

            // 显示角色的阵营
            if(showFactionList.value.length > 0){
                if(Array.isArray(character.faction)){
                    if(character.faction.every(faction => !showFactionList.value.includes(faction)))
                        return false
                }else {
                    return false
                }
            }

            return true
        })
    })

    const showCharactersTotal = computed(() => {
        return showCharacters.value.length
    })

    return {
        WebsiteNameList,
        toWebsiteName,
        handleToWebsite,
        scale,
        useWheelEvent,
        scaleBaseIncrement,
        scaleMax,
        scaleMin,
        getCharacterSettingConfig,
        showAttackTypeList,
        selectAttackTypeList,
        showRankList,
        selectRankList,
        showWarpList,
        selectWarpList,
        showVersionList,
        selectVersionList,
        showFactionList,
        selectFactionList,
        showCharacters,
        showCharactersTotal,
    }
})