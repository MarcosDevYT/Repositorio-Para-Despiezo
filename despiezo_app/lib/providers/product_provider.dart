import 'package:flutter/material.dart';
import '../models/product_model.dart';
import '../services/product_service.dart';

class ProductProvider extends ChangeNotifier {
  final ProductService _productService;

  List<ProductModel> _featuredProducts = [];
  List<ProductModel> _recentProducts = [];
  List<ProductModel> _popularProducts = [];
  List<ProductModel> _searchResults = [];
  List<ProductModel> _favorites = [];
  ProductModel? _selectedProduct;
  List<ProductModel> _relatedProducts = [];

  bool _isLoadingHome = false;
  bool _isLoadingSearch = false;
  bool _isLoadingDetail = false;
  bool _isLoadingFavorites = false;
  int _searchTotal = 0;
  int _searchPage = 1;
  bool _hasMoreResults = true;
  String? _error;

  ProductProvider(this._productService);

  List<ProductModel> get featuredProducts => _featuredProducts;
  List<ProductModel> get recentProducts => _recentProducts;
  List<ProductModel> get popularProducts => _popularProducts;
  List<ProductModel> get searchResults => _searchResults;
  List<ProductModel> get favorites => _favorites;
  ProductModel? get selectedProduct => _selectedProduct;
  List<ProductModel> get relatedProducts => _relatedProducts;
  bool get isLoadingHome => _isLoadingHome;
  bool get isLoadingSearch => _isLoadingSearch;
  bool get isLoadingDetail => _isLoadingDetail;
  bool get isLoadingFavorites => _isLoadingFavorites;
  int get searchTotal => _searchTotal;
  int get searchPage => _searchPage;
  bool get hasMoreResults => _hasMoreResults;
  String? get error => _error;

  Future<void> loadHomeProducts() async {
    if (_isLoadingHome) return;
    _isLoadingHome = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _productService.getHomeProducts();
      _featuredProducts = response.featured;
      _recentProducts = response.recent;
      _popularProducts = response.popular;
    } catch (e) {
      _error = 'Error al cargar productos';
    }

    _isLoadingHome = false;
    notifyListeners();
  }

  Future<void> searchProducts({
    String? query,
    String? categoria,
    String? subcategoria,
    String? marca,
    String? modelo,
    String? estado,
    String? anio,
    String? tipoDeVehiculo,
    String? priceMin,
    String? priceMax,
    bool reset = true,
  }) async {
    if (_isLoadingSearch) return;

    if (reset) {
      _searchPage = 1;
      _searchResults = [];
      _hasMoreResults = true;
    }

    _isLoadingSearch = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _productService.getProducts(
        query: query,
        categoria: categoria,
        subcategoria: subcategoria,
        marca: marca,
        modelo: modelo,
        estado: estado,
        anio: anio,
        tipoDeVehiculo: tipoDeVehiculo,
        priceMin: priceMin,
        priceMax: priceMax,
        page: _searchPage,
      );

      if (reset) {
        _searchResults = response.products;
      } else {
        _searchResults.addAll(response.products);
      }
      _searchTotal = response.total;
      _hasMoreResults = _searchResults.length < response.total;
      _searchPage++;
    } catch (e) {
      _error = 'Error al buscar productos';
    }

    _isLoadingSearch = false;
    notifyListeners();
  }

  Future<void> loadProductDetail(String id) async {
    _isLoadingDetail = true;
    _selectedProduct = null;
    _relatedProducts = [];
    _error = null;
    notifyListeners();

    try {
      final response = await _productService.getProductById(id);
      _selectedProduct = response.product;
      _relatedProducts = response.relatedProducts;
    } catch (e) {
      _error = 'Error al cargar el producto';
    }

    _isLoadingDetail = false;
    notifyListeners();
  }

  Future<void> loadFavorites() async {
    _isLoadingFavorites = true;
    notifyListeners();

    try {
      _favorites = await _productService.getFavorites();
    } catch (e) {
      _error = 'Error al cargar favoritos';
    }

    _isLoadingFavorites = false;
    notifyListeners();
  }

  Future<void> toggleFavorite(String productId) async {
    try {
      final isFavorite = await _productService.toggleFavorite(productId);

      // Update in all lists
      void updateList(List<ProductModel> list) {
        for (int i = 0; i < list.length; i++) {
          if (list[i].id == productId) {
            list[i].isFavorite = isFavorite;
          }
        }
      }

      updateList(_featuredProducts);
      updateList(_recentProducts);
      updateList(_popularProducts);
      updateList(_searchResults);
      updateList(_relatedProducts);

      if (_selectedProduct?.id == productId) {
        _selectedProduct!.isFavorite = isFavorite;
      }

      if (!isFavorite) {
        _favorites.removeWhere((p) => p.id == productId);
      }

      notifyListeners();
    } catch (_) {}
  }

  Future<List<SearchSuggestion>> getSuggestions(String query, {String? userId}) async {
    try {
      return await _productService.getSuggestions(query, userId: userId);
    } catch (_) {
      return [];
    }
  }
}
