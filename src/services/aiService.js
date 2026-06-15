export const AIService = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",

  async generateContent(prompt, systemInstruction = "") {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          }),
        }
      );
      if (!response.ok) throw new Error('API call failed');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Leo is offline right now. Please reach out via the Contact page!";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Leo can't connect right now. Drop a message on the Contact page instead! 🦁";
    }
  },

  async polishMessage(message) {
    return this.generateContent(
      `Rewrite the following message to be professional, warm, and clear — suitable for contacting a senior game developer about a project or job opportunity: "${message}". Keep it under 150 words.`,
      "You are a professional communications assistant."
    );
  },

  async generateGameIdea(userPrompt) {
    return this.generateContent(
      `Create a unique, high-concept game idea based on these keywords/vibe: "${userPrompt}". Format the response exactly as:
TITLE: [Game Title]
GENRE: [Genre / Platform]
PITCH: [One compelling sentence pitch]
MECHANIC: [The core gameplay mechanic in one or two sentences]
TWIST: [One surprising or innovative element that makes it stand out]`,
      "You are a visionary game design AI assistant helping a senior game developer brainstorm new concepts. Be creative, concise, and inspiring."
    );
  },
};
