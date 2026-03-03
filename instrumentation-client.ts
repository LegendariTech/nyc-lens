import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    { path: '/api/acris/*', method: 'GET' },
    { path: '/api/acris/*', method: 'POST' },
  ],
});
