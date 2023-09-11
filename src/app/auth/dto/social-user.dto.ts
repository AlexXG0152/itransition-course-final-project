export class SocialAuthUserDto {
  readonly id: string;
  readonly displayName: string;
  readonly birthday?: string;
  readonly profileUrl?: string;
  readonly emails?: Array<{ value: string; verified: 'true' | 'false' }>;
  readonly _raw: string;
  readonly _json: {
    iss: string;
    azp?: string;
    aud: string;
    sub: string;
    at_hash?: string;
    iat: number;
    exp: number;
    email?: string;
    email_verified?: 'true' | 'false';
    given_name?: string;
    family_name?: string;
    name?: string;
    hd?: string;
    locale?: string;
    nonce?: string;
    picture?: string;
    profile?: string;
  };
  readonly provider: string;
}
