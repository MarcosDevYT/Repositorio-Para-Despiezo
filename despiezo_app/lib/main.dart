import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'services/api_service.dart';
import 'services/auth_service.dart';
import 'services/product_service.dart';
import 'services/chat_service.dart';
import 'providers/auth_provider.dart';
import 'providers/product_provider.dart';
import 'providers/chat_provider.dart';
import 'screens/main_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  final apiService = ApiService();
  final authService = AuthService(apiService);
  final productService = ProductService(apiService);
  final chatService = ChatService(apiService);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(authService)..initialize()),
        ChangeNotifierProvider(create: (_) => ProductProvider(productService)),
        ChangeNotifierProvider(create: (_) => ChatProvider(chatService)),
      ],
      child: const DespiezoApp(),
    ),
  );
}

class DespiezoApp extends StatelessWidget {
  const DespiezoApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Despiezo',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const _AppLoader(),
    );
  }
}

class _AppLoader extends StatelessWidget {
  const _AppLoader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    if (!authProvider.isInitialized) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Text(
                'Despiezo',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E293B),
                ),
              ),
              SizedBox(height: 24),
              CircularProgressIndicator(strokeWidth: 2),
            ],
          ),
        ),
      );
    }

    return const MainShell();
  }
}
