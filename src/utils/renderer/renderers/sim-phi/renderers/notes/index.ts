import { simphiPlayer } from "@/utils/renderer/renderers/sim-phi/playerMain";

import { drawTap } from "./Tap";
import { drawHold } from "./Hold";
import { drawDrag } from "./Drag";
import { drawFlick } from "./Flick";

export function drawNotes() {
    for (const i of simphiPlayer.app.holds) drawHold(i, simphiPlayer.timeInfo.timeChart);
    for (const i of simphiPlayer.app.dragsReversed) drawDrag(i);
    for (const i of simphiPlayer.app.tapsReversed) drawTap(i);
    for (const i of simphiPlayer.app.flicksReversed) drawFlick(i);
}