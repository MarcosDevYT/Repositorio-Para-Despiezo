import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../providers/product_provider.dart';
import 'login_screen.dart';
import 'favorites_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    if (!authProvider.isLoggedIn || user == null) {
      return _NotLoggedInView();
    }

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: CustomScrollView(
        slivers: [
          // Profile header
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppTheme.primaryColor,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF1E293B), Color(0xFF334155)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 20),
                      CircleAvatar(
                        radius: 40,
                        backgroundColor: Colors.white.withOpacity(0.2),
                        backgroundImage: user.image != null
                            ? CachedNetworkImageProvider(user.image!)
                            : null,
                        child: user.image == null
                            ? const Icon(Icons.person, size: 40, color: Colors.white)
                            : null,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        user.name ?? 'Usuario',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        user.email,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.white.withOpacity(0.7),
                        ),
                      ),
                      if (user.pro)
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.featuredColor,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'PRO',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Stats row
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _StatItem(
                    icon: Icons.star,
                    label: 'Rating',
                    value: user.averageRating != null
                        ? user.averageRating!.toStringAsFixed(1)
                        : '-',
                    color: AppTheme.featuredColor,
                  ),
                  _StatItem(
                    icon: Icons.reviews,
                    label: 'Reseñas',
                    value: '${user.totalReviews ?? 0}',
                    color: AppTheme.accentColor,
                  ),
                  _StatItem(
                    icon: Icons.verified,
                    label: 'Email',
                    value: user.emailVerified != null ? 'Verificado' : 'Pendiente',
                    color: user.emailVerified != null ? AppTheme.successColor : AppTheme.warningColor,
                  ),
                ],
              ),
            ),
          ),

          // Menu items
          SliverToBoxAdapter(
            child: Column(
              children: [
                const SizedBox(height: 8),
                _MenuSection(
                  title: 'Mi cuenta',
                  items: [
                    _MenuItem(
                      icon: Icons.person_outline,
                      label: 'Editar perfil',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Editar perfil disponible en la web')),
                        );
                      },
                    ),
                    _MenuItem(
                      icon: Icons.favorite_border,
                      label: 'Favoritos',
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const FavoritesScreen()));
                      },
                    ),
                    _MenuItem(
                      icon: Icons.shopping_bag_outlined,
                      label: 'Mis compras',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Compras disponibles en la web')),
                        );
                      },
                    ),
                    _MenuItem(
                      icon: Icons.message_outlined,
                      label: 'Mensajes',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Mensajes disponibles en la web')),
                        );
                      },
                    ),
                  ],
                ),
                _MenuSection(
                  title: 'Vendedor',
                  items: [
                    _MenuItem(
                      icon: Icons.store_outlined,
                      label: 'Mi negocio',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Mi negocio disponible en la web')),
                        );
                      },
                    ),
                    _MenuItem(
                      icon: Icons.inventory_2_outlined,
                      label: 'Mis productos',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Gestión de productos disponible en la web')),
                        );
                      },
                    ),
                    _MenuItem(
                      icon: Icons.shopping_cart_outlined,
                      label: 'Mis ventas',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Ventas disponibles en la web')),
                        );
                      },
                    ),
                  ],
                ),
                _MenuSection(
                  title: 'Configuración',
                  items: [
                    _MenuItem(
                      icon: Icons.bolt,
                      label: 'Administrar Plan',
                      trailing: user.pro
                          ? Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.featuredColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text('PRO', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.featuredColor)),
                            )
                          : null,
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Suscripción disponible en la web')),
                        );
                      },
                    ),
                    _MenuItem(
                      icon: Icons.settings_outlined,
                      label: 'Configuración',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Configuración disponible en la web')),
                        );
                      },
                    ),
                  ],
                ),

                // Info section
                Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.borderColor),
                  ),
                  child: Column(
                    children: [
                      if (user.location != null) ...[
                        Row(
                          children: [
                            const Icon(Icons.location_on_outlined, size: 16, color: AppTheme.textSecondary),
                            const SizedBox(width: 8),
                            Text(user.location!, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                          ],
                        ),
                        const SizedBox(height: 8),
                      ],
                      if (user.phoneNumber != null) ...[
                        Row(
                          children: [
                            const Icon(Icons.phone_outlined, size: 16, color: AppTheme.textSecondary),
                            const SizedBox(width: 8),
                            Text(user.phoneNumber!, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                          ],
                        ),
                        const SizedBox(height: 8),
                      ],
                      if (user.businessName != null)
                        Row(
                          children: [
                            const Icon(Icons.business_outlined, size: 16, color: AppTheme.textSecondary),
                            const SizedBox(width: 8),
                            Text(user.businessName!, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                          ],
                        ),
                    ],
                  ),
                ),

                // Logout button
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      await authProvider.logout();
                    },
                    icon: const Icon(Icons.logout, size: 18, color: AppTheme.errorColor),
                    label: const Text('Cerrar sesión', style: TextStyle(color: AppTheme.errorColor)),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.errorColor.withOpacity(0.3)),
                      minimumSize: const Size(double.infinity, 48),
                    ),
                  ),
                ),

                const SizedBox(height: 100),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _NotLoggedInView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.accentColor.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.person_outline, size: 64, color: AppTheme.accentColor),
              ),
              const SizedBox(height: 24),
              const Text(
                'Inicia sesión',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
              ),
              const SizedBox(height: 8),
              const Text(
                'Accede a tu cuenta para ver tu perfil, favoritos, compras y más',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: AppTheme.textSecondary),
              ),
              const SizedBox(height: 28),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                },
                style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                child: const Text('Iniciar sesión'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatItem({Key? key, required this.icon, required this.label, required this.value, required this.color}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, size: 22, color: color),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: color)),
        Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
      ],
    );
  }
}

class _MenuSection extends StatelessWidget {
  final String title;
  final List<_MenuItem> items;

  const _MenuSection({Key? key, required this.title, required this.items}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              title,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textSecondary, letterSpacing: 0.5),
            ),
          ),
          ...items,
        ],
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final Widget? trailing;
  final VoidCallback onTap;

  const _MenuItem({Key? key, required this.icon, required this.label, this.trailing, required this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, size: 22, color: AppTheme.textPrimary),
      title: Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
      trailing: trailing ?? const Icon(Icons.chevron_right, size: 20, color: AppTheme.textSecondary),
      onTap: onTap,
      dense: true,
    );
  }
}
