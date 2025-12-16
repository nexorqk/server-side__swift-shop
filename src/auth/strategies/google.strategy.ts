import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL:
        configService.getOrThrow('SERVER_URL') + '/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  validate(
    _assetToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { displayName, emails, photos } = profile;

    const user = {
      email: emails?.values[0],
      name: displayName,
      picture: photos?.values[0],
    };

    done(null, user);
  }
}
