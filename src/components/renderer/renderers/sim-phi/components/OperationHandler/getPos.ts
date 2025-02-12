import { simphiPlayer } from "../../playerMain";

export function getPos(obj: MouseEvent | Touch) {
    const rect = simphiPlayer.app.canvas.getBoundingClientRect();
    return {
        x:
            ((obj.clientX - rect.left) / simphiPlayer.app.canvas.offsetWidth) *
                simphiPlayer.app.canvas.width -
            (simphiPlayer.app.canvas.width - simphiPlayer.app.canvasos.width) / 2,
        y:
            ((obj.clientY - rect.top) / simphiPlayer.app.canvas.offsetHeight) *
                simphiPlayer.app.canvas.height -
            (simphiPlayer.app.canvas.height - simphiPlayer.app.canvasos.height) / 2,
    };
}
