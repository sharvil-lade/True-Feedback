import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { moderateMessage } from "@/lib/moderateMessage";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 }
      );
    }

    const moderation = await moderateMessage(content);

    if (moderation.label === "toxic") {
      return Response.json(
        {
          message:
            "Message blocked: content violates community guidelines",
          success: false,
          blocked: true,
        },
        { status: 400 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
      isFlagged: moderation.label === "borderline",
      moderationScore: moderation.score,
      moderationLabel: moderation.label,
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
