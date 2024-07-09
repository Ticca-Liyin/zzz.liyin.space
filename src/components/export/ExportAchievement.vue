<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useAchievementStore } from '@/stores/achievement';
import { useIsMobileStore } from '@/stores/isMobile'
import { storeToRefs } from 'pinia';
import saveJson from './saveJson';
import { utils, writeFile } from 'xlsx';

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const achievementStore = useAchievementStore()
const { achievementFirstClasses, achievementSecondClasses } = storeToRefs(achievementStore);
const { findUserAchievementList } = achievementStore

const doExport = (typeString) => {
    if(typeString === 'liyin'){
        exportLiyin()
    }
    else if(typeString === 'excel'){
        exportExcel()
    }
    else {
        exportLiyin()
    }
}

const exportLiyin = () => {
    const nowDate = new Date()
    
    const exportData = {
        info: {
            export_app: "liyin",
            export_timestamp: nowDate.getTime(),
        },
        list: findUserAchievementList()?.list ?? {}
    }

    const filename = `liyin.achievement.${formatDate(nowDate)}.json`

    saveJson(exportData, filename)
}

const exportExcel = () => {
    const nowDate = new Date()

    const filename = `liyin.achievement.${formatDate(nowDate)}.xlsx`
    // 准备数据
    const data = []
    for(let i = 0; i < achievementSecondClasses.value.length; i++){
        if(achievementSecondClasses.value[i].Id === 0) continue
        for(const achievement of achievementSecondClasses.value[i].Achievements){
            const row = {
                版本: achievement.Version,
                第一分类: achievementFirstClasses.value[achievementSecondClasses.value[i].FirstClassId].Name,
                第二分类: achievementSecondClasses.value[i].Name,
                编号: achievement.Id,
                名称: achievement.Name,
                描述: achievement.Desc,
                奖励: achievement.PolychromeNum,
                是否隐藏: achievement.isHidden ? '隐藏' : '',
                获取状态: achievement.StatusDesc,
            }
            data.push(row)
        }
    }

    // 创建工作簿对象
    const workbook = utils.book_new();

    // 创建工作表对象
    const worksheet = utils.json_to_sheet(data);

    const colWidths = [5, 10, 13, 9, 25, 60, 5, 10, 12];
    worksheet['!cols'] = colWidths.map(width => ({ width }));

    // 将工作表添加到工作簿
    utils.book_append_sheet(workbook, worksheet, '绝区零成就');

    // 将工作簿写入文件
    writeFile(workbook, filename);

}

const formatDate = (date) => {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// const isMobile = window.matchMedia('(max-width: 768px)').matches
</script>

<template>
    <el-dropdown class="el-dropdown-main"  :trigger="isMobile ? 'click' : 'hover'">
        <div class="export-button">
            导出
            <el-icon class="el-icon--right export-arrow">
                <arrow-down />
            </el-icon>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="doExport('liyin')">liyin JSON</el-dropdown-item>
                <el-dropdown-item divided @click="doExport('excel')">Excel 文件</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<style>
.el-dropdown-main{
    width: 80px;
    padding: 10px;
    /* height: 100%; */
}
.export-button {
    height: 15px;
    line-height: 15px;
    display: flex;
    border: 1px solid var(--liyin-button-border-color);
    font-size: 15px;
    padding: 11px 10px 11px 15px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}
/* .export-arrow{
    color: var(--liyin-arrow-color)
} */
.export-button:hover {
    border: 1px solid var(--el-color-primary);
    color:  var(--el-color-primary);
}
@media (max-width: 768px){
    .export-button {
        font-size: 14px;
        padding: 8px 10px 8px 15px;
    }
}
</style>