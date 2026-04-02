class ApiConfig {
  static const String baseUrl = 'https://despiezo.com';

  // Auth
  static const String loginEndpoint = '/api/mobile/auth/login';
  static const String registerEndpoint = '/api/mobile/auth/register';
  static const String meEndpoint = '/api/mobile/auth/me';

  // Products
  static const String productsEndpoint = '/api/mobile/products';
  static const String featuredEndpoint = '/api/mobile/products/featured';
  static const String favoritesEndpoint = '/api/mobile/favorites';
  static String productDetailEndpoint(String id) => '/api/mobile/products/$id';

  // Search
  static const String searchSuggestEndpoint = '/api/search/suggest';

  // Vehicle data
  static const String marcasEndpoint = '/api/marcas';
  static const String modelosEndpoint = '/api/modelos';
  static String matriculaEndpoint(String plate) => '/api/mobile/matricula/$plate';

  // Chat
  static const String chatRoomsEndpoint = '/api/mobile/chat/rooms';
  static const String chatMessagesEndpoint = '/api/mobile/chat/messages';
  static String chatRoomDetailEndpoint(String id) => '/api/mobile/chat/rooms/$id';
}
