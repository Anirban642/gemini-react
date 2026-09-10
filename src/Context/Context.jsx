import { createContext, useState } from "react";
import PropTypes from "prop-types";
import run from "../Config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput]=useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        const submittedPrompt = (prompt ?? input).trim();
        if (!submittedPrompt) return;

        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if (prompt !== undefined) {
            response = await run(submittedPrompt);
            setRecentPrompt(submittedPrompt);
        } else {
            setPrevPrompts(prev=>[...prev,submittedPrompt]);
            setRecentPrompt(submittedPrompt);
            response = await run(submittedPrompt);
        }

        setResultData(response);
        setLoading(false);
        setInput("");
    }


    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
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