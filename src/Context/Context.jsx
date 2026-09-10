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

    useEffect(() => {
        localStorage.setItem("nexa-history", JSON.stringify(prevPrompts));
    }, [prevPrompts]);

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setRecentPrompt("");
        setResultData("");
    }

    const onSent = async (prompt) => {
        const submittedPrompt = (prompt ?? input).trim();
        if (!submittedPrompt) return;

        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        setRecentPrompt(submittedPrompt);
        response = await run(submittedPrompt, (chunk) => {
            setResultData((currentResult) => currentResult + chunk);
        });

        setResultData(response);
        setPrevPrompts((prev) => [
            {
                id: crypto.randomUUID(),
                prompt: submittedPrompt,
                response,
                createdAt: new Date().toISOString(),
            },
            ...prev.filter((item) => item.prompt !== submittedPrompt),
        ]);
        setLoading(false);
        setInput("");
    }

    const loadConversation = (conversation) => {
        setRecentPrompt(conversation.prompt);
        setResultData(conversation.response);
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


    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        loadConversation,
        deleteConversation,
        clearHistory,
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