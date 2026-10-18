import cloudSyncService from "./index.js";

export const getAccountInfoService = async () => cloudSyncService.get('/account');
