export enum ActionStatus {
  Success,
  Error,
}

export interface ActionResponse {
  status: ActionStatus;
  message: string;
}
