<script setup>
import CharacterShowBox from './CharacterShowBox.vue';
import { useCharacterStore } from '@/stores/character';
import { useCharacterSettingStore } from '@/stores/characterSetting';
import { useThemeStore } from '@/stores/theme'
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

const characterStore = useCharacterStore()
const { getStatsAvatar, getSpecialtyAvatar } = characterStore

const characterSettingStore = useCharacterSettingStore()
const { scale, useWheelEvent, showCharacters } = storeToRefs(characterSettingStore)
const { scaleBaseIncrement, scaleMin, scaleMax} = characterSettingStore

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const statsList = ["以太", "火", "冰", "物理", "电"]
const specialtiesList = ["强攻", "击破", "异常", "支援", "防护", "命破"]

const characterList = computed(() => {
    const result = []

    // 外层循环控制行数
    for (let i = 0; i < statsList.length; i++) {
        // 创建一个空数组用于存储每一行的元素
        result[i] = [];
        
        // 内层循环控制列数
        for (let j = 0; j < specialtiesList.length; j++) {
            // 在每一行中添加元素
            result[i][j] = []
        }
    }

    // 遍历代理人列表，将相同 stats 和 specialty 的代理人放入对应位
    showCharacters.value.forEach(character => {
        const row = statsList.indexOf(character.stats); 
        const col = specialtiesList.indexOf(character.specialty);
        
        result[row][col].push(character);
    });

    // console.log(result)
    return result
})

// 鼠标事件监听实现拖拽移动功能
let isCharacterDragging = false
let hasRemove = false  // 用于判断是否已经移除过 window.open 方法，避免重复移除

let startX = 0
let startY = 0

// 保存 window.open 方法的原型，用于 拖拽过程中临时禁用拖拽跳转事件，避免拖拽过程中触发点击跳转事件
const originalWindowOpen = window.open;

const startCharacterDrag = (event) => {
    isCharacterDragging = true;
    startX = event.clientX;
    startY = event.clientY;
}

const handleCharacterDrag = (event) => {
    const characterContainer = document.getElementById('character-container')

    if (isCharacterDragging) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if ((deltaX !== 0 || deltaY !== 0) && !hasRemove) {
            // 临时禁用 window.open 方法，避免拖拽过程中触发点击跳转事件
            window.open = function() {};
            hasRemove = true;
        }

        characterContainer.scrollLeft -= deltaX;
        characterContainer.scrollTop -= deltaY;

        startX = event.clientX;
        startY = event.clientY;
    }
}

const endCharacterDrag = () => {
    isCharacterDragging = false;
    
    setTimeout(() => {
        window.open = originalWindowOpen;
    }, 100)

    hasRemove = false
}

// 鼠标滚轮事件监听实现缩放

const handleCharacterWheel = (event) => {
    if(useWheelEvent.value){
        event.preventDefault(); // 阻止默认滚轮事件

        const delta = event.deltaY > 0 ? -scaleBaseIncrement : scaleBaseIncrement; // 根据滚轮滚动方向确定缩放增量
        let scale_ = scale.value + delta; // 更新缩放比例

        // 限制缩放范围在 scaleMin 到 scaleMax 之间
        scale.value = Math.min(Math.max(scale_, scaleMin), scaleMax);
    }
}

// 手机端触摸事件监控移动及缩放
let isCharacterTouching = false

let CharacterTouchingstartX = 0
let CharacterTouchingstartY = 0
let CharacterTouchingInitialDistance = 0;

const handleCharacterTouchStart = (event) => {
    const touches = event.touches;
    if (touches.length === 1) {
        isCharacterTouching = true;
        CharacterTouchingstartX = touches[0].clientX;
        CharacterTouchingstartY = touches[0].clientY;
    }
    if (touches.length === 2) {
        const x1 = touches[0].clientX;
        const y1 = touches[0].clientY;
        const x2 = touches[1].clientX;
        const y2 = touches[1].clientY;
        CharacterTouchingInitialDistance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
};

const handleCharacterTouchMove = (event) => {
    event.preventDefault();

    const touches = event.touches;
    const characterContainer = document.getElementById('character-container')

    if (touches.length === 1 && isCharacterTouching) {
            const deltaX = touches[0].clientX - CharacterTouchingstartX;
            const deltaY = touches[0].clientY - CharacterTouchingstartY;

            characterContainer.scrollLeft -= deltaX;
            characterContainer.scrollTop -= deltaY;

            CharacterTouchingstartX = touches[0].clientX;
            CharacterTouchingstartY = touches[0].clientY;
    }
    if (touches.length === 2) {
        const x1 = touches[0].clientX;
        const y1 = touches[0].clientY;
        const x2 = touches[1].clientX;
        const y2 = touches[1].clientY;
        const currentDistance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
        const distanceChange = currentDistance - CharacterTouchingInitialDistance;
        
        console.log('Distance Change:', distanceChange);
        
        const delta = distanceChange > 0 ? scaleBaseIncrement : -scaleBaseIncrement ; // 根据距离变化确定缩放增量
        let scale_ = scale.value + delta * 0.5; // 更新缩放比例

        // 限制缩放范围在 scaleMin 到 scaleMax 之间
        scale.value = Math.min(Math.max(scale_, scaleMin), scaleMax);
        
        CharacterTouchingInitialDistance = currentDistance; // 更新初始距离
    }
};

const handleCharacterTouchEnd = () => {
    isCharacterTouching = false;
}

</script>

<template>
    <div class="character-container" id="character-container" @wheel="handleCharacterWheel" @mousedown="startCharacterDrag" @mousemove="handleCharacterDrag" 
        @mouseup="endCharacterDrag" @mouseleave="endCharacterDrag" @touchstart="handleCharacterTouchStart" @touchmove="handleCharacterTouchMove" @touchend="handleCharacterTouchEnd"> 
        <div class="character-grid" id="character-grid" :style="`transform: scale(${scale});`">

            <div class="grid-flex-center grid-grey-border"></div>

            <!-- 添加 属性 列表头 -->
            <div v-for="(stats, index) in statsList" :key="stats"
            :style="{ gridRow: index + 2, gridColumn: 1,}" 
            class="grid-flex-center grid-grey-border grid-stats-padding">
                <img class="stats-avatar" draggable="false" :src="getStatsAvatar(stats)"  :alt="stats">
            </div>

            <!-- 添加 特性 行表头 -->
            <div v-for="(specialty, index) in specialtiesList" :key="specialty" 
            :style="{ gridRow: 1, gridColumn: index + 2,}" 
            class="grid-flex-center grid-grey-border grid-specialty-padding">
                <img class="specialty-avatar" draggable="false" :src="getSpecialtyAvatar(specialty)"  :alt="specialty">
            </div>

            <!-- 添加 对应属性及特性的 代理人信息 -->
            <template v-for="(row, rowIndex) in characterList">
                <CharacterShowBox
                    v-for="(cell, columnIndex) in row" :key="rowIndex * characterList.length+ columnIndex" 
                    :characterList="cell" :style="{ gridRow: rowIndex + 2, gridColumn: columnIndex + 2,}"
                    class="grid-flex-center grid-grey-border grid-character-padding"
                ></CharacterShowBox>
            </template>
        </div>
    </div>
</template>

<style scoped>
.character-container{
    background-color: var(--liyin-char-bg-color);
    user-select: none;
    /* position: relative; */
    /* padding: 10px; */
    /* margin: 10px; */
}

.character-grid {
    /* width: 100%;
    height: 100%; */
    display: grid;
    grid-template-rows: 8;
    grid-template-columns: 8;
    /* position: absolute;
    top: 0;
    left: 0;  */
    transform-origin: top left;
    transform: scale(1);
    padding: 0 10px 10px 10px;
    /* width: 2000px; */
    /* grid-template-rows: repeat(8, 1fx);
    grid-template-columns: repeat(8, 1fx); */
    /* grid-template-rows: repeat(8, 120px);
    grid-template-columns: repeat(8, 120px); */
    /* grid-gap: 10px; */
}

.grid-flex-center {
    display: flex;
    /* padding: 10px; */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    text-align: center;
}

.grid-grey-border {
    border: 1px solid var(--liyin-char-gird-border-color);
}

.grid-stats-padding{
    padding: 20px;
}

.grid-specialty-padding{
    padding: 20px;
}

.grid-character-padding{
    padding: 10px;
}

.specialty-avatar {
    width: 60px;
    opacity: .5;
}

.stats-avatar {
    width: 60px;
    opacity: .8;
}

.character-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}   
.character-container::-webkit-scrollbar-track {
    background-color: transparent;
}
.character-container::-webkit-scrollbar-thumb {
    background-color: rgba(139, 139, 139, 0.4);
    border-radius: 10px;
}
.character-container::-webkit-scrollbar-button {
    display: none;
}
.character-container::-webkit-scrollbar-corner {
    background-color: var(--liyin-char-bg-color); 
}
</style>