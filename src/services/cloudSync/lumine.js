import cloudSyncService from "./index.js";

export const verifyEmailService = async (email, code) => cloudSyncService.post('/lumine/verifyEmail', {
    email, code
});
