import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../config/constants.dart';
import '../providers/product_provider.dart';
import '../providers/chat_provider.dart';
import '../widgets/category_bar.dart';
import '../widgets/section_header.dart';
import '../widgets/horizontal_product_list.dart';
import 'search_screen.dart';
import 'categories_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _matriculaCtrl = TextEditingController();
  final _oemCtrl = TextEditingController();
  int _searchTab = 0; // 0=general, 1=matricula, 2=OEM
  String? _selectedMarca;
  String? _selectedModelo;
  List<Map<String, dynamic>> _marcas = [];
  List<Map<String, dynamic>> _modelos = [];
  List<Map<String, dynamic>> _filteredModelos = [];
  bool _loadingVehicleData = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProductProvider>().loadHomeProducts();
      _loadVehicleSelectors();
    });
  }

  Future<void> _loadVehicleSelectors() async {
    final chatProvider = context.read<ChatProvider>();
    final marcas = await chatProvider.getMarcas();
    final modelos = await chatProvider.getModelos();
    if (mounted) {
      setState(() {
        _marcas = marcas;
        _modelos = modelos;
      });
    }
  }

  void _onMarcaChanged(String? marca) {
    setState(() {
      _selectedMarca = marca;
      _selectedModelo = null;
      _filteredModelos = marca != null
          ? _modelos.where((m) => m['marca']?.toString().toLowerCase() == marca.toLowerCase()).toList()
          : [];
    });
  }

  void _searchByVehicle() {
    if (_searchTab == 1) {
      final plate = _matriculaCtrl.text.trim();
      if (plate.isEmpty) return;
      Navigator.push(context, MaterialPageRoute(
        builder: (_) => SearchScreen(initialQuery: plate),
      ));
    } else if (_searchTab == 2) {
      final oem = _oemCtrl.text.trim();
      if (oem.isEmpty) return;
      Navigator.push(context, MaterialPageRoute(
        builder: (_) => SearchScreen(initialQuery: oem),
      ));
    } else {
      Navigator.push(context, MaterialPageRoute(
        builder: (_) => SearchScreen(
          initialBrand: _selectedMarca,
          initialQuery: _selectedModelo,
        ),
      ));
    }
  }

  @override
  void dispose() {
    _matriculaCtrl.dispose();
    _oemCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductProvider>();

    return RefreshIndicator(
      onRefresh: () => productProvider.loadHomeProducts(),
      child: CustomScrollView(
        slivers: [
          // App Bar with search
          SliverAppBar(
            floating: true,
            snap: true,
            backgroundColor: Colors.white,
            elevation: 0,
            toolbarHeight: 70,
            title: GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SearchScreen()));
              },
              child: Container(
                height: 46,
                decoration: BoxDecoration(
                  color: AppTheme.backgroundColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderColor),
                ),
                child: Row(
                  children: [
                    SizedBox(width: 14),
                    Icon(Icons.search, color: AppTheme.textSecondary, size: 22),
                    SizedBox(width: 10),
                    Text(
                      'Buscar repuestos, piezas, OEM...',
                      style: TextStyle(color: AppTheme.textSecondary, fontSize: 14, fontWeight: FontWeight.w400),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Category bar
          SliverToBoxAdapter(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(bottom: BorderSide(color: AppTheme.borderColor)),
              ),
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: CategoryBar(
                onCategoryTap: (slug, _) {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => SearchScreen(initialCategory: slug)));
                },
              ),
            ),
          ),

          // Advanced search section (replaces Hero)
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E293B), Color(0xFF334155)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                    child: Row(
                      children: const [
                        Icon(Icons.directions_car, color: Colors.white, size: 22),
                        SizedBox(width: 8),
                        Text('Busca piezas para tu vehículo', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Tabs
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        _buildTab('Marca / Modelo', 0),
                        _buildTab('Matrícula', 1),
                        _buildTab('OEM', 2),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Tab content
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: _buildSearchContent(),
                  ),
                ],
              ),
            ),
          ),

          // Categories grid
          SliverToBoxAdapter(
            child: Column(
              children: [
                SectionHeader(
                  title: 'Categorías',
                  subtitle: 'Explora por tipo de pieza',
                  onSeeAll: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const CategoriesScreen()));
                  },
                ),
                SizedBox(
                  height: 100,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: appCategories.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 10),
                    itemBuilder: (context, index) {
                      final cat = appCategories[index];
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(context, MaterialPageRoute(builder: (_) => SearchScreen(initialCategory: cat.slug)));
                        },
                        child: Container(
                          width: 90,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.borderColor),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(cat.icon, size: 28, color: AppTheme.accentColor),
                              const SizedBox(height: 6),
                              Text(cat.name, textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Loading indicator
          if (productProvider.isLoadingHome)
            const SliverToBoxAdapter(
              child: Padding(padding: EdgeInsets.all(32), child: Center(child: CircularProgressIndicator())),
            ),

          // Featured products
          if (productProvider.featuredProducts.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: SectionHeader(title: 'Productos Destacados', subtitle: 'Los mejores del momento', onSeeAll: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SearchScreen()));
              }),
            ),
            SliverToBoxAdapter(child: HorizontalProductList(products: productProvider.featuredProducts)),
          ],

          // Popular products (Más Vendidos)
          if (productProvider.popularProducts.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: SectionHeader(title: 'Más Vendidos', subtitle: 'Los productos más populares', onSeeAll: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SearchScreen()));
              }),
            ),
            SliverToBoxAdapter(child: HorizontalProductList(products: productProvider.popularProducts)),
          ],

          // Recent products (Recién Llegados)
          if (productProvider.recentProducts.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: SectionHeader(title: 'Recién Llegados', subtitle: 'Nuevas publicaciones', onSeeAll: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SearchScreen()));
              }),
            ),
            SliverToBoxAdapter(child: HorizontalProductList(products: productProvider.recentProducts)),
          ],

          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }

  Widget _buildTab(String label, int index) {
    final selected = _searchTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _searchTab = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: selected ? AppTheme.accentColor : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSearchContent() {
    switch (_searchTab) {
      case 1: // Matrícula
        return Row(
          children: [
            Expanded(
              child: TextField(
                controller: _matriculaCtrl,
                textCapitalization: TextCapitalization.characters,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Ej: 1234ABC',
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14),
                  prefixIcon: Icon(Icons.badge_outlined, color: Colors.white.withOpacity(0.7), size: 20),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.1),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                ),
                onSubmitted: (_) => _searchByVehicle(),
              ),
            ),
            const SizedBox(width: 8),
            _searchButton(),
          ],
        );
      case 2: // OEM
        return Row(
          children: [
            Expanded(
              child: TextField(
                controller: _oemCtrl,
                textCapitalization: TextCapitalization.characters,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Número OEM',
                  hintStyle: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14),
                  prefixIcon: Icon(Icons.confirmation_number_outlined, color: Colors.white.withOpacity(0.7), size: 20),
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.1),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                ),
                onSubmitted: (_) => _searchByVehicle(),
              ),
            ),
            const SizedBox(width: 8),
            _searchButton(),
          ],
        );
      default: // Marca/Modelo
        return Column(
          children: [
            // Marca dropdown
            Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedMarca,
                  hint: Text('Selecciona marca', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14)),
                  isExpanded: true,
                  dropdownColor: const Color(0xFF334155),
                  icon: Icon(Icons.keyboard_arrow_down, color: Colors.white.withOpacity(0.7)),
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  items: _marcas.map((m) {
                    final marca = m['marca']?.toString() ?? '';
                    return DropdownMenuItem(value: marca, child: Text(marca));
                  }).toList(),
                  onChanged: _onMarcaChanged,
                ),
              ),
            ),
            const SizedBox(height: 8),
            // Modelo dropdown
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedModelo,
                        hint: Text('Selecciona modelo', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 14)),
                        isExpanded: true,
                        dropdownColor: const Color(0xFF334155),
                        icon: Icon(Icons.keyboard_arrow_down, color: Colors.white.withOpacity(0.7)),
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        items: _filteredModelos.map((m) {
                          final modelo = m['modelo']?.toString() ?? '';
                          return DropdownMenuItem(value: modelo, child: Text(modelo));
                        }).toList(),
                        onChanged: (v) => setState(() => _selectedModelo = v),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                _searchButton(),
              ],
            ),
          ],
        );
    }
  }

  Widget _searchButton() {
    return ElevatedButton(
      onPressed: _searchByVehicle,
      style: ElevatedButton.styleFrom(
        primary: AppTheme.accentColor,
        onPrimary: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
      child: const Icon(Icons.search, size: 22),
    );
  }
}
