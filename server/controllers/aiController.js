const { generateAIResponse, generateAIResponseWithHistory } = require('../services/aiService');
const Task = require('../models/Task');
const Note = require('../models/Note');

// @desc    Breakdown a task into subtasks
// @route   POST /api/ai/breakdown
// @access  Private
const breakdownTask = async (req, res) => {
    const { title, description, dueDate, tags } = req.body;

    const prompt = `
    You are a helpful developer assistant. Break the following task into ordered actionable steps, estimate time in hours for each step (low/medium/high), and suggest priority.

    Task title: "${title}"
    Description: "${description || 'No description provided'}"
    Due date: "${dueDate || 'No due date'}"
    Tags: "${tags ? tags.join(', ') : 'None'}"

    Return JSON with: steps: [{step, estimateHours, difficulty}], overallEstimateHours, suggestedPriority
    `;

    try {
        console.log("=== AI Breakdown Request ===");
        console.log("Title:", title);
        console.log("Description:", description);
        
        const responseCallback = await generateAIResponse(prompt, "You are a project manager assistant.", true);
        console.log("AI Response Raw:", responseCallback);
        
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseCallback);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Response was:", responseCallback);
            // If parsing fails, return a default breakdown structure
            parsedResponse = {
                steps: [
                    { step: "Plan and analyze requirements", estimateHours: "2", difficulty: "medium" },
                    { step: "Design the solution", estimateHours: "3", difficulty: "medium" },
                    { step: "Implement the solution", estimateHours: "5", difficulty: "high" },
                    { step: "Test and verify", estimateHours: "2", difficulty: "medium" }
                ],
                overallEstimateHours: 12,
                suggestedPriority: "high"
            };
        }
        
        // Validate response structure
        if (!parsedResponse.steps || !Array.isArray(parsedResponse.steps)) {
            console.warn("Invalid response structure, using default");
            parsedResponse = {
                steps: [
                    { step: "Plan and analyze requirements", estimateHours: "2", difficulty: "medium" },
                    { step: "Design the solution", estimateHours: "3", difficulty: "medium" },
                    { step: "Implement the solution", estimateHours: "5", difficulty: "high" },
                    { step: "Test and verify", estimateHours: "2", difficulty: "medium" }
                ],
                overallEstimateHours: 12,
                suggestedPriority: "high"
            };
        }
        
        res.json(parsedResponse);
    } catch (error) {
        console.error("=== AI Breakdown Error ===");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        
        // Return a default breakdown structure on error
        res.json({
            steps: [
                { step: "Plan and analyze requirements", estimateHours: "2", difficulty: "medium" },
                { step: "Design the solution", estimateHours: "3", difficulty: "medium" },
                { step: "Implement the solution", estimateHours: "5", difficulty: "high" },
                { step: "Test and verify", estimateHours: "2", difficulty: "medium" }
            ],
            overallEstimateHours: 12,
            suggestedPriority: "high"
        });
    }
};

// @desc    Chat with AI contextually
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
    const { messages, contextRefs } = req.body; // contextRefs: { taskIds: [], noteIds: [] }

    // Prepare context
    let contextData = "";

    // Fetch referenced data if any (simplified for this MVP: fetch last 5 tasks/notes if not specified or just chat)
    // For now, let's just make it a general chat that CAN see tasks if we fetch them.
    // Real RAG implementation is complex, we will do a "Lite" version: providing specific context strings.

    // Simplification: We will just answer questions based on the conversation history provided by frontend.
    // If contextRefs are passed, we append them.

    const relevantTasks = await Task.find({ user: req.user.id }).limit(5);
    const relevantNotes = await Note.find({ user: req.user.id }).limit(5);

    contextData += "User's recent tasks:\n" + relevantTasks.map(t => `- ${t.title} (${t.status})`).join('\n') + "\n\n";
    contextData += "User's recent notes:\n" + relevantNotes.map(n => `- ${n.title}`).join('\n') + "\n\n";

    const systemMsg = `You are a helpful AI assistant for a productivity app. You help users manage their tasks, notes, and projects. You have access to the user's recent tasks and notes:\n${contextData}\n\nYou can:
- Help organize and prioritize tasks
- Answer questions about their tasks and notes
- Provide suggestions and insights
- Break down complex tasks into steps
- Help with time management

Be friendly, concise, and helpful. If you don't have enough information, ask clarifying questions.`;

    // Build conversation history for context
    const conversationMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
    }));

    try {
        // Use full conversation history for better context
        console.log('=== AI Chat Request ===');
        console.log('Messages count:', conversationMessages.length);
        console.log('Last message:', conversationMessages[conversationMessages.length - 1]?.content?.substring(0, 50));
        
        if (!conversationMessages || conversationMessages.length === 0) {
            throw new Error('No messages provided');
        }
        
        const response = await generateAIResponseWithHistory(conversationMessages, systemMsg);
        
        if (!response) {
            throw new Error('Empty response from AI service');
        }
        
        console.log('AI Chat Response - Length:', response?.length);
        console.log('=== AI Chat Success ===');
        
        res.json({ role: 'assistant', content: response });
    } catch (error) {
        console.error('=== AI Chat Error ===');
        console.error('Error Type:', error.constructor.name);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        
        // Send user-friendly error message
        const errorMessage = error.message || 'Failed to get AI response. Please try again.';
        res.status(500).json({ 
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = { breakdownTask, chatWithAI };
