import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/stores/cloudSync/account';
import { useSyncStatusStore } from '@/stores/cloudSync/syncStatus';
import { useUserInfoStore } from '@/stores/userInfo';
import { useAchievementStore } from '@/stores/achievement/achievement';
import { useUserAchievementStore } from '@/stores/achievement/userAchievement';
import { useAchievementCustomNotAchievedStore } from '@/stores/achievement/achievementCustomNotAchieved';
import { useTextjoinStore } from '@/stores/achievement/setting/textjoin.js'
import { getAllUserData } from '@/utils/getAllAchievementData';
import { getAllAchievementDataService } from '@/services/cloudSync/achievement';
import { uploadCurrentAccountToCloud, uploadAllAcountDataToCloud } from '@/utils/achievementCloudSync';
import { showSelectSyncDataDialog } from '@/views/CloudSync/selectSyncData/index.js'

const accountStore = useAccountStore();

const syncStatusStore = useSyncStatusStore();
const { resetStatus, setAllTokenIdsStatusFailed } = syncStatusStore

export const differenceOfLocalAndCloud = (localData, cloudData) => {
    const sections = ['user', 'achievements', 'customNotAchieved', 'textjoinSettings'];

    const allTokenIDs = new Set([
      ...Object.keys(localData || {}),
      ...Object.keys(cloudData || {})
    ].filter(key => key !== 'currentTokenID'));

    for (const tokenId of allTokenIDs) {
      const local = localData?.[tokenId];
      const cloud = cloudData?.[tokenId];

      if (!local && !cloud) continue;

      if ((local && !cloud) || (!local && cloud)) {
        return false;
      }

      for (const section of sections) {
        const localTime = local?.[section]?.lastUpdateTime;
        const cloudTime = cloud?.[section]?.lastUpdateTime;

        if (!localTime && !cloudTime) continue;

        if (localTime !== cloudTime) {
          return false;
        }
      }
    }

    if (localData?.currentTokenID || cloudData?.currentTokenID) {
      const localTime = localData?.currentTokenID?.lastUpdateTime;
      const cloudTime = cloudData?.currentTokenID?.lastUpdateTime;

      if (localTime !== cloudTime) {
        return false;
      }
    }

    return true;
};

const updateLocalAcountDataToCloud = async (localData) => {
    const localTokenIds = Object.keys(localData || {}).filter(key => key !== 'currentTokenID');

    return uploadAllAcountDataToCloud().then((res)=> {
      if (res.code === 0) {
        ElMessage({
          showClose: true,
          message: '数据成功同步至云端',
          type: 'success',
        });
        resetStatus();
      } else {
        ElMessage({
          showClose: true,
          message: '同步异常',
          type: 'error',
        });
        setAllTokenIdsStatusFailed(localTokenIds);
      }
    })
    .catch((error) => {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
      });
      setAllTokenIdsStatusFailed(localTokenIds);
    })
}

const updateCloudAcountDataToLocal = (cloudData) => {
    const userInfoStore = useUserInfoStore();
    const { userInfoList } = storeToRefs(userInfoStore);

    const userInfoData = {
      list: {},
      currentTokenID: cloudData.currentTokenID?.tokenID ?? Object.keys(userInfoList.value.list)[0],
      currentTokenIDLastUpdateTime: cloudData.currentTokenID?.lastUpdateTime ?? new Date().getTime()
    };

    const userAchievementData = {}
    const userCustomNotAchievedData = {}
    const userTextjoinData = {}

    Object.keys(cloudData).forEach(key => {
      if (key === "currentTokenID") return;

      const userEntry = cloudData[key];
      const tokenID = userEntry.user.data.tokenID;

      const users = userEntry.user

      userInfoData.list[key] = {
        tokenID: tokenID,
        uid: users.data.uid,
        name: users.data.name,
        avatar: users.data.avatar,
        lastUpdateTime: users.lastUpdateTime
      };

      const achs = userEntry.achievements
      userAchievementData[key] = {
        tokenID: tokenID,
        list: achs.data,
        lastUpdateTime: achs.lastUpdateTime
      }

      const cnas = userEntry.customNotAchieved
      userCustomNotAchievedData[key] = {
        tokenID: tokenID,
        list: cnas.data,
        lastUpdateTime: cnas.lastUpdateTime
      }

      const tjs = userEntry.textjoinSettings
      userTextjoinData[key] = {
        data: tjs.data,
        lastUpdateTime: tjs.lastUpdateTime
      }
    });

    const { resetUserInfo } = userInfoStore;
    resetUserInfo(userInfoData);
    if (cloudData.currentTokenID === null) {
      uploadCurrentAccountToCloud({
        tokenId: userInfoData.currentTokenID,
        updateTime: userInfoData.currentTokenIDLastUpdateTime
      })
    }

    const userAchievementStore = useUserAchievementStore();
    const { resetUserAchievement } = userAchievementStore;
    resetUserAchievement(userAchievementData);

    const achievementCustomNotAchievedStore = useAchievementCustomNotAchievedStore();
    const { resetUserCustomNotAchieved } = achievementCustomNotAchievedStore;
    resetUserCustomNotAchieved(userCustomNotAchievedData);

    const textjoinStore = useTextjoinStore();
    const { resetUserTextjoin } = textjoinStore;
    resetUserTextjoin(userTextjoinData);

    const achievementStore = useAchievementStore();
    const { resetAchievementsInfo } = achievementStore;
    resetAchievementsInfo();
}

export const handleDataSync = async () => {
    if (!accountStore.isLogin) {
      return;
    }

    const localData = getAllUserData();

    const cloudDTO = await getAllAchievementDataService();
    const cloudData = cloudDTO.data;

    if (!cloudData) {
      updateLocalAcountDataToCloud(localData);
      return;
    }

    if (!differenceOfLocalAndCloud(localData, cloudData)) {
      showSelectSyncDataDialog({
        localData,
        cloudData
      }).then(selected => {
        if (selected === 'local') {
          updateLocalAcountDataToCloud(localData);
        } else {
          updateCloudAcountDataToLocal(cloudData);
        }
      })
      return;
    }
}
