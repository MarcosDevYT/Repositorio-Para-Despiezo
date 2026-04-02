import 'package:flutter/material.dart';
import '../config/constants.dart';
import '../config/theme.dart';

class CategoryBar extends StatelessWidget {
  final Function(String categorySlug, String? subcategorySlug)? onCategoryTap;

  const CategoryBar({Key? key, this.onCategoryTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: appCategories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = appCategories[index];
          return ActionChip(
            avatar: Icon(cat.icon, size: 16, color: AppTheme.accentColor),
            label: Text(
              cat.name,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
            ),
            backgroundColor: Colors.white,
            side: const BorderSide(color: AppTheme.borderColor),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            onPressed: () {
              if (onCategoryTap != null) {
                onCategoryTap!(cat.slug, null);
              }
            },
          );
        },
      ),
    );
  }
}
