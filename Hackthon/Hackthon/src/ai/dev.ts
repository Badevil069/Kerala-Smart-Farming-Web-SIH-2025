import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-activity-logs.ts';
import '@/ai/flows/generate-crop-recommendations.ts';
import '@/ai/flows/enhance-activity-logging.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/generate-weather-alerts.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/chat.ts';
