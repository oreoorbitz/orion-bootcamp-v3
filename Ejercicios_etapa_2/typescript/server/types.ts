export interface ThemeUpdateData {
    carpetaGuardado: string;
    tipoExtension: string;
    nombre: string;
}

export enum Templates {
    ARTICLE = "article",
    BLOG = "blog",
    CART = "cart",
    COLLECTION = "collection",
    LIST_COLLECTIONS = "list-collections",
    CUSTOMERS_ACCOUNT = "customers/account",
    CUSTOMERS_ACTIVATE_ACCOUNT = "customers/activate_account",
    CUSTOMERS_ADDRESSES = "customers/addresses",
    CUSTOMERS_LOGIN = "customers/login",
    CUSTOMERS_ORDER = "customers/order",
    CUSTOMERS_REGISTER = "customers/register",
    CUSTOMERS_RESET_PASSWORD = "customers/reset_password",
    GIFTCARD = "gift_card",
    INDEX = "index",
    PAGE = "page",
    PASSWORD = "password",
    PRODUCT = "product",
    SEARCH = "search",
}
