import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';


export const bullboardConfig = BullBoardModule.forRoot({
  route: '/queues',
  adapter: ExpressAdapter,  
  boardOptions:
  {
    uiConfig: {
      boardTitle : '',
      boardLogo : {
        path:'https://staging.uatychat.com.br/assets/logo-1dcdf6b7.svg',
        width: '124px',
        height: '60px',
      }
    },
  }
});
