/**
 * @author Edwaki
 * @date 3.7.2022
 */
import create from 'zustand';

const tokenKey = 'crypto_auth_token';       //authentication token key
const sessionToken = JSON.parse(sessionStorage.getItem(tokenKey) || '{}');  //authentication token
const useStore = create((set: any) => ({
    token: sessionToken,
    setToken: (token: any) => 
        set((state: any) => {
            sessionStorage.setItem(tokenKey, JSON.stringify(token));
            return {token};
        })
}));

export default useStore;