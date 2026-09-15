export interface IFBankInfo {
  bankName: string; accountNumber: string; accountHolder: string;
  branch: string; qrApiBase: string;
}

export const MOCK_BANK_INFO: IFBankInfo = {
  bankName: 'MB Bank',
  accountNumber: '8888999999999',
  accountHolder: 'CTCP NOITHAT LUXDECOR',
  branch: 'Chi nhánh Hoàn Kiếm, Hà Nội',
  qrApiBase: 'https://api.qrserver.com/v1/create-qr-code/',
};
