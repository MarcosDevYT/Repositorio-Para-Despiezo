class ProductModel {
  final String id;
  final String name;
  final String description;
  final String price;
  final List<String> images;
  final String oemNumber;
  final String brand;
  final String model;
  final String year;
  final String tipoDeVehiculo;
  final String condition;
  final String status;
  final String typeOfPiece;
  final String location;
  final String category;
  final String? subcategory;
  final bool? offer;
  final String? offerPrice;
  final double? weight;
  final double? length;
  final double? width;
  final double? height;
  final DateTime? featuredUntil;
  final int clicks;
  final String vendorId;
  final VendorSummary? vendor;
  final DateTime createdAt;
  final DateTime updatedAt;
  bool isFavorite;

  ProductModel({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.images,
    required this.oemNumber,
    required this.brand,
    required this.model,
    required this.year,
    required this.tipoDeVehiculo,
    required this.condition,
    required this.status,
    required this.typeOfPiece,
    required this.location,
    required this.category,
    this.subcategory,
    this.offer,
    this.offerPrice,
    this.weight,
    this.length,
    this.width,
    this.height,
    this.featuredUntil,
    this.clicks = 0,
    required this.vendorId,
    this.vendor,
    required this.createdAt,
    required this.updatedAt,
    this.isFavorite = false,
  });

  String get displayPrice {
    if (offer == true && offerPrice != null && offerPrice!.isNotEmpty) {
      return offerPrice!;
    }
    return price;
  }

  bool get isFeatured {
    if (featuredUntil == null) return false;
    return featuredUntil!.isAfter(DateTime.now());
  }

  String? get firstImage => images.isNotEmpty ? images[0] : null;

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: json['price']?.toString() ?? '0',
      images: json['images'] != null ? List<String>.from(json['images']) : [],
      oemNumber: json['oemNumber'] ?? '',
      brand: json['brand'] ?? '',
      model: json['model'] ?? '',
      year: json['year'] ?? '',
      tipoDeVehiculo: json['tipoDeVehiculo'] ?? '',
      condition: json['condition'] ?? '',
      status: json['status'] ?? '',
      typeOfPiece: json['typeOfPiece'] ?? '',
      location: json['location'] ?? '',
      category: json['category'] ?? '',
      subcategory: json['subcategory'],
      offer: json['offer'],
      offerPrice: json['offerPrice']?.toString(),
      weight: json['weight']?.toDouble(),
      length: json['length']?.toDouble(),
      width: json['width']?.toDouble(),
      height: json['height']?.toDouble(),
      featuredUntil: json['featuredUntil'] != null
          ? DateTime.tryParse(json['featuredUntil'].toString())
          : null,
      clicks: json['clicks'] ?? 0,
      vendorId: json['vendorId'] ?? '',
      vendor: json['vendor'] != null ? VendorSummary.fromJson(json['vendor']) : null,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
      isFavorite: json['isFavorite'] ?? false,
    );
  }
}

class VendorSummary {
  final String id;
  final String? name;
  final String? image;
  final String? location;
  final String? businessName;
  final double? averageRating;
  final int? totalReviews;
  final DateTime? createdAt;

  VendorSummary({
    required this.id,
    this.name,
    this.image,
    this.location,
    this.businessName,
    this.averageRating,
    this.totalReviews,
    this.createdAt,
  });

  factory VendorSummary.fromJson(Map<String, dynamic> json) {
    return VendorSummary(
      id: json['id'] ?? '',
      name: json['name'],
      image: json['image'],
      location: json['location'],
      businessName: json['businessName'],
      averageRating: json['averageRating']?.toDouble(),
      totalReviews: json['totalReviews'],
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt'].toString()) : null,
    );
  }
}
