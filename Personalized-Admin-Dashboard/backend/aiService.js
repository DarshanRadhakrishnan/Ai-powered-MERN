const { Anthropic } = require("@anthropic-ai/sdk");
const ai_model = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

exports.getClaudeResponse = async (reducedOrders) => {
    const prompt = `
You are an intelligent retail analytics assistant. You will be given a JSON array of past order records from an e-commerce platform. Each order contains the following fields:

- name (product name)
- price (numeric value)
- region (sales region)
- category (product category)
- added_to_cart (boolean: true if added to cart, false if purchased)
- date_of_purchase (ISO date string)

Based on this data, perform a comprehensive analysis and return a JSON object with the following insights:

1. "areas_to_improve": [Highlight weaknesses or performance issues (e.g., low sales in a category, high abandonment rates, or underperforming regions).]
2. "too_long_in_cart": [List product names that frequently appear with added_to_cart: true but are rarely purchased.]
3. "best_sellers": [List product names that have the highest number of successful purchases.]
4. "products_to_discount": [List products that are often abandoned in carts or show low conversion rates, and might benefit from discounts.]
5. "highest_revenue_generating_category": [The name of the product category that has generated the most total revenue.]

Please follow these important guidelines:
- Only use the data provided.
- Return your answer strictly in valid JSON format.
- Avoid unnecessary explanations or commentary.
- If a list is empty, return an empty array.

Here is the data:
${JSON.stringify(reducedOrders, null, 2)}

Respond with the final JSON only.
`;
 {JSON.stringify(reducedOrders, null, 2)}
  try {
    const response = await ai_model.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const text = response.content[0]?.text || '';
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const result = JSON.parse(text.slice(jsonStart, jsonEnd));
    return result;
  } catch (err) {
    console.error("Claude Error:", err.message);
    return { error: "Error getting response from Claude." };
  }
};
