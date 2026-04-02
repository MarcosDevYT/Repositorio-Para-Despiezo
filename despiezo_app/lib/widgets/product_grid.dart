import 'package:flutter/material.dart';
import '../models/product_model.dart';
import 'product_card.dart';

class ProductGrid extends StatelessWidget {
  final List<ProductModel> products;
  final bool showFavorite;
  final ScrollController? scrollController;

  const ProductGrid({
    Key? key,
    required this.products,
    this.showFavorite = true,
    this.scrollController,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final crossAxisCount = width > 900 ? 4 : (width > 600 ? 3 : 2);

    return GridView.builder(
      controller: scrollController,
      padding: const EdgeInsets.all(12),
      shrinkWrap: true,
      physics: scrollController != null
          ? const AlwaysScrollableScrollPhysics()
          : const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        childAspectRatio: 0.62,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        return ProductCard(product: products[index], showFavorite: showFavorite);
      },
    );
  }
}
