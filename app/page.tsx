import { Kiosk } from "@/app/kiosk";
import { factionBoard, rankBoard } from "@/lib/db";

/**
 * The kiosk. Reads the boards on the server straight out of the local SQLite file and hands
 * them to the client loop.
 *
 * Never cached: the boards are the resting state and have to show the Response written
 * thirty seconds ago, or a student walks back to a board that has not noticed them.
 */
export const dynamic = "force-dynamic";

export default async function Page() {
  return <Kiosk boards={{ faction: factionBoard(), rank: rankBoard() }} />;
}
