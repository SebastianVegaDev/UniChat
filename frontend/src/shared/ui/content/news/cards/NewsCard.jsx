import "./NewsCard.css"

function NewsCard() {
    return (
        <>
            <article className="news-card">
                <div className="news-card-header">
                    <h3>Academico</h3>
                    <h3>29 Abr</h3>
                </div>
                <div className="news-card-body">
                    <h2>Semana de parciales inicia el lunes</h2>
                    <p>Las evaluaciones se publicaran por curso durante esta semana. Revisa cada calendario antes de confirmar trabajos pendientes.</p>
                </div>
                <div className="news-card-footer">
                    <h4>Direccion Academica</h4>
                    <h4>3 min</h4>
                </div>
            </article>
        </>
    );
}

export default NewsCard;