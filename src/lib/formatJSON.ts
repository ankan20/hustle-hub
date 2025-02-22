export function formatAnalysisResponse(responseData: any) {
    try {
      // Extract the actual JSON string from the code block
      const jsonMatch = responseData.match(/```JSON\n([\s\S]*?)\n```/i);
      if (!jsonMatch || !jsonMatch[1]) {
        throw new Error("Invalid response format");
      }
  
      // Parse the extracted JSON string
      const formattedData = JSON.parse(jsonMatch[1]);
      console.log(formattedData)
      return {
        matchSummary: formattedData.match_summary || "No match summary provided.",
        keyStrengths: formattedData.key_strengths || [],
        gaps: formattedData.gaps || [],
        recommendations: formattedData.recommendations || [],
        personalizedFeedback: formattedData.personalized_feedback || "No feedback provided."
      };
    } catch (error) {
      console.error("Error parsing analysis response:", error);
      return null;
    }
  }
  