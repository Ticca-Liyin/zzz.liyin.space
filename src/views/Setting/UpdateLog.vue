<script setup>
import { useIsMobileStore } from '@/stores/isMobile'
import { storeToRefs } from 'pinia'

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const updateLogInfo = [
    { 
        version: '1.0.3', 
        date: '2024-07-11', 
        title: '本页成就悬浮窗口新增金银铜三档已完成成就个数显示',
        changes: '<ul style="padding-left: 10px;"><li>本页成就悬浮窗口新增金银铜三档已完成成就个数显示，便于与游戏内已完成成就数进行比对</li></ul>' 
    },
    { 
        version: '1.0.2', 
        date: '2024-07-08', 
        title: '新增成就界面第一分类选择功能',
        changes: '<ul style="padding-left: 10px;"><li>新增成就界面第一分类选择功能，可以通过该功能显示对应分类的相关第二分类及其相关成就</li></ul>' 
    },
    { 
        version: '1.0.1', 
        date: '2024-07-05', 
        title: '更正隐藏成就显示不正确问题，新增角色界面米游社wiki跳转',
        changes: '<ul style="padding-left: 10px;"><li>更正隐藏成就显示不正确问题</li><li>新增角色界面米游社wiki跳转</li></ul>' 
    },
    { 
        version: '1.0.0', 
        date: '2024-07-04', 
        title: '绝区零成就系统发布',
        changes: '<ul style="padding-left: 10px;"><li>绝区零成就系统发布</li></ul>' 
    },
]

</script>

<template>
    <el-popover
        :placement="isMobile ? 'bottom' : 'bottom-start'"
        :width="isMobile ? '80%' : '50%'"
        trigger="hover"
    >
        <template #reference>
            <div class="update-log">
                <el-alert :title="`${ updateLogInfo[0].date}： ${ updateLogInfo[0].title}`" type="warning" show-icon :closable="false"/>
            </div>
        </template>
        <el-table :data="updateLogInfo" :max-height="300" border table-layout="auto" >
            <el-table-column type="expand">
                <template #default="props">
                    <div class="update-log-changes" v-html="props.row.changes"></div>
                </template>
            </el-table-column>
            <el-table-column property="version" sortable label="版本" />
            <el-table-column property="date" sortable label="日期" />
        </el-table>
    </el-popover>
</template>

<style>
.update-log {
    margin: 10px 10px 0 10px;
}
.update-log-changes {
    margin: 5px 15px;
}

.update-log-changes li {
    margin: 5px 0;
}
</style>