const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

const generateAIResponse = async (prompt, systemMessage = "You are a helpful assistant.", jsonMode = false) => {
    console.log("=== generateAIResponse Called ===");
    console.log("JSON Mode:", jsonMode);
    console.log("Prompt sample:", prompt.substring(0, 50));

    // Clean the API key
    const apiKey = process.env.OPENAI_API_KEY;
    const cleanApiKey = apiKey ? apiKey.trim().replace(/\r?\n/g, '') : '';
    
    const hasValidKey = cleanApiKey && 
                       cleanApiKey !== 'your_openai_api_key_here' && 
                       cleanApiKey !== 'mock-key' && 
                       typeof cleanApiKey === 'string' &&
                       cleanApiKey.length > 10 &&
                       (cleanApiKey.startsWith('sk-') || cleanApiKey.startsWith('sk-proj-'));

    console.log("Has valid key:", hasValidKey);

    // If no valid key, return mock response
    if (!hasValidKey) {
        console.log("Using Mock AI Response (no valid API key)");
        if (jsonMode) {
            console.log("JSON Mode requested. Returning Mock JSON.");
            // Return breakdown JSON if it looks like a breakdown request
            if (prompt.toLowerCase().includes("break") || prompt.toLowerCase().includes("step") || prompt.toLowerCase().includes("task")) {
                return JSON.stringify({
                    steps: [
                        { step: "Analyze requirements and plan approach", estimateHours: "2", difficulty: "medium" },
                        { step: "Design the solution architecture", estimateHours: "3", difficulty: "medium" },
                        { step: "Implement core functionality", estimateHours: "5", difficulty: "high" },
                        { step: "Test and verify the implementation", estimateHours: "2", difficulty: "medium" },
                        { step: "Review and refine", estimateHours: "1", difficulty: "low" }
                    ],
                    overallEstimateHours: 13,
                    suggestedPriority: "high"
                });
            }
            // Default JSON for other things
            return JSON.stringify({ response: "Mock JSON response" });
        }
        return "This is a mock AI response because no valid API key was found.";
    }

    // Try to call OpenAI API
    try {
        console.log("Calling OpenAI API for breakdown");
        const openaiClient = new OpenAI({
            apiKey: cleanApiKey,
        });
        
        const completion = await openaiClient.chat.completions.create({
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: prompt }
            ],
            model: "gpt-3.5-turbo",
            response_format: jsonMode ? { type: "json_object" } : { type: "text" },
        });

        const response = completion.choices[0].message.content;
        console.log("OpenAI response received, length:", response?.length);
        return response;
    } catch (error) {
        console.error("=== OpenAI API Error ===");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);
        console.error("Error Details:", error.response?.data || error.response);
        
        // If JSON mode and API fails, return mock JSON instead of throwing
        if (jsonMode) {
            console.log("API failed but JSON mode requested - returning mock JSON");
            if (prompt.toLowerCase().includes("break") || prompt.toLowerCase().includes("step") || prompt.toLowerCase().includes("task")) {
                return JSON.stringify({
                    steps: [
                        { step: "Analyze requirements and plan approach", estimateHours: "2", difficulty: "medium" },
                        { step: "Design the solution architecture", estimateHours: "3", difficulty: "medium" },
                        { step: "Implement core functionality", estimateHours: "5", difficulty: "high" },
                        { step: "Test and verify the implementation", estimateHours: "2", difficulty: "medium" },
                        { step: "Review and refine", estimateHours: "1", difficulty: "low" }
                    ],
                    overallEstimateHours: 13,
                    suggestedPriority: "high"
                });
            }
            return JSON.stringify({ response: "Mock JSON response due to API error" });
        }
        
        // For non-JSON mode, throw error
        throw new Error("Failed to get AI response");
    }
};

const generateAIResponseWithHistory = async (messages, systemMessage = "You are a helpful assistant.") => {
    try {
        // Enhanced Mock for demo/fallback purposes if key is invalid
        const apiKey = process.env.OPENAI_API_KEY;
        
        // Debug logging
        console.log("=== API Key Check ===");
        console.log("API Key exists:", !!apiKey);
        console.log("API Key length:", apiKey?.length || 0);
        console.log("API Key starts with:", apiKey?.substring(0, 10) || 'N/A');
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error('Invalid messages array provided');
        }
        
        // Clean the API key - remove any whitespace/newlines
        const cleanApiKey = apiKey ? apiKey.trim().replace(/\r?\n/g, '') : '';
        
        const hasValidKey = cleanApiKey && 
                           cleanApiKey !== 'your_openai_api_key_here' && 
                           cleanApiKey !== 'mock-key' && 
                           typeof cleanApiKey === 'string' &&
                           cleanApiKey.length > 10 &&
                           (cleanApiKey.startsWith('sk-') || cleanApiKey.startsWith('sk-proj-'));
        
        console.log("Has valid key:", hasValidKey);
        console.log("Clean API Key length:", cleanApiKey?.length || 0);
        console.log("Clean API Key starts with:", cleanApiKey?.substring(0, 15) || 'N/A');
        
        // Try Hugging Face first (free alternative) if API key is available
        const hfApiKey = process.env.HUGGINGFACE_API_KEY?.trim();
        if (hfApiKey && hfApiKey.startsWith('hf_')) {
            console.log("=== Trying Hugging Face API (Free) ===");
            try {
                const hfClient = new OpenAI({
                    apiKey: hfApiKey,
                    baseURL: 'https://router.huggingface.co/v1',
                });
                
                const allMessages = [
                    { role: "system", content: systemMessage },
                    ...messages
                ];

                console.log("Sending request to Hugging Face with", allMessages.length, "messages");
                
                const completion = await hfClient.chat.completions.create({
                    messages: allMessages,
                    model: "deepseek-ai/DeepSeek-V3-0324:fastest", // Free model
                });

                console.log("✅ Hugging Face response received successfully");
                const responseContent = completion.choices[0]?.message?.content;
                if (!responseContent) {
                    throw new Error("Empty response from Hugging Face");
                }
                return responseContent;
            } catch (hfError) {
                console.error("❌ Hugging Face API Error:", hfError.message);
                console.log("Falling back to OpenAI or mock responses...");
                // Fall through to OpenAI or mock responses
            }
        }
        
        // If we have a valid OpenAI key, call OpenAI API
        if (hasValidKey) {
            console.log("=== Calling OpenAI API ===");
            console.log("Using clean API key, length:", cleanApiKey?.length || 0);
            
            // Create new OpenAI client with clean key
            const openaiClient = new OpenAI({
                apiKey: cleanApiKey,
            });
            
            const allMessages = [
                { role: "system", content: systemMessage },
                ...messages
            ];

            console.log("Sending request to OpenAI with", allMessages.length, "messages");
            
            try {
                const completion = await openaiClient.chat.completions.create({
                    messages: allMessages,
                    model: "gpt-3.5-turbo",
                });

                console.log("OpenAI response received successfully");
                const responseContent = completion.choices[0]?.message?.content;
                if (!responseContent) {
                    throw new Error("Empty response from OpenAI");
                }
                return responseContent;
            } catch (apiError) {
                console.error("=== OpenAI API Call Failed ===");
                console.error("Error Type:", apiError.constructor.name);
                console.error("Error Message:", apiError.message);
                console.error("Status:", apiError.response?.status);
                console.error("Error Details:", apiError.response?.data || apiError.response);
                
                // Check for specific errors
                if (apiError.message?.includes('quota') || apiError.message?.includes('429') || apiError.constructor.name === 'RateLimitError') {
                    console.log("⚠️ Quota exceeded or rate limit hit - using enhanced mock responses");
                } else {
                    console.log("Falling back to enhanced mock responses due to API error");
                }
                
                // If API call fails, fall back to enhanced mock responses
                const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
                
                if (lastUserMessage.includes('task') || lastUserMessage.includes('todo')) {
                    return "I can help you with tasks! You can:\n\n- Create and organize tasks\n- Set due dates and priorities\n- Break down complex tasks into steps\n- Track your progress\n\nWhat would you like to know about task management?";
                }
                
                if (lastUserMessage.includes('note') || lastUserMessage.includes('knowledge')) {
                    return "Notes are great for capturing ideas and information! Here are some tips:\n\n- Use clear titles for easy searching\n- Add tags to organize by topic\n- Review notes regularly to stay organized\n\nWould you like help organizing your notes?";
                }
                
                if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi') || lastUserMessage.includes('hey')) {
                    return "Hello! 👋 I'm your AI assistant. I'm here to help you manage your tasks, notes, and stay productive!\n\nHow can I assist you today?";
                }
                
                // Default helpful response
                return "I understand! I can help you with:\n\n📋 **Task Management**: Organize tasks, set priorities, and break down complex work\n📝 **Notes**: Organize your knowledge and find information\n📅 **Calendar**: View tasks by due date\n💡 **Productivity**: Tips on time management and staying organized\n\nWhat would you like help with?";
            }
        }
        
        // If no valid API keys, use enhanced mock responses
        if (!hasValidKey && (!hfApiKey || !hfApiKey.startsWith('hf_'))) {
            console.log("=== Using Enhanced Mock AI Response with History ===");
            console.log("API Key Status:", apiKey ? "Present but invalid" : "Not found");
            console.log("Messages count:", messages.length);
            
            // Get the last user message
            const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
            const allMessages = messages.map(m => m.content).join(' ').toLowerCase();
            console.log("Last user message:", lastUserMessage.substring(0, 100));
            
            // Context-aware mock responses
            if (lastUserMessage.includes('task') || lastUserMessage.includes('todo')) {
                if (lastUserMessage.includes('create') || lastUserMessage.includes('add') || lastUserMessage.includes('new')) {
                    return "Great! To create a task, go to the Tasks page and click 'New Task'. Make sure to:\n\n1. Give it a clear, actionable title\n2. Set a due date to track deadlines\n3. Assign a priority (high/medium/low)\n4. Add relevant tags for organization\n\nWould you like help breaking down a complex task into smaller steps?";
                }
                if (lastUserMessage.includes('prioritize') || lastUserMessage.includes('important')) {
                    return "Here's how to prioritize your tasks:\n\n**High Priority**: Urgent and important - do these first\n**Medium Priority**: Important but not urgent - schedule these\n**Low Priority**: Nice to have - do when you have time\n\nFocus on completing high-priority tasks first, then move to medium. This helps you stay productive and meet deadlines!";
                }
                return "I can help you with tasks! You can:\n\n- Create and organize tasks\n- Set due dates and priorities\n- Break down complex tasks into steps\n- Track your progress\n\nWhat would you like to know about task management?";
            }
            
            if (lastUserMessage.includes('note') || lastUserMessage.includes('knowledge')) {
                return "Notes are great for capturing ideas and information! Here are some tips:\n\n- Use clear titles for easy searching\n- Add tags to organize by topic\n- Review notes regularly to stay organized\n- Link related notes together\n\nWould you like help organizing your notes or finding specific information?";
            }
            
            if (lastUserMessage.includes('calendar') || lastUserMessage.includes('schedule') || lastUserMessage.includes('date')) {
                return "The calendar view helps you see all your tasks organized by due date! Here's how to use it:\n\n- Click on any date to see tasks for that day\n- Tasks with due dates automatically appear on the calendar\n- Overdue tasks are marked with a red alert\n- You can add tasks directly from the calendar view\n\nMake sure to set due dates on your tasks so they appear in the calendar!";
            }
            
            if (lastUserMessage.includes('help') || lastUserMessage.includes('how')) {
                return "I'm your AI assistant! I can help you with:\n\n✅ **Task Management**: Create, organize, and prioritize tasks\n📝 **Notes**: Capture and organize your knowledge\n📅 **Calendar**: View tasks by due date\n🎯 **Productivity Tips**: Get suggestions for better time management\n\nJust ask me anything about your tasks, notes, or productivity! What would you like help with?";
            }
            
            if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi') || lastUserMessage.includes('hey')) {
                return "Hello! 👋 I'm your AI assistant. I'm here to help you manage your tasks, notes, and stay productive!\n\nYou can ask me:\n- Questions about your tasks and notes\n- Help organizing your work\n- Productivity tips and suggestions\n- How to use different features\n\nHow can I assist you today?";
            }
            
            // Default helpful response - always return something useful
            return "I understand! Here are some ways I can help:\n\n📋 **Task Management**: I can help you organize tasks, set priorities, and break down complex work into manageable steps.\n\n📝 **Notes**: I can help you organize your knowledge and find information quickly.\n\n💡 **Productivity**: I can provide tips on time management, prioritization, and staying organized.\n\n📅 **Calendar**: I can help you understand how to use the calendar view to see your tasks by due date.\n\nWhat specific help do you need? Feel free to ask me about:\n- Creating and managing tasks\n- Organizing notes\n- Using the calendar\n- Productivity tips\n\nHow can I assist you today?";
        }
        
        // If we reach here, no API keys were valid and no mock response matched
        // Return a default helpful response
        const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
        return "I'm here to help! I can assist you with tasks, notes, calendar, and productivity tips. What would you like help with?";
    } catch (error) {
        console.error("=== generateAIResponseWithHistory Error ===");
        console.error("Error Type:", error.constructor.name);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        console.error("Error Response:", error.response?.data || error.response);
        console.error("Error Status:", error.response?.status);
        
        // As a last resort, return a helpful mock response instead of throwing
        console.log("Returning fallback mock response due to error");
        const lastUserMessage = messages && messages.length > 0 
            ? messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || ''
            : '';
        
        if (lastUserMessage.includes('task') || lastUserMessage.includes('todo')) {
            return "I can help you with tasks! You can create, organize, and manage your tasks. What would you like to know?";
        }
        
        if (lastUserMessage.includes('note') || lastUserMessage.includes('knowledge')) {
            return "I can help you with notes! You can organize your knowledge and find information quickly. How can I help?";
        }
        
        // Always return something helpful, never throw
        return "I'm here to help! I can assist you with tasks, notes, calendar, and productivity tips. What would you like help with?";
    }
};

module.exports = { generateAIResponse, generateAIResponseWithHistory };
