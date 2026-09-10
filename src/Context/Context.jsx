import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import run from "../Config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput]=useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState(() => {
        try {
            const savedHistory = JSON.parse(localStorage.getItem("nexa-history"));
            return Array.isArray(savedHistory) ? savedHistory : [];
        } catch {
            return [];
        }
    });
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [messages, setMessages] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [theme, setTheme] = useState(() => localStorage.getItem("nexa-theme") || "light");

    useEffect(() => {
        localStorage.setItem("nexa-history", JSON.stringify(prevPrompts));
    }, [prevPrompts]);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("nexa-theme", theme);
    }, [theme]);

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setRecentPrompt("");
        setResultData("");
        setMessages([]);
        setActiveConversationId(null);
    }

    const onSent = async (prompt) => {
        const submittedPrompt = (prompt ?? input).trim();
        if (!submittedPrompt) return;

        setResultData("");
        setLoading(true);
        setShowResult(true);
        const conversationId = activeConversationId || crypto.randomUUID();
        const nextMessages = [
            ...messages,
            { role: "user", content: submittedPrompt },
        ];

        setActiveConversationId(conversationId);
        setMessages(nextMessages);
        setRecentPrompt(submittedPrompt);
        const response = await run(nextMessages, (chunk) => {
            setResultData((currentResult) => currentResult + chunk);
        });

        setResultData(response);
        const completedMessages = [
            ...nextMessages,
            { role: "assistant", content: response },
        ];
        setMessages(completedMessages);
        setPrevPrompts((prev) => {
            const existingConversation = prev.find((item) => item.id === conversationId);
            const conversation = {
                id: conversationId,
                prompt: existingConversation?.prompt || submittedPrompt,
                title: existingConversation?.title || submittedPrompt.split(/\s+/).slice(0, 6).join(" "),
                pinned: existingConversation?.pinned || false,
                response,
                messages: completedMessages,
                createdAt: existingConversation?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            return existingConversation
                ? prev.map((item) => item.id === conversationId ? conversation : item)
                : [conversation, ...prev];
        });
        setLoading(false);
        setInput("");
    }

    const regenerateResponse = async () => {
        const lastAssistantIndex = [...messages].reverse().findIndex((item) => item.role === "assistant");
        if (lastAssistantIndex === -1 || loading) return;

        const assistantIndex = messages.length - 1 - lastAssistantIndex;
        const requestMessages = messages.slice(0, assistantIndex);
        const lastUserMessage = requestMessages[requestMessages.length - 1];
        if (!lastUserMessage) return;

        setLoading(true);
        setResultData("");
        const response = await run(requestMessages, (chunk) => {
            setResultData((currentResult) => currentResult + chunk);
        });
        const completedMessages = [
            ...requestMessages,
            { role: "assistant", content: response },
        ];
        setMessages(completedMessages);
        setPrevPrompts((prev) => prev.map((conversation) => conversation.id === activeConversationId
            ? { ...conversation, response, messages: completedMessages, updatedAt: new Date().toISOString() }
            : conversation));
        setLoading(false);
    };

    const editLatestPrompt = () => {
        if (loading) return;
        const lastUserIndex = [...messages].reverse().findIndex((item) => item.role === "user");
        if (lastUserIndex === -1) return;

        const userIndex = messages.length - 1 - lastUserIndex;
        setInput(messages[userIndex].content);
        setMessages(messages.slice(0, userIndex));
        setResultData("");
        setShowResult(false);
    };

    const loadConversation = (conversation) => {
        const conversationMessages = conversation.messages || [
            { role: "user", content: conversation.prompt },
            { role: "assistant", content: conversation.response },
        ];
        const lastUserMessage = [...conversationMessages].reverse().find((item) => item.role === "user");
        const lastAssistantMessage = [...conversationMessages].reverse().find((item) => item.role === "assistant");
        setActiveConversationId(conversation.id);
        setMessages(conversationMessages);
        setRecentPrompt(lastUserMessage?.content || conversation.prompt);
        setResultData(lastAssistantMessage?.content || conversation.response);
        setShowResult(true);
        setLoading(false);
        setInput("");
    };

    const deleteConversation = (conversationId) => {
        const conversation = prevPrompts.find((item) => item.id === conversationId);
        setPrevPrompts((prev) => prev.filter((item) => item.id !== conversationId));
        if (conversation?.prompt === recentPrompt) newChat();
    };

    const clearHistory = () => {
        setPrevPrompts([]);
        newChat();
    };

    const togglePin = (conversationId) => {
        setPrevPrompts((prev) => prev.map((conversation) => conversation.id === conversationId
            ? { ...conversation, pinned: !conversation.pinned }
            : conversation));
    };

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light");
    };


    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        messages,
        regenerateResponse,
        editLatestPrompt,
        loadConversation,
        deleteConversation,
        clearHistory,
        togglePin,
        theme,
        toggleTheme,
        input,
        setInput,
        newChat
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ContextProvider;