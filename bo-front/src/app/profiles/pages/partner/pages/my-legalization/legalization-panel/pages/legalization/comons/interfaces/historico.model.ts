export interface UserInfo {
  profileType: string;
  id: number;
  name: string;
  lastName: string;
}

export interface HistoryItem {
  fileList: { id: number; s3Url: string; fileName: string; fileType: string; uploadedAt: string; }[];
  profileType: any;
  id?: number;
  createdAt: string;
  userName?: string;
  comment?: string;
  status?: string;
}

export interface Historico {
  id: number;
  customerId?: number;
  suscriptionId: number;
  documentId: number;
  profileType: string;
  requestMessage: string;
  status: number;
  createAt: string;
  statusDescription: string;
  fileList?: {
    id: number;
    s3Url: string;
    fileName: string;
    fileType: string;
    uploadedAt: string;
  }[];
  historyList: HistoryItem[];
}

export interface TimelineItem {
  fileList: any[];
  profileType: any;
  id?: number;  
  createdAt: string;
  userName: string;
  comment: string;
  status: string;
}


