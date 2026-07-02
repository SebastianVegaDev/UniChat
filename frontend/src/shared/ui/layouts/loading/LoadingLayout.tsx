import "./LoadingLayout.css";

function LoadingLayout() {
    return (
        <div className="loading-layout">
            <svg
                className="loading-layout-pencil"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <clipPath id="loading-layout-eraser">
                        <rect rx="5" ry="5" width="30" height="30"></rect>
                    </clipPath>
                </defs>
                <circle
                    className="loading-layout-pencil-stroke"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="439.82 439.82"
                    strokeDashoffset="439.82"
                    strokeLinecap="round"
                    transform="rotate(-113,100,100)"
                ></circle>
                <g className="loading-layout-pencil-rotate" transform="translate(100,100)">
                    <g fill="none">
                        <circle
                            className="loading-layout-pencil-body-primary"
                            r="64"
                            stroke="hsl(30, 30%, 50%)"
                            strokeWidth="30"
                            strokeDasharray="402.12 402.12"
                            strokeDashoffset="402"
                            transform="rotate(-90)"
                        ></circle>
                        <circle
                            className="loading-layout-pencil-body-secondary"
                            r="74"
                            stroke="hsl(30, 30%, 60%)"
                            strokeWidth="10"
                            strokeDasharray="464.96 464.96"
                            strokeDashoffset="465"
                            transform="rotate(-90)"
                        ></circle>
                        <circle
                            className="loading-layout-pencil-body-shadow"
                            r="54"
                            stroke="hsl(30, 30%, 40%)"
                            strokeWidth="10"
                            strokeDasharray="339.29 339.29"
                            strokeDashoffset="339"
                            transform="rotate(-90)"
                        ></circle>
                    </g>
                    <g className="loading-layout-pencil-eraser" transform="rotate(-90) translate(49,0)">
                        <g className="loading-layout-pencil-eraser-skew">
                            <rect fill="hsl(30, 20%, 90%)" rx="5" ry="5" width="30" height="30"></rect>
                            <rect fill="hsl(30, 20%, 85%)" width="5" height="30" clipPath="url(#loading-layout-eraser)"></rect>
                            <rect fill="hsl(30, 20%, 80%)" width="30" height="20"></rect>
                            <rect fill="hsl(30, 20%, 75%)" width="15" height="20"></rect>
                            <rect fill="hsl(30, 20%, 85%)" width="5" height="20"></rect>
                            <rect fill="hsla(30, 20%, 75%, 0.2)" y="6" width="30" height="2"></rect>
                            <rect fill="hsla(30, 20%, 75%, 0.2)" y="13" width="30" height="2"></rect>
                        </g>
                    </g>
                    <g className="loading-layout-pencil-point" transform="rotate(-90) translate(49,-30)">
                        <polygon fill="hsl(33, 90%, 70%)" points="15 0,30 30,0 30"></polygon>
                        <polygon fill="hsl(33, 90%, 50%)" points="15 0,6 30,0 30"></polygon>
                        <polygon fill="hsl(223, 10%, 10%)" points="15 0,20 10,10 10"></polygon>
                    </g>
                </g>
            </svg>
        </div>
    );
}

export default LoadingLayout;
