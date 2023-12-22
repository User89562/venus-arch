
export class LoginUtil {
    static storageUrl: string = 'u';
    static storageKey: string = 'k';

    public static addToStorage(apiUrl: string, apiKey: string) {
        localStorage.setItem(LoginUtil.storageUrl, apiUrl);
        localStorage.setItem(LoginUtil.storageKey, apiKey);
    }
    
    public static retrieveUrl() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(LoginUtil.storageUrl) || ''
          } 
          return '';
    }

    public static retrieveKey() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(LoginUtil.storageKey) || ''
          } 
          return '';
    }

    public static clearStorage() {
        localStorage.removeItem(LoginUtil.storageUrl);
        localStorage.removeItem(LoginUtil.storageKey);
    }
}
