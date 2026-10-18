import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', () => {
    const account = ref({});

    const setAccount = (newAccount) => {
        account.value = newAccount;
    }

    const removeAccount = () => {
        account.value = {};
    }

    const isLogin = computed(() => {
        const accountInfo = account.value;
        return accountInfo?.identifier && accountInfo?.type;
    });

    return {
        account,
        setAccount,
        removeAccount,
        isLogin
    }
});
