import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: { name: any; emails: any; photos: any },
    done: VerifyCallback,
  ) {
    try {
      const { name, emails, photos } = profile;

      const user = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        accessToken,
      };

      done(null, user);
    } catch (err) {
      console.log(err);
      done(err, false);
    }
  }
}
