import 'package:flutter/material.dart';
import '../models/product_model.dart';
import 'product_card.dart';

class HorizontalProductList extends StatelessWidget {
  final List<ProductModel> products;
  final double height;

  const HorizontalProductList({
    Key? key,
    required this.products,
    this.height = 280,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (products.isEmpty) return const SizedBox.shrink();

    return SizedBox(
      height: height,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: products.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),
        itemBuilder: (context, index) {
          return SizedBox(
            width: 170,
            child: ProductCard(product: products[index]),
          );
        },
      ),
    );
  }
}
