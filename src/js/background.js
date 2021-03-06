export default class Background {
    constructor() {
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");

        const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const steps = window.matchMedia('(max-width: 768px)').matches ? 15 : 30;
        const drawingTime = 35;
        const pauseTime = 9000;

        const draw = (min, max, startY, color) => {
            let way = window.innerWidth / steps;
            let currentX = 0;
            let currentY = window.innerHeight - startY;
            let currentStep = 0;

            const drawingFunctions = {
                drawLine() {
                    ctx.beginPath();
                    ctx.moveTo(currentX, currentY);
                    currentX += way;
                    currentY = window.innerHeight - random(window.innerHeight * min, window.innerHeight * max)
                    ctx.lineTo(currentX, currentY);
                    ++currentStep == steps ? resetAnimation() : undefined;
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = color;
                    ctx.lineCap = "round";
                    ctx.stroke();
                },
                clearCanvas() {
                    way = window.innerWidth / steps;
                    currentX = 0;
                    currentY = window.innerHeight - startY;
                    currentStep = 0;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                },
                resetAnimation() {
                    clearInterval(drawChart)
                    pauseAnimation = setInterval(() => {
                        clearCanvas();
                        clearInterval(pauseAnimation);
                        drawChart = setInterval(drawLine, drawingTime);
                    }, pauseTime);
                }
            }

            const {
                drawLine,
                clearCanvas,
                resetAnimation
            } = drawingFunctions;

            let drawChart = setInterval(drawLine, drawingTime);
            let pauseAnimation;

            window.addEventListener('resize', () => {
                clearInterval(drawChart);
                clearInterval(pauseAnimation);
                clearCanvas();
                drawChart = setInterval(drawLine, drawingTime);
            })
        }

        const setSize = () => {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        }

        const render = () => {
            setSize();
            draw(.02, .15, 100, '#43a047');
            draw(0, .05, 40, '#ff2400');
        }

        render();
        window.addEventListener('resize', setSize);
    }
}