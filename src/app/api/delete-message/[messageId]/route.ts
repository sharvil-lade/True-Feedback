import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

// DELETE /api/delete-message/:messageId
export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { messageId } = params;
  if (!messageId || !mongoose.isValidObjectId(messageId)) {
    return Response.json(
      { success: false, message: "Valid message ID is required" },
      { status: 400 }
    );
  }

  try {
    const messageObjectId = new mongoose.Types.ObjectId(messageId);

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: session.user._id, "messages._id": messageObjectId },
      { $pull: { messages: { _id: messageObjectId } } },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    );
  }
}
