import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('YANDEX_CLIENT_ID'),
      clientSecret: configService.getOrThrow('YANDEX_CLIENT_SECRET'),
      callbackURL: configService.get('SERVER_URL') + '/auth/yandex/callback',
    });
  }

  async validate(
    _assetToken: string,
    _refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const { username, emails, photos } = profile;

    const user = {
      email: emails?.values,
      name: username,
      picture: photos?.values,
    };

    done(null, user);
  }
}
