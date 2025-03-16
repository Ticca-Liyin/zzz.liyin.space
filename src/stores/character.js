import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { characterInfoVersion } from '@/utils/version.js'

export const useCharacterStore = defineStore('character', () => {
    const specialties = {
        "强攻": {
            ID: 1,
            name: "强攻",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/78d407e2839038da13d26ad84b99a6b8_8151225937174652019.png"
        },
        "击破": {
            ID: 2,
            name: "击破",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/a798cde5543596aae302d7fc037df2d5_4111998480888596222.png"
        },
        "异常": {
            ID: 3,
            name: "异常",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/55982d13c3284d382a9a59ce9f5e5d50_2052082579823154975.png"
        },
        "支援": {
            ID: 4,
            name: "支援",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/e1ce1ff7a8c3debf3235b2bbd94bd4c0_2060958246427347333.png"
        },
        "防护": {
            ID: 5,
            name: "防护",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/ba974570d0627f78131b5c09ffb630f2_1224778078231447651.png"
        }
    }

    const stats = {
        "以太": {
            ID: 1,
            name: "以太",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/4b33b2be46b732ab987c6b12903bc8c4_6165206938504838110.png"
        },
        "火": {
            ID: 2,
            name: "火",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/f7bdcd7c6574c22e6c90f25cae025376_3782022421620830515.png"
        },
        "冰": {
            ID: 3,
            name: "冰",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/a99ef1d28678ab2e82b25099416e2802_8886922862138996075.png"
        },
        "物理": {
            ID: 4,
            name: "物理",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/b34f33a07ddfae7bbd014a5e36443ea4_127526883819084638.png"
        },
        "电": {
            ID: 5,
            name: "电",
            avatar: "https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2024/05/07/23f0846bd60219d09ab419b831ce2de7_2106359761671844521.png"
        },
    }
    
    const characters = ref({})
    const characterDefaultAvatar = '/src/images/icon/characterIcon.png'
    const characterDefaultName = '代理人'

    const initialCharactersInfo = () => {
        fetch(`/src/jsons/CharacterInfo.json?v=${characterInfoVersion}`).then(response => response.json())
        .then(characterInfo => {
            characters.value = characterInfo
            // console.log(characters.value)
        })
        .catch(error => console.error(error))
    }

    const getCharacterAvatar = (charID) => {
        if(!(charID in characters.value)){
            return characterDefaultAvatar
        }

        const char = characters.value[charID]

        if (!char?.avatar) {
            return characterDefaultAvatar
        }

        return 'https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin' + char.avatar
    }

    const getCharacterAvatarName = (charID) => {
        if(charID in characters.value){
            return characters.value[charID].name
        }
        else{
            return characterDefaultName
        }
    }

    const getStatsAvatar = (stats_) => {
        return stats[stats_].avatar
    }

    const getSpecialtyAvatar = (specialty) => {
        return specialties[specialty].avatar
    }

    return {  
        stats,
        specialties,
        characters,
        characterDefaultAvatar,
        characterDefaultName,
        initialCharactersInfo,
        getCharacterAvatar,
        getCharacterAvatarName,
        getStatsAvatar,
        getSpecialtyAvatar,
    }
})