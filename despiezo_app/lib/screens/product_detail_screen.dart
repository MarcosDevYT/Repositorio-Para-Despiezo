import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../config/constants.dart';
import '../models/product_model.dart';
import '../providers/product_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/chat_provider.dart';
import '../widgets/horizontal_product_list.dart';
import '../widgets/section_header.dart';
import 'chat_conversation_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;

  const ProductDetailScreen({Key? key, required this.productId}) : super(key: key);

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _currentImageIndex = 0;
  final PageController _pageController = PageController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProductProvider>().loadProductDetail(widget.productId);
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProductProvider>();
    final product = provider.selectedProduct;
    final isAuth = context.watch<AuthProvider>().isLoggedIn;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: provider.isLoadingDetail
          ? const Center(child: CircularProgressIndicator())
          : product == null
              ? const Center(child: Text('Producto no encontrado'))
              : CustomScrollView(
                  slivers: [
                    // App bar with image gallery
                    SliverAppBar(
                      expandedHeight: 350,
                      pinned: true,
                      backgroundColor: Colors.white,
                      flexibleSpace: FlexibleSpaceBar(
                        background: product.images.isNotEmpty
                            ? Stack(
                                children: [
                                  PageView.builder(
                                    controller: _pageController,
                                    onPageChanged: (i) => setState(() => _currentImageIndex = i),
                                    itemCount: product.images.length,
                                    itemBuilder: (context, index) {
                                      return CachedNetworkImage(
                                        imageUrl: product.images[index],
                                        fit: BoxFit.cover,
                                        placeholder: (_, __) => Container(
                                          color: AppTheme.backgroundColor,
                                          child: const Center(child: CircularProgressIndicator(strokeWidth: 2)),
                                        ),
                                        errorWidget: (_, __, ___) => Container(
                                          color: AppTheme.backgroundColor,
                                          child: const Icon(Icons.image_not_supported_outlined, size: 48),
                                        ),
                                      );
                                    },
                                  ),
                                  // Image indicator
                                  if (product.images.length > 1)
                                    Positioned(
                                      bottom: 16,
                                      left: 0,
                                      right: 0,
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: List.generate(
                                          product.images.length,
                                          (i) => Container(
                                            margin: const EdgeInsets.symmetric(horizontal: 3),
                                            width: _currentImageIndex == i ? 20 : 8,
                                            height: 8,
                                            decoration: BoxDecoration(
                                              color: _currentImageIndex == i
                                                  ? AppTheme.accentColor
                                                  : Colors.white.withOpacity(0.6),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              )
                            : Container(
                                color: AppTheme.backgroundColor,
                                child: const Icon(Icons.image_not_supported_outlined, size: 64),
                              ),
                      ),
                      actions: [
                        if (isAuth)
                          IconButton(
                            icon: Icon(
                              product.isFavorite ? Icons.favorite : Icons.favorite_border,
                              color: product.isFavorite ? AppTheme.errorColor : Colors.white,
                            ),
                            onPressed: () => provider.toggleFavorite(product.id),
                          ),
                        IconButton(
                          icon: const Icon(Icons.share, color: Colors.white),
                          onPressed: () {},
                        ),
                      ],
                    ),

                    // Product info
                    SliverToBoxAdapter(
                      child: Container(
                        color: Colors.white,
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Badges row
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: getConditionColor(product.condition).withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(color: getConditionColor(product.condition).withOpacity(0.3)),
                                  ),
                                  child: Text(
                                    getConditionLabel(product.condition),
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: getConditionColor(product.condition),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                if (product.isFeatured)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: AppTheme.featuredColor.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: const [
                                        Icon(Icons.star, size: 14, color: AppTheme.featuredColor),
                                        SizedBox(width: 4),
                                        Text(
                                          'Destacado',
                                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.featuredColor),
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 12),

                            // Name
                            Text(
                              product.name,
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                            ),
                            const SizedBox(height: 8),

                            // Price
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  '${product.displayPrice} \u20AC',
                                  style: TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.w800,
                                    color: product.offer == true ? AppTheme.errorColor : AppTheme.textPrimary,
                                  ),
                                ),
                                if (product.offer == true && product.offerPrice != null) ...[
                                  const SizedBox(width: 10),
                                  Text(
                                    '${product.price} \u20AC',
                                    style: const TextStyle(
                                      fontSize: 18,
                                      color: AppTheme.textSecondary,
                                      decoration: TextDecoration.lineThrough,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'IVA incluido',
                              style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Vehicle info section
                    SliverToBoxAdapter(
                      child: Container(
                        margin: const EdgeInsets.only(top: 8),
                        color: Colors.white,
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Información del vehículo',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 12),
                            _InfoRow(icon: Icons.directions_car, label: 'Marca', value: product.brand),
                            _InfoRow(icon: Icons.model_training, label: 'Modelo', value: product.model),
                            _InfoRow(icon: Icons.calendar_today, label: 'Año', value: product.year),
                            _InfoRow(icon: Icons.category, label: 'Categoría', value: product.category),
                            if (product.subcategory != null)
                              _InfoRow(icon: Icons.label_outline, label: 'Subcategoría', value: product.subcategory!),
                            _InfoRow(icon: Icons.confirmation_number, label: 'OEM', value: product.oemNumber),
                            _InfoRow(icon: Icons.two_wheeler, label: 'Tipo', value: product.tipoDeVehiculo),
                            _InfoRow(icon: Icons.build, label: 'Tipo de pieza', value: product.typeOfPiece),
                            _InfoRow(icon: Icons.location_on, label: 'Ubicación', value: product.location),
                          ],
                        ),
                      ),
                    ),

                    // Description
                    SliverToBoxAdapter(
                      child: Container(
                        margin: const EdgeInsets.only(top: 8),
                        color: Colors.white,
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Descripción',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              product.description,
                              style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Vendor info
                    if (product.vendor != null)
                      SliverToBoxAdapter(
                        child: Container(
                          margin: const EdgeInsets.only(top: 8),
                          color: Colors.white,
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Vendedor', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  CircleAvatar(
                                    radius: 24,
                                    backgroundColor: AppTheme.accentColor.withOpacity(0.1),
                                    backgroundImage: product.vendor!.image != null
                                        ? CachedNetworkImageProvider(product.vendor!.image!)
                                        : null,
                                    child: product.vendor!.image == null
                                        ? Icon(Icons.person, color: AppTheme.accentColor)
                                        : null,
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          product.vendor!.businessName ?? product.vendor!.name ?? 'Vendedor',
                                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                                        ),
                                        if (product.vendor!.location != null)
                                          Text(
                                            product.vendor!.location!,
                                            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                                          ),
                                        if (product.vendor!.averageRating != null && product.vendor!.averageRating! > 0)
                                          Row(
                                            children: [
                                              const Icon(Icons.star, size: 14, color: AppTheme.featuredColor),
                                              const SizedBox(width: 4),
                                              Text(
                                                '${product.vendor!.averageRating!.toStringAsFixed(1)} (${product.vendor!.totalReviews ?? 0})',
                                                style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                                              ),
                                            ],
                                          ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),

                    // Related products
                    if (provider.relatedProducts.isNotEmpty) ...[
                      SliverToBoxAdapter(
                        child: SectionHeader(title: 'Más del vendedor'),
                      ),
                      SliverToBoxAdapter(
                        child: HorizontalProductList(products: provider.relatedProducts),
                      ),
                    ],

                    const SliverToBoxAdapter(child: SizedBox(height: 100)),
                  ],
                ),
      // Bottom bar with buy button
      bottomNavigationBar: product != null
          ? Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -2)),
                ],
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${product.displayPrice} \u20AC',
                            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
                          ),
                          const Text('Envío disponible', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton.icon(
                      onPressed: () async {
                        if (!context.read<AuthProvider>().isLoggedIn) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Inicia sesion para chatear')),
                          );
                          return;
                        }
                        final roomId = await context.read<ChatProvider>().startChat(product.id);
                        if (roomId != null && mounted) {
                          Navigator.push(context, MaterialPageRoute(
                            builder: (_) => ChatConversationScreen(roomId: roomId),
                          ));
                        }
                      },
                      icon: const Icon(Icons.chat_bubble_outline, size: 18),
                      label: const Text('Chat'),
                      style: OutlinedButton.styleFrom(
                        primary: AppTheme.accentColor,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Compra disponible en la web')),
                        );
                      },
                      icon: const Icon(Icons.shopping_cart_outlined, size: 18),
                      label: const Text('Comprar'),
                      style: ElevatedButton.styleFrom(
                        primary: AppTheme.accentColor,
                        onPrimary: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : null,
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoRow({Key? key, required this.icon, required this.label, required this.value}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (value.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppTheme.textSecondary),
          const SizedBox(width: 10),
          Text('$label:', style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, fontWeight: FontWeight.w500)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
