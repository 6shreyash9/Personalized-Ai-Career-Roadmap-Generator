// ============================================
// 🔑 API CONFIGURATION
// ============================================
const OPENROUTER_API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-r1-0528:free";

// ============================================
// 🤖 CHATBOT FUNCTIONS
// ============================================

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

let conversationHistory: Message[] = [];

function toggleChatbot(): void {
    const chatWindow = document.getElementById('chatbotWindow') as HTMLElement;
    chatWindow.classList.toggle('active');
}

function addMessage(message: string, sender: 'user' | 'bot'): void {
    const messagesContainer = document.getElementById('chatMessages') as HTMLElement;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage(): Promise<void> {
    const input = document.getElementById('chatInput') as HTMLInputElement;
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    addMessage(message, 'user');
    input.value = '';
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });
    
    // Show typing indicator
    addMessage('Thinking...', 'bot');
    
    try {
        // Call DeepSeek API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://careersync-ai.com",
                "X-Title": "CareerSync AI",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful career guidance AI assistant for CareerSync AI platform. Help students with career advice, tech skills, learning paths, and job guidance. Keep responses concise (2-4 sentences), friendly, and actionable."
                    },
                    ...conversationHistory
                ]
            })
        });

        const data = await response.json();
        
        // Remove "Thinking..." message
        const messagesContainer = document.getElementById('chatMessages') as HTMLElement;
        messagesContainer.removeChild(messagesContainer.lastChild!);
        
        // Get AI response
        const aiResponse = data.choices[0].message.content;
        
        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });
        
        // Display AI response
        addMessage(aiResponse, 'bot');
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Remove "Thinking..." message
        const messagesContainer = document.getElementById('chatMessages') as HTMLElement;
        messagesContainer.removeChild(messagesContainer.lastChild!);
        
        // Show error message
        addMessage('Sorry, I encountered an error. Please try again!', 'bot');
    }
}

// Handle Enter key press
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput') as HTMLInputElement;
    chatInput?.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// Make functions globally accessible
(window as any).toggleChatbot = toggleChatbot;
(window as any).sendMessage = sendMessage;
