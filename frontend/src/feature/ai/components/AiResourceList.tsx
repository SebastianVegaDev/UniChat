import "./AiResourceList.css";

function AiResourceList({ resources }) {
    if (!resources?.length) return null;

    return (
        <div className="ai-resource-list">
            <small>Recursos relacionados:</small>

            {resources.map((resource, index) => (
                <small key={resource.id ?? resource.url ?? `${resource.title}-${index}`} className="ai-resource-tag">
                    {resource.title}
                </small>
            ))}
        </div>
    );
}

export default AiResourceList;
