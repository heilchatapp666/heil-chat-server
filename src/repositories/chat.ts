import { and, eq } from "drizzle-orm";
import db from "@/db";
import tables from "@/db/tables";

interface CountAsParticipantProps {
	chatId: string;
	currentUserId: string;
}

const chatRepository = {
	countingAsParticipant: async (props: CountAsParticipantProps) => {
		const countingParticipant = await db.$count(
			tables.chatParticipant,
			and(
				eq(tables.chatParticipant.chatId, props.chatId),
				eq(tables.chatParticipant.participantId, props.currentUserId),
			),
		);
		return countingParticipant === 1;
	},
};

export default chatRepository;
