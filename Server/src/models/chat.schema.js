import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderType: {
      type: String,
      enum: ['customer', 'vendor'],
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const chatRoomSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    messages: [messageSchema],
    isActive: {
      type: Boolean,
      default: true
    },
    lastMessage: {
      type: String,
      default: null
    },
    lastMessageTime: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for quick lookups
chatRoomSchema.index({ customer: 1, vendor: 1, order: 1 }, { unique: true });

const ChatRoom = mongoose.models.ChatRoom || mongoose.model('ChatRoom', chatRoomSchema);

export default ChatRoom;
