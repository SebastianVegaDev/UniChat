import "./ChatMain.css";
import { Paperclip, Send } from "lucide-react";

function ChatMain() {
    return (
        <div className="chat-content-main">
            <div className="chat-content-main-header">
                <h4>DIseno Ux</h4>
                <h3>Chat grupal</h3>
            </div>
            <div className="chat-content-main-messages">
                <div className="chat-content-main-message-fixed">
                    <h4>Message fixed</h4>
                    <p>El parcial sera presencial. Revisen el calendario antes del viernes.</p>
                    <span>Prof. Raul Vega · 09:48</span>
                </div>
                <div className="chat-content-main-message-date">
                    <p>Hoy</p>
                </div>
                <div className="chat-content-main-message-resource">
                    <span>Prof. Raul Vega subio un recurso en Semana 4.</span>
                </div>
                <div className="chat-content-main-message-other">
                    <span>D</span>
                    <div  className="chat-content-main-message">
                        <div>
                            <h4>Delegada</h4>
                            <span>10:12</span>
                        </div>
                        <p>Recuerden revisar los recursos antes de clase</p>
                    </div>
                </div>
                <div className="chat-content-main-message-me">
                    <div className="chat-content-main-message">
                        <div>
                            <h4>Delegada</h4>
                            <span>10:12</span>
                        </div>
                        <p>Recuerden revisar los recursos antes de clase</p>
                    </div>
                    <span>D</span>
                </div>
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
