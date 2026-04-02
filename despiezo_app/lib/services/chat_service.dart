import '../config/api_config.dart';
import '../models/chat_model.dart';
import 'api_service.dart';

class ChatService {
  final ApiService _api;

  ChatService(this._api);

  Future<List<ChatRoom>> getChatRooms() async {
    final data = await _api.get(ApiConfig.chatRoomsEndpoint);
    return (data['chats'] as List?)
            ?.map((c) => ChatRoom.fromJson(c))
            .toList() ??
        [];
  }

  Future<ChatRoom?> getChatRoom(String roomId) async {
    final data = await _api.get(ApiConfig.chatRoomDetailEndpoint(roomId));
    if (data['success'] == true && data['room'] != null) {
      return ChatRoom.fromJson(data['room']);
    }
    return null;
  }

  Future<String?> startChat(String productId) async {
    final data = await _api.post(ApiConfig.chatRoomsEndpoint, {'productId': productId});
    if (data['success'] == true) {
      return data['roomId'] as String?;
    }
    return null;
  }

  Future<ChatMessage?> sendMessage(String roomId, String content) async {
    final data = await _api.post(ApiConfig.chatMessagesEndpoint, {
      'roomId': roomId,
      'content': content,
    });
    if (data['success'] == true && data['message'] != null) {
      return ChatMessage.fromJson(data['message']);
    }
    return null;
  }

  Future<Map<String, dynamic>?> searchByMatricula(String plate) async {
    try {
      final data = await _api.get(ApiConfig.matriculaEndpoint(plate));
      if (data['success'] == true) {
        return data['data'] as Map<String, dynamic>?;
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> getMarcas() async {
    try {
      final data = await _api.get(ApiConfig.marcasEndpoint);
      if (data['success'] == true && data['data'] != null) {
        return (data['data'] as List).map((m) => Map<String, dynamic>.from(m)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> getModelos() async {
    try {
      final data = await _api.get(ApiConfig.modelosEndpoint);
      if (data['success'] == true && data['data'] != null) {
        return (data['data'] as List).map((m) => Map<String, dynamic>.from(m)).toList();
      }
      return [];
    } catch (_) {
      return [];
    }
  }
}
