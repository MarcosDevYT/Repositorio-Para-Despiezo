class UserModel {
  final String id;
  final String email;
  final String? name;
  final String? image;
  final String? description;
  final String? phoneNumber;
  final String? location;
  final String? businessName;
  final String? businessBannerUrl;
  final List<String> bussinesCategory;
  final double? averageRating;
  final int? totalReviews;
  final DateTime? emailVerified;
  final bool pro;
  final bool stripeConnectedLinked;
  final List<AddressModel> addresses;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.email,
    this.name,
    this.image,
    this.description,
    this.phoneNumber,
    this.location,
    this.businessName,
    this.businessBannerUrl,
    this.bussinesCategory = const [],
    this.averageRating,
    this.totalReviews,
    this.emailVerified,
    this.pro = false,
    this.stripeConnectedLinked = false,
    this.addresses = const [],
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'],
      image: json['image'],
      description: json['description'],
      phoneNumber: json['phoneNumber'],
      location: json['location'],
      businessName: json['businessName'],
      businessBannerUrl: json['businessBannerUrl'],
      bussinesCategory: json['bussinesCategory'] != null
          ? List<String>.from(json['bussinesCategory'])
          : [],
      averageRating: json['averageRating']?.toDouble(),
      totalReviews: json['totalReviews'],
      emailVerified: json['emailVerified'] != null
          ? DateTime.tryParse(json['emailVerified'].toString())
          : null,
      pro: json['pro'] ?? false,
      stripeConnectedLinked: json['stripeConnectedLinked'] ?? false,
      addresses: json['addresses'] != null
          ? (json['addresses'] as List).map((a) => AddressModel.fromJson(a)).toList()
          : [],
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }
}

class AddressModel {
  final String id;
  final String street;
  final String number;
  final String city;
  final String postalCode;
  final String country;
  final bool isDefault;

  AddressModel({
    required this.id,
    required this.street,
    required this.number,
    required this.city,
    required this.postalCode,
    required this.country,
    this.isDefault = false,
  });

  factory AddressModel.fromJson(Map<String, dynamic> json) {
    return AddressModel(
      id: json['id'] ?? '',
      street: json['street'] ?? '',
      number: json['number'] ?? '',
      city: json['city'] ?? '',
      postalCode: json['postalCode'] ?? '',
      country: json['country'] ?? '',
      isDefault: json['isDefault'] ?? false,
    );
  }
}
