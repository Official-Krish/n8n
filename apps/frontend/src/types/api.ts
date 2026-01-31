export interface IdResponse {
  message: string;
  workflowId?: string;
  userId?: string;
  token?: string;
}

export interface SigninResponse {
  message: string;
  userId: string;
  token: string;
  avatarUrl: string;
}

export interface Workflow {
  _id: string;
  workflowName: string;
  nodes: any[];
  edges: any[];
}

export type marketStatus = {
  isOpen: boolean;
  message: string;
  nextOpenTime?: string;
}