import create from 'zustand';

const tokenKey = 'crypto_auth_token';
const sessionToken = JSON.parse(sessionStorage.getItem(tokenKey) || '{}');
const useStore = create((set: any) => ({
    token: sessionToken,
    setToken: (token: any) => 
        set((state: any) => {
            sessionStorage.setItem(tokenKey, JSON.stringify(token));
            return {token};
        })
}));

export default useStore;