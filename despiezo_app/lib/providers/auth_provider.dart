import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;

  UserModel? _user;
  bool _isLoading = false;
  bool _isInitialized = false;
  String? _error;

  AuthProvider(this._authService);

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isLoggedIn => _user != null;
  bool get isInitialized => _isInitialized;
  String? get error => _error;

  Future<void> initialize() async {
    if (_isInitialized) return;
    _isLoading = true;
    notifyListeners();

    try {
      final token = await _authService.getSavedToken();
      if (token != null) {
        _authService.api.setToken(token);
        _user = await _authService.getMe();
        if (_user == null) {
          await _authService.clearToken();
        }
      }
    } catch (_) {
      await _authService.clearToken();
    }

    _isLoading = false;
    _isInitialized = true;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _authService.login(email, password);
      if (data['success'] == true && data['user'] != null) {
        _user = UserModel.fromJson(data['user']);
        _isLoading = false;
        notifyListeners();
        return true;
      }
      _error = data['error']?.toString() ?? 'Error al iniciar sesión';
    } on ApiException catch (e) {
      _error = e.message;
    } catch (e) {
      _error = 'Error de conexión';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _authService.register(name, email, password);
      if (data['success'] == true && data['user'] != null) {
        _user = UserModel.fromJson(data['user']);
        _isLoading = false;
        notifyListeners();
        return true;
      }
      _error = data['error']?.toString() ?? 'Error al registrarse';
    } on ApiException catch (e) {
      _error = e.message;
    } catch (e) {
      _error = 'Error de conexión';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
