import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../models/user_model.dart';
import 'api_service.dart';

class AuthService {
  final ApiService api;
  static const String _tokenKey = 'despiezo_auth_token';

  AuthService(this.api);

  Future<String?> getSavedToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    api.setToken(token);
  }

  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    api.setToken(null);
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final data = await api.post(ApiConfig.loginEndpoint, {
      'email': email,
      'password': password,
    });
    if (data['success'] == true && data['token'] != null) {
      await saveToken(data['token']);
    }
    return data;
  }

  Future<Map<String, dynamic>> register(String name, String email, String password) async {
    final data = await api.post(ApiConfig.registerEndpoint, {
      'name': name,
      'email': email,
      'password': password,
    });
    if (data['success'] == true && data['token'] != null) {
      await saveToken(data['token']);
    }
    return data;
  }

  Future<UserModel?> getMe() async {
    try {
      final data = await api.get(ApiConfig.meEndpoint);
      if (data['success'] == true && data['user'] != null) {
        return UserModel.fromJson(data['user']);
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  Future<void> logout() async {
    await clearToken();
  }
}
