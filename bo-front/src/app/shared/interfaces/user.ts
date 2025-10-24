export interface UserLogin {
  username: string;
  password: string;
}

export interface UserAuth {
  token: string;
  token_type: string;
  token_expire: Date;
  jti: string;
}
