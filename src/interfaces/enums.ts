export enum AuthFailure {
    LOGIN_FAIL = 1,
    PASSWORD_NOT_CORRECT = "PASSWORD_NOT_CORRECT"
}
export enum ClientFailure {
    CLIENT_NOT_EXIST = "CLIENT_NOT_EXIST",
    SAME_RECEIVER_AND_CURRENT = "SAME_RECEIVER_AND_CURRENT",
    PASSWORD_NOT_CORRECT = "PASSWORD_NOT_CORRECT"
}
// Transactions enums
export enum TransactionErr {
    UN_SUFFICENT_FUND = "UN_SUFFICENT_FUND"
}