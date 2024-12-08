import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeSentiment(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment of the following text and return a JSON object with scores for positive, negative, and neutral sentiment, with values between 0 and 1 that sum to 1."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      ...result,
      overall: Object.entries(result).reduce((a, b) => result[a] > result[b[0]] ? a : b[0])
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw error;
  }
}