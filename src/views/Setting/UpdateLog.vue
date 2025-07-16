<script setup>
import { useIsMobileStore } from '@/stores/isMobile'
import { storeToRefs } from 'pinia'

const isMobileStore = useIsMobileStore()
const { isMobile } = storeToRefs(isMobileStore)

const updateLogInfo = [
    {
        version: '2.1.2', 
        date: '2025-07-17', 
        title: '成就攻略界面新增其他攻略跳转引导，新增隐藏完成成就系列功能',
        changes: '<ul><li>成就攻略界面新增其他攻略跳转引导：包括米游社及bilibili</li><li>新增隐藏完成成就系列功能<br>可在成就界面设置中进行设置<br>用于控制隐藏所有成就已完成的系列</li></ul>' 
    },
    { 
        version: '2.1.1', 
        date: '2025-07-17', 
        title: '补充2.1版本成就缺少描述',
        changes: '<ul style="padding-left: 10px;"><li>补充2.1版本成就缺少描述</li></ul>' 
    },
    { 
        version: '2.1.0', 
        date: '2025-07-16', 
        title: '新增2.1版本成就',
        changes: '<ul style="padding-left: 10px;"><li>新增2.1版本成就</li></ul>' 
    },
    { 
        version: '2.0.2', 
        date: '2025-06-09', 
        title: '修正部分成就描述',
        changes: '<ul style="padding-left: 10px;"><li>修正部分成就描述</li></ul>' 
    },
    { 
        version: '2.0.1', 
        date: '2025-06-07', 
        title: '修正部分成就描述',
        changes: '<ul style="padding-left: 10px;"><li>修正部分成就描述</li></ul>' 
    },
    { 
        version: '2.0.0', 
        date: '2025-06-06', 
        title: '新增2.0版本成就',
        changes: '<ul style="padding-left: 10px;"><li>新增2.0版本成就</li></ul>' 
    },
    { 
        version: '1.7.1', 
        date: '2025-04-26', 
        title: '新增1.7版本上半角色',
        changes: '<ul style="padding-left: 10px;"><li>新增1.7版本上半角色</li></ul>' 
    },
    { 
        version: '1.7.0', 
        date: '2025-04-23', 
        title: '新增1.7版本成就，新增1.6版本下半角色',
        changes: '<ul style="padding-left: 10px;"><li>新增1.7版本成就</li><li>新增1.6版本下半角色</li></ul>' 
    },
    { 
        version: '1.6.2', 
        date: '2025-03-19', 
        title: '修正“暂无迷失之虞”成就奖励类型错误问题',
        changes: '<ul style="padding-left: 10px;"><li>修正“暂无迷失之虞”成就奖励类型错误问题</li></ul>' 
    },
    { 
        version: '1.6.1', 
        date: '2025-03-16', 
        title: '新增1.6版本上半角色，修正“暂无迷失之虞”成就菲林数与游戏内数据不符的问题',
        changes: '<ul style="padding-left: 10px;"><li>新增1.6版本上半角色</li><li>修正“暂无迷失之虞”成就菲林数与游戏内数据不符的问题</li></ul>' 
    },
    { 
        version: '1.6.0', 
        date: '2025-03-12', 
        title: '新增1.6版本成就，新增1.5版本下半角色',
        changes: '<ul style="padding-left: 10px;"><li>新增1.6版本成就</li><li>新增1.5版本下半角色</li></ul>' 
    },
    { 
        version: '1.5.0', 
        date: '2025-01-21', 
        title: '新增1.5版本成就，新增1.5版本上半角色',
        changes: '<ul style="padding-left: 10px;"><li>新增1.5版本成就</li><li>新增1.5版本上半角色</li></ul>' 
    },
    { 
        version: '1.4.0', 
        date: '2024-12-19', 
        title: '新增1.4版本成就，新增1.4版本角色',
        changes: '<ul style="padding-left: 10px;"><li>新增1.4版本成就</li><li>新增1.4版本角色</li></ul>' 
    },
    { 
        version: '1.3.0', 
        date: '2024-11-05', 
        title: '新增1.3版本成就，新增1.3版本角色',
        changes: '<ul style="padding-left: 10px;"><li>新增1.3版本成就</li><li>新增1.3版本角色</li></ul>' 
    },
    { 
        version: '1.2.1', 
        date: '2024-10-20', 
        title: '将“完美闪避”成就设置为暂不可获得成就，新增1.2版本角色，新增成就界面设置特殊文本内容功能，新增自定义暂不可获得成就功能，将设置界面中与成就相关的选项移动至成就界面的设置窗口中，修复导入成就功能存在的部分问题',
        changes: '<ul style="padding-left: 10px;"><li>将“完美闪避”成就设置为暂不可获得成就</li><li>新增1.2版本角色</li><li>新增成就界面设置特殊文本内容功能，如自定义账号主角性别等</li><li>新增自定义暂不可获得成就功能，长按对应成就的选择按钮即可弹出设置自定义暂不可获得窗口</li><li>将设置界面中与成就相关的选项移动至成就界面的设置窗口中</li><li>修复导入成就功能存在的部分问题</li></ul>' 
    },
    { 
        version: '1.2.0', 
        date: '2024-09-26', 
        title: '新增1.2版本成就',
        changes: '<ul style="padding-left: 10px;"><li>新增1.2版本成就</li></ul>' 
    },
    { 
        version: '1.1.0', 
        date: '2024-08-14', 
        title: '新增1.1版本成就',
        changes: '<ul style="padding-left: 10px;"><li>新增1.1版本成就</li></ul>' 
    },
    { 
        version: '1.0.5', 
        date: '2024-07-17', 
        title: '修复编辑及添加账号时无法输入10位uid的问题, 优化手机端成就界面及角色界面的悬浮窗口位置为左边',
        changes: '<ul style="padding-left: 10px;"><li>修复编辑及添加账号时无法输入10位uid的问题</li><li>优化手机端成就界面及角色界面的悬浮窗口位置为左边</li></ul>' 
    },
    { 
        version: '1.0.4', 
        date: '2024-07-15', 
        title: '新增成就系列悬浮窗口金银铜三档已完成成就个数显示, 优化成就筛选功能',
        changes: '<ul style="padding-left: 10px;"><li>新增成就系列悬浮窗口金银铜三档已完成成就个数显示，便于与游戏内已完成成就数进行比对</li><li>优化成就筛选功能，新增更多的筛选类型，设置界面新增成就筛选配置缓存选项便于自行取舍是否保留筛选缓存</li></ul>' 
    },
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