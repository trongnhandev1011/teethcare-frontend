import { CallAPI } from "./axiosBase";
import { ACCOUNT_END_POINT } from "../end-points/AccountEndPoint";

export const getAllAccounts = (options) =>
  CallAPI(`${ACCOUNT_END_POINT}`, "GET", {}, options);

export const getAccountById = (accountId) =>
  CallAPI(`${ACCOUNT_END_POINT}/${accountId}`, "GET");

export const setAccountStatus = (status, accountId) =>
  CallAPI(`${ACCOUNT_END_POINT}/${accountId}`, "PUT", status);
