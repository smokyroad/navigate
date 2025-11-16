import { GoogleGenAI, Type } from '@google/genai';
import Constants from 'expo-constants';
import { Checkpoint } from '../types';
import { getTranslatedCheckpoint } from './translationUtils';

// Get API key from environment or constants
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || 
  process.env.GEMINI_API_KEY
// Initialize the Gemini AI client
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// JSON response schema from Gemini
interface GeminiJsonResponse {
  response: string;
  checkpointIds: string[];
}

export interface GeminiResponse {
  text: string;
  suggestedCheckpoints?: Checkpoint[];
}

/**
 * Generate AI response for user query about airport navigation
 */
export async function generateAIResponse(
  userMessage: string,
  availableCheckpoints: Checkpoint[],
  selectedCheckpoints: string[],
  language: 'en' | 'zh'
): Promise<GeminiResponse> {
  const model = 'gemini-flash-latest';
  
  // Filter out already selected checkpoints and translate them
  const unselectedCheckpoints = availableCheckpoints
    .filter((cp) => !selectedCheckpoints.includes(cp.id))
    .map((cp) => getTranslatedCheckpoint(cp, language));

  // Create checkpoint list with IDs for AI to reference
  const checkpointList = unselectedCheckpoints
    .map((cp) => `ID: ${cp.id}\n名称: ${cp.name}\n类型: ${cp.type}\n位置: ${cp.location}\n描述: ${cp.description}`)
    .join('\n\n');

  const systemPrompt = language === 'zh' 
    ? `你是香港国际机场的AI助手。帮助旅客找到机场设施，包括餐厅、商店、休息室、洗手间和登机口。

可用设施:
${checkpointList}

根据用户查询推荐1-3个相关设施。回复要友善、简洁，用简体中文。
如果用户询问"plan my day"或类似的话，建议多个选项以获得完整的机场体验。

返回JSON格式，包含:
- response: 你的友好回复（简体中文）
- checkpointIds: 推荐的设施ID数组（从上面的列表中选择）`
    : `You are a helpful AI assistant for Hong Kong International Airport. Help travelers find airport facilities including restaurants, shops, lounges, restrooms, and gates.

Available facilities:
${checkpointList}

Based on the user's query, recommend 1-3 relevant facilities. Be friendly and concise.
If the user asks to "plan my day" or similar, suggest multiple options for a complete airport experience.

Return JSON with:
- response: Your friendly reply
- checkpointIds: Array of recommended facility IDs from the list above`;

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `${systemPrompt}\n\n用户查询: ${userMessage}`,
        },
      ],
    },
  ];

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      required: ["response", "checkpointIds"],
      properties: {
        response: {
          type: Type.STRING,
        },
        checkpointIds: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    if (!response.text) {
      throw new Error('No response text received from AI');
    }

    // Parse JSON response
    const jsonResponse: GeminiJsonResponse = JSON.parse(response.text);

    // Map checkpoint IDs to actual checkpoint objects
    const suggestedCheckpoints = jsonResponse.checkpointIds
      .map((id) => unselectedCheckpoints.find((cp) => cp.id === id))
      .filter((cp): cp is Checkpoint => cp !== undefined);

    return {
      text: jsonResponse.response,
      suggestedCheckpoints,
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}


