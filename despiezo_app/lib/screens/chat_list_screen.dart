import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../providers/chat_provider.dart';
import 'chat_conversation_screen.dart';
import 'login_screen.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({Key? key}) : super(key: key);

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final isAuth = context.read<AuthProvider>().isLoggedIn;
      if (isAuth) {
        context.read<ChatProvider>().loadRooms();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final chatProvider = context.watch<ChatProvider>();

    if (!auth.isLoggedIn) {
      return Scaffold(
        backgroundColor: AppTheme.backgroundColor,
        appBar: AppBar(title: const Text('Mensajes'), backgroundColor: Colors.white, elevation: 0),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.message_outlined, size: 64, color: AppTheme.textSecondary.withOpacity(0.5)),
              const SizedBox(height: 16),
              const Text('Inicia sesión para ver tus mensajes', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppTheme.textSecondary)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen())),
                child: const Text('Iniciar sesión'),
              ),
            ],
          ),
        ),
      );
    }

    final userId = auth.user!.id;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(title: const Text('Mensajes'), backgroundColor: Colors.white, elevation: 0),
      body: chatProvider.isLoadingRooms
          ? const Center(child: CircularProgressIndicator())
          : chatProvider.rooms.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.chat_bubble_outline, size: 64, color: AppTheme.textSecondary.withOpacity(0.4)),
                      const SizedBox(height: 16),
                      const Text('No tienes conversaciones', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppTheme.textSecondary)),
                      const SizedBox(height: 8),
                      const Text('Contacta a un vendedor desde un producto', style: TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: () => chatProvider.loadRooms(),
                  child: ListView.separated(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    itemCount: chatProvider.rooms.length,
                    separatorBuilder: (_, __) => const Divider(height: 1, indent: 76),
                    itemBuilder: (context, index) {
                      final room = chatProvider.rooms[index];
                      final otherName = room.otherUserName(userId);
                      final otherImage = room.otherUserImage(userId);
                      final lastMsg = room.lastMessage;
                      final timeStr = lastMsg != null
                          ? _formatTime(lastMsg.createdAt)
                          : _formatTime(room.createdAt);

                      return ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                        leading: CircleAvatar(
                          radius: 26,
                          backgroundColor: AppTheme.accentColor.withOpacity(0.1),
                          backgroundImage: otherImage != null ? CachedNetworkImageProvider(otherImage) : null,
                          child: otherImage == null ? Icon(Icons.person, color: AppTheme.accentColor) : null,
                        ),
                        title: Row(
                          children: [
                            Expanded(
                              child: Text(otherName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis),
                            ),
                            Text(timeStr, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                          ],
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (room.product != null)
                              Text(room.product!.name, style: const TextStyle(fontSize: 11, color: AppTheme.accentColor, fontWeight: FontWeight.w500), maxLines: 1, overflow: TextOverflow.ellipsis),
                            Text(
                              lastMsg?.content ?? 'Sin mensajes',
                              style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => ChatConversationScreen(roomId: room.id)),
                          );
                        },
                      );
                    },
                  ),
                ),
    );
  }

  String _formatTime(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 1) return 'Ahora';
    if (diff.inHours < 1) return '${diff.inMinutes}m';
    if (diff.inDays < 1) return '${diff.inHours}h';
    if (diff.inDays < 7) return '${diff.inDays}d';
    return DateFormat('dd/MM').format(dt);
  }
}
