import { HttpHeaders, HttpParams } from '@angular/common/http';

export const appConfig = {
  // apiUrl: 'http://globstage.atero.solutions/api/v1',
  // apiOauth: 'http://globstage.atero.solutions/api/v1/users/token',
  // serverUrl: 'http://globstage.atero.solutions/api',

  apiUrl: 'https://globstage.com/api/v1',
  apiOauth: 'https://globstage.com/api/v1/users/token',
  serverUrl: 'https://globstage.com/api',
};

export const allowedImageType = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'jpg',
  'JPG',
  'JPEG',
  'jpeg',
  'png'
];
export const allowedDocType = [
  'doc',
  'docx',
  'pdf',
  'application/pdf',
  'txt',
  'text/plain',
  'xls',
  'rtf',
  'vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-office',
  'application/msword'
];

export const emailRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const phoneRegexp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export interface RequestParams {
  headers?: HttpHeaders;
  observe: string;
  params?: HttpParams;
  reportProgress?: boolean;
  responseType: string;
  withCredentials?: boolean;
}

export interface DateInfo {
  date: string;
  timezone_type: number;
  timezone: string;
}


export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
