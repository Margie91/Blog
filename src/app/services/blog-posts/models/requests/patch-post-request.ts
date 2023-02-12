export class PatchPostRequest {
  public op: string;
  public path: PatchPostRequestPath;
  public value: string;
}

export enum PatchPostRequestPath {
  title = '/title',
  text = '/text',
  categoryId = '/categoryId',
}
