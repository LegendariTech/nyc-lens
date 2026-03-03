import 'server-only';
import { checkBotId } from 'botid/server';

export async function verifyNotBot() {
  try {
    const result = await checkBotId();
    const { isBot, isVerifiedBot } = result;

    if (isBot && !isVerifiedBot) {
      return { blocked: true, result };
    }

    return { blocked: false, result };
  } catch {
    // BotID unavailable — fail open to preserve availability
    return { blocked: false, result: null };
  }
}
