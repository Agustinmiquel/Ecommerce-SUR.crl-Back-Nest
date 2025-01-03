import { Provider } from '@nestjs/common';
import { Twilio } from 'twilio';

export const TwilioProvider: Provider = {
  provide: 'TwilioSDK',
  useFactory: () => {
    return new Twilio(
      process.env.ACCOUNT_SID_TWILIO,
      process.env.AUTH_TOKEN_TWILIO,
    );
  },
};
