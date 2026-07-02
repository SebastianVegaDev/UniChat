import "./AiResourceList.css";

function AiResourceList({ resources }) {
    if (!resources?.length) return null;

    return (
        <div className="ai-resource-list">
            <small>Recursos relacionados:</small>

            {resources.map((resource) => (
                <small key={resource.id} className="ai-resource-tag">
                    {resource.title}
                </small>
            ))}
        </div>
    );
}

export default AiResourceList;