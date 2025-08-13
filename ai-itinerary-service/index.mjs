import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client with your API key
// IMPORTANT: You will set this API key as an environment variable in your Lambda function.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export const handler = async (event) => {
  // Allow requests from any origin (for development)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  };

  try {
    const { destination, duration, focus } = JSON.parse(event.body);

    if (!destination || !duration || !focus) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters: destination, duration, focus.' }),
      };
    }

    const prompt = `Create a detailed, day-by-day travel itinerary for a trip to ${destination} lasting ${duration} days. The trip should have a strong focus on ${focus}. For each day, provide a title and a 2-3 sentence description of the activities. Format the entire output as a single JSON object with a key "itinerary", which is an array of objects. Each object in the array should have "day", "title", and "description" keys. Do not include any text or markdown formatting before or after the JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    
    // Clean the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return {
      statusCode: 200,
      headers,
      body: cleanedText,
    };
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate itinerary.' }),
    };
  }
};