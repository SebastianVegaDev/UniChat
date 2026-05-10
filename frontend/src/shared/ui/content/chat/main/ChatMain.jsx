import "./ChatMain.css";
import { Paperclip, Send } from "lucide-react";

function ChatMain({pinnedMessage, timeline, activeChannel}) {
    return (
        <div className="chat-content-main">
            <div className="chat-content-main-header">
                <h4>{activeChannel.name}</h4>
                <h3>{activeChannel.type}</h3>
            </div>

            <div className="chat-content-main-messages">
                { pinnedMessage ? 
                    <div className="chat-content-main-message-fixed">
                        <h4>Message fixed</h4>
                        <p>{pinnedMessage.body}</p>
                        <span>{pinnedMessage.author} · {pinnedMessage.timeLabel}</span>
                    </div> 
                    : null  
                }
                { timeline.map((message) => {
                    switch(message.type){
                        case "date":
                        return (
                            <div className="chat-content-main-message-date" key={message.id}>
                                <p>{message.label}</p>
                            </div>
                        );
                        case "message-other":
                        return (
                            <div className="chat-content-main-message-other" key={message.id}>
                                <span>{message.initial}</span>
                                <div  className="chat-content-main-message">
                                    <div>
                                        <h4>{message.author}</h4>
                                        <span>{message.timeLabel}</span>
                                    </div>
                                    <p>{message.body}</p>
                                </div>
                            </div>
                        );
                        case "message-me":
                        return (
                            <div className="chat-content-main-message-me" key={message.id}>
                                <div className="chat-content-main-message">
                                    <div>
                                        <h4>{message.author}</h4>
                                        <span>{message.timeLabel}</span>
                                    </div>
                                    <p>{message.body}</p>
                                </div>
                                <span>{message.initial}</span>
                            </div>
                        );
                        default:
                        return null;
                    }
                })}
            </div>
            <form className="chat-content-main-tabbar">
                <button className="chat-content-main-tabbar-clip"><Paperclip /></button>
                <input className="chat-content-main-tabbar-input" placeholder="Write your message..."></input>
                <button className="chat-content-main-tabbar-send"><Send /></button>
            </form>
        </div>
    );
}

export default ChatMain;
