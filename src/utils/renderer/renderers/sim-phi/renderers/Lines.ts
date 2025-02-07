import { simphiPlayer } from "@/utils/renderer/renderers/sim-phi/playerMain";
import shared from "@utils/js/shared";
import { tween } from "../utils/tween";
import { imgShader } from "../assetsProcessor/imgProcessor";

interface Line {
    imageD: number;
    alpha: number;
    attachUI?: string;
    offsetX: number;
    offsetY: number;
    cosr: number;
    sinr: number;
    imageU: boolean;
    imageS: number;
    imageW: number;
    imageH: number;
    imageA: number;
    scaleX?: number;
    scaleY?: number;
    text?: string;
    color?: string;
    imageL: HTMLImageElement[];
    imageC: boolean;
    isCustomImage?: boolean;
    imagesColored: { [key: string]: HTMLImageElement };
}

//判定线函数，undefined/0:默认,1:非,2:恒成立
export function drawLine(bool: number, lineScale: number): void {
    simphiPlayer.app.ctxos.globalAlpha = 1;
    const tw = 1 - tween.easeOutSine(simphiPlayer.animationTimer.out.second * 1.5);
    for (const i of simphiPlayer.app.linesReversed) {
        if (bool ^ Number(i.imageD) && simphiPlayer.animationTimer.out.second < 0.67) {
            if (i.alpha < 0) continue;
            if (i.attachUI) {
                simphiPlayer.tmps.statStatus[i.attachUI] = {
                    show: true,
                    offsetX: i.offsetX - simphiPlayer.app.wlen,
                    offsetY: i.offsetY - simphiPlayer.app.hlen,
                    alpha: i.alpha,
                };

                continue;
            }
            simphiPlayer.app.ctxos.globalAlpha = i.alpha;
            simphiPlayer.app.ctxos.setTransform(
                i.cosr * tw,
                i.sinr,
                -i.sinr * tw,
                i.cosr,
                simphiPlayer.app.wlen + (i.offsetX - simphiPlayer.app.wlen) * tw,
                i.offsetY
            ); //hiahiah
            const imgS = ((i.imageU ? lineScale * 18.75 : simphiPlayer.app.canvasos.height) * i.imageS) / 1080;
            const imgW =
                imgS *
                i.imageW *
                i.imageA *
                (i.scaleX * (-0.0081 + 0.5214 * (simphiPlayer.app.canvasos.width / simphiPlayer.app.canvasos.height)) || 1); //1.5 0.774 1.78 0.92
            const imgH = imgS * i.imageH * (i.scaleY * 1 || 1);
            // ctxos.save();
            if (!i.text) {
                // const lineImage = i.imageL[i.imageC && shared.game.ptmain.gameConfig.lineColor ? stat.lineStatus : 0];
                // if (i.scaleX) ctxos.scale(-1, 1);
                try {
                    if (i.color && i.color != "#fff" && i.color != "#ffffff") {
                        if (!i.isCustomImage) {
                            simphiPlayer.app.ctxos.fillStyle = i.color || "#fff";
                            simphiPlayer.app.ctxos.fillRect(-imgW / 2, -imgH / 2, imgW, imgH);
                            simphiPlayer.app.ctxos.fillStyle = "#fff";
                        } else {
                            simphiPlayer.app.ctxos.drawImage(
                                getColoredLineImage(i, i.color),
                                -imgW / 2,
                                -imgH / 2,
                                imgW,
                                imgH
                            );
                        }
                    } else {
                        simphiPlayer.app.ctxos.drawImage(
                            i.imageL[
                                i.imageC && shared.game.ptmain.gameConfig.lineColor
                                    ? simphiPlayer.stat.lineStatus
                                    : 0
                            ],
                            -imgW / 2,
                            -imgH / 2,
                            imgW,
                            imgH
                        );
                    }
                } catch (err) {
                    simphiPlayer.app.ctxos.drawImage(
                        i.imageL[
                            i.imageC && shared.game.ptmain.gameConfig.lineColor
                                ? simphiPlayer.stat.lineStatus
                                : 0
                        ],
                        -imgW / 2,
                        -imgH / 2,
                        imgW,
                        imgH
                    );
                }
            } else {
                simphiPlayer.app.ctxos.fillStyle = i.color || "#fff";
                simphiPlayer.app.ctxos.textAlign = "center";
                simphiPlayer.app.ctxos.textBaseline = "middle";
                simphiPlayer.app.ctxos.font = `${lineScale * (i.scaleY || 1)}px Saira`;
                simphiPlayer.app.ctxos.fillText(i.text, 0, 0);
            }
            // ctxos.restore();
        }
    }
}
function getColoredLineImage(line: Line, hex: string | undefined): HTMLImageElement | Promise<ImageBitmap | HTMLCanvasElement> {
    if (!hex)
        return line.imageL[
            line.imageC && shared.game.ptmain.gameConfig.lineColor ? simphiPlayer.stat.lineStatus : 0
        ];
    hex = hex.toLowerCase();
    return (
        line.imagesColored[hex] || (line.imagesColored[hex] = imgShader(line.imageL[0], hex, true))
    );
}