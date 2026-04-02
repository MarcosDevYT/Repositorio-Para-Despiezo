import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../config/constants.dart';
import '../providers/product_provider.dart';
import '../providers/auth_provider.dart';
import '../services/product_service.dart';
import '../widgets/product_grid.dart';

class SearchScreen extends StatefulWidget {
  final String? initialQuery;
  final String? initialCategory;
  final String? initialSubcategory;
  final String? initialBrand;

  const SearchScreen({
    Key? key,
    this.initialQuery,
    this.initialCategory,
    this.initialSubcategory,
    this.initialBrand,
  }) : super(key: key);

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final FocusNode _focusNode = FocusNode();

  String? _selectedCategory;
  String? _selectedSubcategory;
  String? _selectedBrand;
  String? _selectedCondition;
  String? _selectedVehicleType;
  Timer? _debounce;
  List<SearchSuggestion> _suggestions = [];
  bool _showSuggestions = false;

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.initialCategory;
    _selectedSubcategory = widget.initialSubcategory;
    _selectedBrand = widget.initialBrand;

    if (widget.initialQuery != null) {
      _searchController.text = widget.initialQuery!;
    }

    _scrollController.addListener(_onScroll);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _performSearch();
      // If no initial query, show popular suggestions when opening search
      if (widget.initialQuery == null && widget.initialCategory == null) {
        _focusNode.requestFocus();
        _loadInitialSuggestions();
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    _focusNode.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _onScroll() {
    final provider = context.read<ProductProvider>();
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      if (!provider.isLoadingSearch && provider.hasMoreResults) {
        provider.searchProducts(
          query: _searchController.text.isNotEmpty ? _searchController.text : null,
          categoria: _selectedCategory,
          subcategoria: _selectedSubcategory,
          marca: _selectedBrand,
          estado: _selectedCondition,
          tipoDeVehiculo: _selectedVehicleType,
          reset: false,
        );
      }
    }
  }

  void _performSearch() {
    setState(() => _showSuggestions = false);
    _focusNode.unfocus();
    context.read<ProductProvider>().searchProducts(
      query: _searchController.text.isNotEmpty ? _searchController.text : null,
      categoria: _selectedCategory,
      subcategoria: _selectedSubcategory,
      marca: _selectedBrand,
      estado: _selectedCondition,
      tipoDeVehiculo: _selectedVehicleType,
    );
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    if (value.length >= 2) {
      _debounce = Timer(const Duration(milliseconds: 300), () async {
        final userId = context.read<AuthProvider>().user?.id;
        final suggestions = await context.read<ProductProvider>().getSuggestions(value, userId: userId);
        if (mounted) {
          setState(() {
            _suggestions = suggestions;
            _showSuggestions = true;
          });
        }
      });
    } else if (value.isEmpty) {
      _loadInitialSuggestions();
    } else {
      setState(() {
        _suggestions = [];
        _showSuggestions = false;
      });
    }
  }

  void _loadInitialSuggestions() async {
    final userId = context.read<AuthProvider>().user?.id;
    final suggestions = await context.read<ProductProvider>().getSuggestions('', userId: userId);
    if (mounted) {
      setState(() {
        _suggestions = suggestions;
        _showSuggestions = suggestions.isNotEmpty;
      });
    }
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _FilterSheet(
        selectedCategory: _selectedCategory,
        selectedCondition: _selectedCondition,
        selectedVehicleType: _selectedVehicleType,
        onApply: (category, condition, vehicleType) {
          setState(() {
            _selectedCategory = category;
            _selectedCondition = condition;
            _selectedVehicleType = vehicleType;
          });
          _performSearch();
        },
      ),
    );
  }

  int get _activeFilterCount {
    int count = 0;
    if (_selectedCategory != null) count++;
    if (_selectedSubcategory != null) count++;
    if (_selectedBrand != null) count++;
    if (_selectedCondition != null) count++;
    if (_selectedVehicleType != null) count++;
    return count;
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductProvider>();

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        titleSpacing: 0,
        title: Container(
          height: 42,
          margin: const EdgeInsets.only(right: 12),
          child: TextField(
            controller: _searchController,
            focusNode: _focusNode,
            onChanged: _onSearchChanged,
            onSubmitted: (_) => _performSearch(),
            decoration: InputDecoration(
              hintText: 'Buscar repuestos, piezas, OEM...',
              hintStyle: const TextStyle(fontSize: 14),
              prefixIcon: const Icon(Icons.search, size: 20),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 18),
                      onPressed: () {
                        _searchController.clear();
                        setState(() {
                          _suggestions = [];
                          _showSuggestions = false;
                        });
                      },
                    )
                  : null,
              contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppTheme.borderColor),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: AppTheme.borderColor),
              ),
              filled: true,
              fillColor: AppTheme.backgroundColor,
            ),
          ),
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.tune),
                onPressed: _showFilterSheet,
              ),
              if (_activeFilterCount > 0)
                Positioned(
                  right: 6,
                  top: 6,
                  child: Container(
                    width: 18,
                    height: 18,
                    decoration: const BoxDecoration(
                      color: AppTheme.accentColor,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        '$_activeFilterCount',
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Stack(
        children: [
          Column(
            children: [
              // Active filters
              if (_activeFilterCount > 0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(bottom: BorderSide(color: AppTheme.borderColor)),
                  ),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        if (_selectedCategory != null)
                          _FilterChip(
                            label: _selectedCategory!,
                            onRemove: () {
                              setState(() => _selectedCategory = null);
                              _performSearch();
                            },
                          ),
                        if (_selectedCondition != null)
                          _FilterChip(
                            label: getConditionLabel(_selectedCondition!),
                            onRemove: () {
                              setState(() => _selectedCondition = null);
                              _performSearch();
                            },
                          ),
                        if (_selectedVehicleType != null)
                          _FilterChip(
                            label: _selectedVehicleType!,
                            onRemove: () {
                              setState(() => _selectedVehicleType = null);
                              _performSearch();
                            },
                          ),
                        TextButton(
                          onPressed: () {
                            setState(() {
                              _selectedCategory = null;
                              _selectedSubcategory = null;
                              _selectedBrand = null;
                              _selectedCondition = null;
                              _selectedVehicleType = null;
                            });
                            _performSearch();
                          },
                          child: const Text('Limpiar', style: TextStyle(fontSize: 12)),
                        ),
                      ],
                    ),
                  ),
                ),

              // Results header
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${productProvider.searchTotal} resultados',
                      style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),

              // Product grid
              Expanded(
                child: productProvider.isLoadingSearch && productProvider.searchResults.isEmpty
                    ? const Center(child: CircularProgressIndicator())
                    : productProvider.searchResults.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.search_off, size: 64, color: AppTheme.textSecondary.withOpacity(0.5)),
                                const SizedBox(height: 16),
                                const Text(
                                  'No se encontraron productos',
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Intenta con otros términos o filtros',
                                  style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                                ),
                              ],
                            ),
                          )
                        : Column(
                            children: [
                              Expanded(
                                child: ProductGrid(
                                  products: productProvider.searchResults,
                                  scrollController: _scrollController,
                                ),
                              ),
                              if (productProvider.isLoadingSearch)
                                const Padding(
                                  padding: EdgeInsets.all(16),
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                ),
                            ],
                          ),
              ),
            ],
          ),

          // Suggestions overlay
          if (_showSuggestions && _suggestions.isNotEmpty)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: Container(
                constraints: const BoxConstraints(maxHeight: 300),
                margin: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: ListView.separated(
                  shrinkWrap: true,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  itemCount: _suggestions.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final s = _suggestions[index];
                    return ListTile(
                      dense: true,
                      leading: Icon(
                        s.type == 'popular' ? Icons.trending_up : Icons.search,
                        size: 18,
                        color: s.type == 'popular' ? AppTheme.featuredColor : AppTheme.textSecondary,
                      ),
                      title: Text(s.text, style: const TextStyle(fontSize: 13)),
                      subtitle: s.brand != null
                          ? Text('${s.brand} ${s.model ?? ''} ${s.year ?? ''}', style: const TextStyle(fontSize: 11))
                          : null,
                      onTap: () {
                        _searchController.text = s.text;
                        _performSearch();
                      },
                    );
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final VoidCallback onRemove;

  const _FilterChip({Key? key, required this.label, required this.onRemove}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 6),
      child: Chip(
        label: Text(label, style: const TextStyle(fontSize: 11)),
        deleteIcon: const Icon(Icons.close, size: 14),
        onDeleted: onRemove,
        backgroundColor: AppTheme.accentColor.withOpacity(0.1),
        side: BorderSide(color: AppTheme.accentColor.withOpacity(0.3)),
        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
        visualDensity: VisualDensity.compact,
      ),
    );
  }
}

class _FilterSheet extends StatefulWidget {
  final String? selectedCategory;
  final String? selectedCondition;
  final String? selectedVehicleType;
  final Function(String? category, String? condition, String? vehicleType) onApply;

  const _FilterSheet({
    Key? key,
    this.selectedCategory,
    this.selectedCondition,
    this.selectedVehicleType,
    required this.onApply,
  }) : super(key: key);

  @override
  State<_FilterSheet> createState() => _FilterSheetState();
}

class _FilterSheetState extends State<_FilterSheet> {
  String? _category;
  String? _condition;
  String? _vehicleType;

  @override
  void initState() {
    super.initState();
    _category = widget.selectedCategory;
    _condition = widget.selectedCondition;
    _vehicleType = widget.selectedVehicleType;
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      maxChildSize: 0.9,
      minChildSize: 0.4,
      expand: false,
      builder: (context, scrollController) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: ListView(
            controller: scrollController,
            children: [
              // Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.borderColor,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text('Filtros', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
              const SizedBox(height: 20),

              // Category
              const Text('Categoría', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: appCategories.map((cat) {
                  final selected = _category == cat.slug;
                  return ChoiceChip(
                    label: Text(cat.name),
                    selected: selected,
                    onSelected: (s) => setState(() => _category = s ? cat.slug : null),
                    selectedColor: AppTheme.accentColor.withOpacity(0.15),
                    labelStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                      color: selected ? AppTheme.accentColor : AppTheme.textPrimary,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),

              // Condition
              const Text('Estado', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: conditionOptions.map((c) {
                  final selected = _condition == c['value'];
                  return ChoiceChip(
                    label: Text(c['label']!),
                    selected: selected,
                    onSelected: (s) => setState(() => _condition = s ? c['value'] : null),
                    selectedColor: getConditionColor(c['value']!).withOpacity(0.15),
                    labelStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),

              // Vehicle type
              const Text('Tipo de vehículo', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: ['Coche', 'Moto', 'Furgoneta', 'Camión'].map((type) {
                  final selected = _vehicleType == type.toLowerCase();
                  return ChoiceChip(
                    label: Text(type),
                    selected: selected,
                    onSelected: (s) => setState(() => _vehicleType = s ? type.toLowerCase() : null),
                    selectedColor: AppTheme.accentColor.withOpacity(0.15),
                    labelStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 30),

              // Apply button
              ElevatedButton(
                onPressed: () {
                  widget.onApply(_category, _condition, _vehicleType);
                  Navigator.pop(context);
                },
                child: const Text('Aplicar filtros'),
              ),
              const SizedBox(height: 8),
              OutlinedButton(
                onPressed: () {
                  widget.onApply(null, null, null);
                  Navigator.pop(context);
                },
                child: const Text('Limpiar filtros'),
              ),
            ],
          ),
        );
      },
    );
  }
}
