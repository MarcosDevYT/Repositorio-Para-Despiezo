import '../config/api_config.dart';
import '../models/product_model.dart';
import 'api_service.dart';

class ProductService {
  final ApiService _api;

  ProductService(this._api);

  Future<ProductsResponse> getProducts({
    String? query,
    String? categoria,
    String? subcategoria,
    String? oem,
    String? marca,
    String? modelo,
    String? estado,
    String? anio,
    String? tipoDeVehiculo,
    String? priceMin,
    String? priceMax,
    int page = 1,
    int limit = 20,
    String orderBy = 'createdAt',
    String orderDirection = 'desc',
  }) async {
    final params = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
      'orderBy': orderBy,
      'orderDirection': orderDirection,
    };
    if (query != null && query.isNotEmpty) params['query'] = query;
    if (categoria != null && categoria.isNotEmpty) params['categoria'] = categoria;
    if (subcategoria != null && subcategoria.isNotEmpty) params['subcategoria'] = subcategoria;
    if (oem != null && oem.isNotEmpty) params['oem'] = oem;
    if (marca != null && marca.isNotEmpty) params['marca'] = marca;
    if (modelo != null && modelo.isNotEmpty) params['modelo'] = modelo;
    if (estado != null && estado.isNotEmpty) params['estado'] = estado;
    if (anio != null && anio.isNotEmpty) params['anio'] = anio;
    if (tipoDeVehiculo != null && tipoDeVehiculo.isNotEmpty) params['tipoDeVehiculo'] = tipoDeVehiculo;
    if (priceMin != null && priceMin.isNotEmpty) params['priceMin'] = priceMin;
    if (priceMax != null && priceMax.isNotEmpty) params['priceMax'] = priceMax;

    final data = await _api.get(ApiConfig.productsEndpoint, queryParams: params);
    final products = (data['products'] as List?)
            ?.map((p) => ProductModel.fromJson(p))
            .toList() ??
        [];
    return ProductsResponse(
      products: products,
      total: data['total'] ?? 0,
      page: data['page'] ?? 1,
      limit: data['limit'] ?? 20,
    );
  }

  Future<ProductDetailResponse> getProductById(String id) async {
    final data = await _api.get(ApiConfig.productDetailEndpoint(id));
    return ProductDetailResponse(
      product: ProductModel.fromJson(data['product']),
      relatedProducts: (data['relatedProducts'] as List?)
              ?.map((p) => ProductModel.fromJson(p))
              .toList() ??
          [],
    );
  }

  Future<HomeProductsResponse> getHomeProducts() async {
    final data = await _api.get(ApiConfig.featuredEndpoint);
    return HomeProductsResponse(
      featured: (data['featured'] as List?)?.map((p) => ProductModel.fromJson(p)).toList() ?? [],
      recent: (data['recent'] as List?)?.map((p) => ProductModel.fromJson(p)).toList() ?? [],
      popular: (data['popular'] as List?)?.map((p) => ProductModel.fromJson(p)).toList() ?? [],
    );
  }

  Future<List<SearchSuggestion>> getSuggestions(String query, {String? userId}) async {
    final params = <String, String>{'q': query};
    if (userId != null) params['userId'] = userId;
    final data = await _api.get(ApiConfig.searchSuggestEndpoint, queryParams: params);

    final results = <SearchSuggestion>[];

    if (data['suggestions'] != null) {
      for (final s in data['suggestions']) {
        results.add(SearchSuggestion(
          type: s['type'] ?? 'product',
          text: s['name'] ?? s['oemNumber'] ?? s['brand'] ?? '',
          id: s['id'],
          brand: s['brand'],
          model: s['model'],
          year: s['year'],
        ));
      }
    }

    if (data['popular'] != null) {
      for (final p in data['popular']) {
        results.add(SearchSuggestion(
          type: 'popular',
          text: p['query'] ?? '',
        ));
      }
    }

    return results;
  }

  Future<List<ProductModel>> getFavorites() async {
    final data = await _api.get(ApiConfig.favoritesEndpoint);
    return (data['products'] as List?)
            ?.map((p) => ProductModel.fromJson(p))
            .toList() ??
        [];
  }

  Future<bool> toggleFavorite(String productId) async {
    final data = await _api.post(ApiConfig.favoritesEndpoint, {'productId': productId});
    return data['isFavorite'] ?? false;
  }
}

class ProductsResponse {
  final List<ProductModel> products;
  final int total;
  final int page;
  final int limit;

  ProductsResponse({
    required this.products,
    required this.total,
    required this.page,
    required this.limit,
  });

  int get totalPages => (total / limit).ceil();
}

class ProductDetailResponse {
  final ProductModel product;
  final List<ProductModel> relatedProducts;

  ProductDetailResponse({required this.product, required this.relatedProducts});
}

class HomeProductsResponse {
  final List<ProductModel> featured;
  final List<ProductModel> recent;
  final List<ProductModel> popular;

  HomeProductsResponse({
    required this.featured,
    required this.recent,
    required this.popular,
  });
}

class SearchSuggestion {
  final String type;
  final String text;
  final String? id;
  final String? brand;
  final String? model;
  final String? year;

  SearchSuggestion({
    required this.type,
    required this.text,
    this.id,
    this.brand,
    this.model,
    this.year,
  });
}
