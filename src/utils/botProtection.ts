import { checkBotId } from 'botid/server';

export async function verifyNotBot() {
  const result = await checkBotId();
  const { isBot, isVerifiedBot } = result;

  if (isBot && !isVerifiedBot) {
    return { blocked: true, result };
  }

  return { blocked: false, result };
}
