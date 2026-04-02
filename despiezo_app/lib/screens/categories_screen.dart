import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../config/constants.dart';
import 'search_screen.dart';

class CategoriesScreen extends StatelessWidget {
  const CategoriesScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text('Categorías'),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: appCategories.length,
        itemBuilder: (context, index) {
          final cat = appCategories[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: ExpansionTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.accentColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(cat.icon, color: AppTheme.accentColor, size: 22),
              ),
              title: Text(
                cat.name,
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
              children: [
                // "Ver todo" option
                ListTile(
                  dense: true,
                  title: Text(
                    'Ver todo en ${cat.name}',
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.accentColor),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.accentColor),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => SearchScreen(initialCategory: cat.slug),
                      ),
                    );
                  },
                ),
                // Subcategories
                ...cat.subcategories.map((sub) => ListTile(
                      dense: true,
                      title: Text(sub.name, style: const TextStyle(fontSize: 13)),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 12, color: AppTheme.textSecondary),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => SearchScreen(
                              initialCategory: cat.slug,
                              initialSubcategory: sub.slug,
                            ),
                          ),
                        );
                      },
                    )),
              ],
            ),
          );
        },
      ),
    );
  }
}
