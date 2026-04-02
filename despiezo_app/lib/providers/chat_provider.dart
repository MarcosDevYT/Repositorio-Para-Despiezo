import 'dart:async';
import 'package:flutter/material.dart';
import '../models/chat_model.dart';
import '../services/chat_service.dart';

class ChatProvider extends ChangeNotifier {
  final ChatService _chatService;

  List<ChatRoom> _rooms = [];
  ChatRoom? _currentRoom;
  bool _isLoadingRooms = false;
  bool _isLoadingRoom = false;
  bool _isSending = false;
  String? _error;
  Timer? _pollTimer;

  ChatProvider(this._chatService);

  List<ChatRoom> get rooms => _rooms;
  ChatRoom? get currentRoom => _currentRoom;
  bool get isLoadingRooms => _isLoadingRooms;
  bool get isLoadingRoom => _isLoadingRoom;
  bool get isSending => _isSending;
  String? get error => _error;

  Future<void> loadRooms() async {
    _isLoadingRooms = true;
    _error = null;
    notifyListeners();

    try {
      _rooms = await _chatService.getChatRooms();
    } catch (e) {
      _error = 'Error al cargar conversaciones';
    }

    _isLoadingRooms = false;
    notifyListeners();
  }

  Future<void> loadRoom(String roomId) async {
    _isLoadingRoom = true;
    _error = null;
    notifyListeners();

    try {
      _currentRoom = await _chatService.getChatRoom(roomId);
    } catch (e) {
      _error = 'Error al cargar el chat';
    }

    _isLoadingRoom = false;
    notifyListeners();
  }

  void startPolling(String roomId) {
    _pollTimer?.cancel();
    _pollTimer = Timer.periodic(const Duration(seconds: 5), (_) async {
      try {
        final room = await _chatService.getChatRoom(roomId);
        if (room != null && room.messages.length != _currentRoom?.messages.length) {
          _currentRoom = room;
          notifyListeners();
        }
      } catch (_) {}
    });
  }

  void stopPolling() {
    _pollTimer?.cancel();
    _pollTimer = null;
  }

  Future<bool> sendMessage(String roomId, String content) async {
    _isSending = true;
    notifyListeners();

    try {
      final message = await _chatService.sendMessage(roomId, content);
      if (message != null && _currentRoom != null) {
        _currentRoom!.messages.add(message);
        notifyListeners();
        _isSending = false;
        return true;
      }
    } catch (e) {
      _error = 'Error al enviar mensaje';
    }

    _isSending = false;
    notifyListeners();
    return false;
  }

  Future<String?> startChat(String productId) async {
    try {
      return await _chatService.startChat(productId);
    } catch (_) {
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> getMarcas() => _chatService.getMarcas();
  Future<List<Map<String, dynamic>>> getModelos() => _chatService.getModelos();

  Future<Map<String, dynamic>?> searchMatricula(String plate) =>
      _chatService.searchByMatricula(plate);

  @override
  void dispose() {
    stopPolling();
    super.dispose();
  }
}
