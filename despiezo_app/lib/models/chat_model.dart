class ChatRoom {
  final String id;
  final String? productId;
  final String vendorId;
  final String buyerId;
  final ChatUser? vendor;
  final ChatUser? buyer;
  final ChatProduct? product;
  final List<ChatMessage> messages;
  final DateTime createdAt;

  ChatRoom({
    required this.id,
    this.productId,
    required this.vendorId,
    required this.buyerId,
    this.vendor,
    this.buyer,
    this.product,
    this.messages = const [],
    required this.createdAt,
  });

  ChatMessage? get lastMessage => messages.isNotEmpty ? messages.last : null;

  String otherUserName(String currentUserId) {
    if (currentUserId == vendorId) {
      return buyer?.name ?? 'Comprador';
    }
    return vendor?.name ?? 'Vendedor';
  }

  String? otherUserImage(String currentUserId) {
    if (currentUserId == vendorId) return buyer?.image;
    return vendor?.image;
  }

  factory ChatRoom.fromJson(Map<String, dynamic> json) {
    return ChatRoom(
      id: json['id'] ?? '',
      productId: json['productId'],
      vendorId: json['vendorId'] ?? '',
      buyerId: json['buyerId'] ?? '',
      vendor: json['vendor'] != null ? ChatUser.fromJson(json['vendor']) : null,
      buyer: json['buyer'] != null ? ChatUser.fromJson(json['buyer']) : null,
      product: json['product'] != null ? ChatProduct.fromJson(json['product']) : null,
      messages: json['messages'] != null
          ? (json['messages'] as List).map((m) => ChatMessage.fromJson(m)).toList()
          : [],
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }
}

class ChatUser {
  final String id;
  final String? name;
  final String? email;
  final String? image;

  ChatUser({required this.id, this.name, this.email, this.image});

  factory ChatUser.fromJson(Map<String, dynamic> json) {
    return ChatUser(
      id: json['id'] ?? '',
      name: json['name'],
      email: json['email'],
      image: json['image'],
    );
  }
}

class ChatProduct {
  final String id;
  final String name;
  final List<String> images;
  final String? price;

  ChatProduct({required this.id, required this.name, this.images = const [], this.price});

  String? get firstImage => images.isNotEmpty ? images[0] : null;

  factory ChatProduct.fromJson(Map<String, dynamic> json) {
    return ChatProduct(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      images: json['images'] != null ? List<String>.from(json['images']) : [],
      price: json['price']?.toString(),
    );
  }
}

class ChatMessage {
  final String id;
  final String roomId;
  final String senderId;
  final String content;
  final ChatUser? sender;
  final DateTime createdAt;

  ChatMessage({
    required this.id,
    required this.roomId,
    required this.senderId,
    required this.content,
    this.sender,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] ?? '',
      roomId: json['roomId'] ?? '',
      senderId: json['senderId'] ?? '',
      content: json['content'] ?? '',
      sender: json['sender'] != null ? ChatUser.fromJson(json['sender']) : null,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }
}
